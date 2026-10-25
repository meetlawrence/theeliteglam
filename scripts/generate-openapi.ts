import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const inventoryPath = path.resolve("api-route-inventory.json");
const apiRoot = path.resolve("src/app/api");
const outputPath = path.resolve("public/openapi.json");

const httpMethods = [
  "get",
  "post",
  "put",
  "patch",
  "delete",
  "options",
  "head",
] as const;

type HttpMethod = (typeof httpMethods)[number];

interface RouteRecord {
  file: string;
  path: string;
  methods: string[];
}

type JsonSchema = Record<string, unknown>;
type OpenApiParameter = {
  name: string;
  in: "path" | "query" | "header";
  required: boolean;
  description: string;
  schema: JsonSchema;
};

function getMethodSource(source: string, method: string): string {
  const exports = [
    ...source.matchAll(
      /^\s*export\s+(?:async\s+)?function\s+(GET|POST|PUT|PATCH|DELETE|OPTIONS|HEAD)\b/gm,
    ),
  ];
  const methodIndex = exports.findIndex(
    (match) => match[1]?.toLowerCase() === method,
  );

  if (methodIndex === -1) {
    return source;
  }

  const start = exports[methodIndex].index ?? 0;
  const end = exports[methodIndex + 1]?.index ?? source.length;
  return source.slice(start, end);
}

function removeLineComments(source: string): string {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "");
}

function routeSummary(routePath: string, method: HttpMethod): string {
  const segments = routePath.split("/").filter(Boolean).slice(1);
  const endpointSegment = [...segments]
    .reverse()
    .find((segment) => !/^\{[^}]+\}$/.test(segment));
  const endpoint = (endpointSegment ?? "")
    .replace(/-/g, " ")
    .toLowerCase()
    .replace(/\bconstestants\b/g, "contestants");
  const endpointWords = endpoint
    .replace(/\s+/g, " ")
    .trim();
  if (endpointWords === "me") {
    return "Get current user";
  }
  if (endpointWords === "webhook") {
    return "Process payment webhook";
  }
  if (endpointWords === "users" && segments[0] === "admin") {
    return method === "get"
      ? "List admins"
      : method === "patch"
        ? "Manage admin roles or verification"
        : "Delete an admin";
  }
  if (endpointWords === "categories") {
    return method === "get"
      ? "List categories"
      : method === "post"
        ? "Create a category"
        : method === "patch"
          ? "Update a category"
          : "Delete a category";
  }
  const actionPrefix = /^(get|post|patch|delete|put)\s+/i;
  const namedAction = endpointWords.match(
    /^(login|logout|signup|verify email|verify payment|verify|reset password|forgot password|initialize|resend email|retry fulfillment|upload image|application image|registration status|status)\b/i,
  );

  if (namedAction) {
    const action = namedAction[1]
      .replace(/^login$/i, "Log in")
      .replace(/^logout$/i, "Log out")
      .replace(/^signup$/i, "Sign up")
      .replace(/^verify email$/i, "Verify email")
      .replace(/^verify payment$/i, "Verify payment")
      .replace(/^verify$/i, "Verify")
      .replace(/^reset password$/i, "Reset password")
      .replace(/^forgot password$/i, "Request a password reset")
      .replace(/^initialize$/i, "Initialize")
      .replace(/^resend email$/i, "Resend email")
      .replace(/^retry fulfillment$/i, "Retry fulfillment")
      .replace(/^upload image$/i, "Upload image")
      .replace(/^application image$/i, "Upload application image")
      .replace(/^registration status$/i, "Check registration status")
      .replace(/^status$/i, "Get status");
    const remainder = endpointWords.slice(namedAction[0].length).trim();
    const parent = segments[segments.length - 2]?.replace(/-/g, " ");
    if (/^(log in|log out|sign up|request a password reset|reset password|verify email)$/i.test(action)) {
      return `${action}${remainder ? ` ${remainder}` : ""}`;
    }
    if (/^status$/i.test(namedAction[1]) && parent === "event") {
      return "Get event status";
    }
    const resource = remainder || (
      parent === "payment" && /^(initialize|verify)$/i.test(namedAction[1])
        ? "payment"
        : ""
    );
    return `${action}${resource ? ` ${resource}` : ""}`;
  }

  const resourceName = endpointWords.replace(actionPrefix, "");
  if (endpointWords.toLowerCase() === "payment" && segments[0] === "ticket") {
    return "Create ticket payment";
  }
  const action = method === "get"
    ? "Get"
    : method === "post"
      ? "Create"
      : method === "patch"
        ? "Update"
        : method === "delete"
          ? "Delete"
          : method.toUpperCase();

  return `${action} ${resourceName || "API resource"}`;
}

function getRequestBodyProperties(source: string): string[] {
  const destructuring = source.match(
    /const\s*\{([\s\S]*?)\}\s*=\s*await\s+(?:req|request)\.json\s*\(\s*\)/,
  );

  if (!destructuring?.[1]) {
    return [];
  }

  return destructuring[1]
    .split(",")
    .map((field) => field.trim().match(/^([A-Za-z_$][\w$]*)/)?.[1])
    .filter((field): field is string => Boolean(field));
}

function getKnownRequestSchema(
  routeFile: string,
  source: string,
): JsonSchema | undefined {
  const stringField = { type: "string" };
  const emailField = { type: "string", format: "email" };

  const schemas: Record<string, JsonSchema> = {
    "auth/login/route.ts": {
      type: "object",
      required: ["email", "password"],
      properties: { email: emailField, password: stringField },
      additionalProperties: true,
    },
    "auth/signup/route.ts": {
      type: "object",
      required: ["name", "email", "password"],
      properties: {
        name: stringField,
        email: emailField,
        password: stringField,
      },
      additionalProperties: true,
    },
    "auth/forgot-password/route.ts": {
      type: "object",
      required: ["email"],
      properties: { email: emailField },
      additionalProperties: true,
    },
    "auth/verify-email/route.ts": {
      type: "object",
      required: ["token"],
      properties: { token: stringField },
      additionalProperties: true,
    },
    "auth/reset-password/route.ts": {
      type: "object",
      required: ["password", "confirmPassword"],
      properties: {
        password: stringField,
        confirmPassword: stringField,
      },
      additionalProperties: true,
    },
    "payment/initialize/route.ts": {
      oneOf: [
        {
          type: "object",
          required: [
            "purpose",
            "method",
            "eventId",
            "email",
            "ticketTypeId",
            "quantity",
          ],
          properties: {
            purpose: { type: "string", enum: ["TICKET"] },
            method: { type: "string", enum: ["PAYSTACK", "OPAY"] },
            eventId: stringField,
            email: emailField,
            phoneNumber: stringField,
            name: stringField,
            ticketTypeId: stringField,
            quantity: { type: "integer", minimum: 1, maximum: 10 },
          },
          additionalProperties: true,
        },
        {
          type: "object",
          required: ["purpose", "method", "eventId", "email", "name"],
          properties: {
            purpose: { type: "string", enum: ["CONTESTANT"] },
            method: { type: "string", enum: ["PAYSTACK", "OPAY"] },
            eventId: stringField,
            email: emailField,
            phoneNumber: stringField,
            name: { type: "string", minLength: 2, maxLength: 100 },
          },
          additionalProperties: true,
        },
      ],
    },
    "payment/resend-email/route.ts": {
      type: "object",
      required: ["reference"],
      properties: {
        reference: { type: "string", minLength: 8, maxLength: 100 },
      },
      additionalProperties: true,
    },
    "payment/retry-fulfillment/route.ts": {
      type: "object",
      required: ["reference"],
      properties: {
        reference: { type: "string", minLength: 8, maxLength: 100 },
      },
      additionalProperties: true,
    },
    "contestants/post-contestant/route.ts": {
      type: "object",
      properties: {
        name: stringField,
        email: emailField,
        gender: { type: "string", enum: ["MALE", "FEMALE"] },
        image: stringField,
        stageName: stringField,
        height: { type: "number" },
        weight: { type: "number" },
        bio: stringField,
        portfolio: stringField,
        phone: stringField,
        age: { type: "integer" },
        state: stringField,
        country: stringField,
        occupation: stringField,
        advocacy: stringField,
        funFact: stringField,
        tribe: stringField,
        contestantCategories: { type: "string", enum: ["MALE", "FEMALE"] },
        eventId: stringField,
        reference: stringField,
        paymentTransactionId: stringField,
      },
      additionalProperties: true,
    },
    "ticket/payment/route.ts": {
      type: "object",
      required: ["email", "name", "ticketTypeId", "quantity"],
      properties: {
        email: emailField,
        name: stringField,
        ticketTypeId: stringField,
        quantity: { type: "integer", minimum: 1 },
        phoneNumber: stringField,
        eventId: stringField,
      },
      additionalProperties: true,
    },
    "admin/users/route.ts": {
      type: "object",
      required: ["id"],
      properties: {
        id: stringField,
        role: { type: "string", enum: ["SUPER_ADMIN", "ADMIN"] },
        action: { type: "string", enum: ["VERIFY"] },
      },
      additionalProperties: true,
    },
  };

  if (routeFile === "payment/webhook/route.ts" && /\breq\.text\s*\(\s*\)/.test(source)) {
    return {
      type: "object",
      required: ["event", "data"],
      properties: {
        event: stringField,
        data: {
          type: "object",
          properties: { reference: stringField },
          additionalProperties: true,
        },
      },
      additionalProperties: true,
    };
  }

  return schemas[routeFile];
}

function getParameters(
  routePath: string,
  source: string,
): OpenApiParameter[] {
  const parameters: OpenApiParameter[] = [];

  for (const [, name] of routePath.matchAll(/\{([^}]+)\}/g)) {
    parameters.push({
      name,
      in: "path",
      required: true,
      description: `The ${name} path parameter.`,
      schema: { type: "string" },
    });
  }

  for (const [, name] of source.matchAll(
    /searchParams(?:\?\.|\.)get\(\s*["']([^"']+)["']\s*\)/g,
  )) {
    if (parameters.some((parameter) => parameter.in === "query" && parameter.name === name)) {
      continue;
    }

    const isOptional = source.includes(`?.get("${name}")`) ||
      source.includes(`?.get('${name}')`) ||
      (name === "reference" && source.includes("paymentReference"));

    parameters.push({
      name,
      in: "query",
      required: !isOptional,
      description: name === "id"
        ? "The identifier of the resource."
        : name === "eventId"
          ? "The identifier of the event."
          : name === "reference"
            ? "The payment reference."
            : `The ${name} value used by this operation.`,
      schema: { type: "string" },
    });
  }

  for (const [, name] of source.matchAll(
    /headers\.get\(\s*["']([^"']+)["']\s*\)/g,
  )) {
    parameters.push({
      name,
      in: "header",
      required: true,
      description: name === "Idempotency-Key"
        ? "Unique key for safely retrying this payment initialization request (8–128 characters)."
        : name.toLowerCase() === "x-paystack-signature"
          ? "HMAC SHA-512 signature supplied by Paystack for webhook verification."
          : "Request header required by the route handler.",
      schema: { type: "string" },
    });
  }

  return parameters;
}

function getResponses(
  method: HttpMethod,
  source: string,
): Record<string, { description: string; content: Record<string, unknown> }> {
  const statusCodes = new Set<string>();
  for (const [, status] of source.matchAll(/status:\s*(\d{3})/g)) {
    statusCodes.add(status);
  }
  const authenticated =
    /authMiddleware\s*\(\s*req\s*\)|(?:req\.cookies|cookieStore|cookies)\.get\(\s*["']accessToken["']\s*\)/.test(
      source,
    );
  if (authenticated) {
    statusCodes.add("401");
  }

  const fallbackSuccess = source.match(/status:\s*result\.status\s*\|\|\s*(\d{3})/);
  if (fallbackSuccess?.[1]) {
    statusCodes.add(fallbackSuccess[1]);
  }

  if (![...statusCodes].some((status) => status.startsWith("2"))) {
    statusCodes.add(method === "post" && source.includes("status: 201") ? "201" : "200");
  }

  const responses: Record<
    string,
    { description: string; content: Record<string, unknown> }
  > = {};

  for (const status of [...statusCodes].sort()) {
    const isSuccess = status.startsWith("2");
    responses[status] = {
      description: isSuccess
        ? status === "201"
          ? "The resource was created successfully."
          : "The request completed successfully."
        : status === "400"
          ? "The request is invalid or missing required input."
          : status === "401"
            ? "Authentication is required or the credentials are invalid."
            : status === "403"
              ? "The caller is not allowed to perform this operation."
              : status === "404"
                ? "The requested resource was not found."
                : status === "409"
                  ? "The request conflicts with the current resource or processing state."
                  : status === "402"
                    ? "Payment is required or has not completed."
                    : status === "500"
                      ? "An unexpected server error occurred."
                      : status === "502"
                        ? "An upstream service is unavailable or returned an invalid response."
                        : "The route returned an error response.",
      content: {
        "application/json": {
          schema: { $ref: isSuccess ? "#/components/schemas/ApiResponse" : "#/components/schemas/ApiError" },
        },
      },
    };
  }

  return responses;
}

function getOperation(
  route: RouteRecord,
  method: HttpMethod,
  source: string,
): Record<string, unknown> {
  const summary = routeSummary(route.path, method);
  const parameters = getParameters(route.path, source);
  const bodyProperties = getRequestBodyProperties(source);
  const knownRequestSchema = getKnownRequestSchema(route.file, source);
  const optionalAuthentication =
    source.includes("paymentReference") && /authMiddleware\s*\(\s*req\s*\)/.test(source);
  const operation: Record<string, unknown> = {
    operationId: [
      method,
      ...route.path
        .replace(/^\/api\//, "")
        .replace(/[{}]/g, "")
        .split("/")
        .filter(Boolean)
        .map((segment) => segment.replace(/[^a-zA-Z0-9]/g, "-")),
    ]
      .join("-")
      .replace(/-+/g, "-"),
    summary,
    description: [
      summary + ".",
      parameters.length
        ? `Uses ${parameters.map((parameter) => `${parameter.in} parameter \`${parameter.name}\``).join(", ")}.`
        : "",
      source.match(/\b(?:req|request)\.formData\s*\(\s*\)/)
        ? "Accepts multipart form data."
        : source.match(/\b(?:req|request)\.(?:json|text)\s*\(\s*\)/)
          ? "Accepts a JSON request body."
          : "",
      optionalAuthentication
        ? "The payment-reference registration flow is public; the administrative flow requires an authenticated access-token cookie."
        : /authMiddleware\s*\(\s*req\s*\)|(?:req\.cookies|cookieStore|cookies)\.get\(\s*["']accessToken["']\s*\)/.test(source)
          ? "Requires an authenticated access-token cookie."
        : "",
    ]
      .filter(Boolean)
      .join(" "),
    tags: [route.path.split("/").filter(Boolean)[1] ?? "API"],
    responses: getResponses(method, source),
    "x-documentation-status": "generated-from-route-handler",
    "x-source-file": route.file,
  };

  if (parameters.length) {
    operation.parameters = parameters;
  }

  if (/\b(?:req|request)\.formData\s*\(\s*\)/.test(source)) {
    const formFields = [
      ...source.matchAll(/formData\.get\(\s*["']([^"']+)["']\s*\)/g),
    ].map(([, name]) => [
      name,
      name === "image"
        ? { type: "string", format: "binary" }
        : { type: "string" },
    ]);

    operation.requestBody = {
      required: true,
      content: {
        "multipart/form-data": {
          schema: {
            type: "object",
            required: formFields.map(([name]) => name),
            properties: Object.fromEntries(formFields),
          },
        },
      },
    };
  } else if (/\b(?:req|request)\.(?:json|text)\s*\(\s*\)/.test(source)) {
    operation.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: knownRequestSchema ?? {
            type: "object",
            ...(bodyProperties.length
              ? {
                  properties: Object.fromEntries(
                    bodyProperties.map((property) => [property, {}]),
                  ),
                }
              : {}),
            additionalProperties: true,
          },
        },
      },
    };
  }

  if (
    /authMiddleware\s*\(\s*req\s*\)|(?:req\.cookies|cookieStore|cookies)\.get\(\s*["']accessToken["']\s*\)/.test(
      source,
    )
  ) {
    operation.security = optionalAuthentication
      ? [{}, { AccessTokenCookie: [] }]
      : [{ AccessTokenCookie: [] }];
  }

  return operation;
}

async function main(): Promise<void> {
  const inventoryContent = await readFile(inventoryPath, "utf8");
  const routes = JSON.parse(inventoryContent) as RouteRecord[];
  const paths: Record<string, Partial<Record<HttpMethod, Record<string, unknown>>>> = {};
  const tags = new Set<string>();
  const tagDescriptions: Record<string, string> = {
    admin: "Administrative account and role management.",
    auth: "Account registration, authentication, and recovery.",
    categories: "Event category management.",
    contestants: "Contestant registration and management.",
    countries: "Country and calling-code lookup.",
    event: "Event management and status.",
    payment: "Payment initialization, verification, and fulfillment.",
    sponsor: "Event sponsor management.",
    ticket: "Ticket sales, types, and payment verification.",
  };

  for (const route of routes) {
    paths[route.path] ??= {};
    const source = removeLineComments(
      await readFile(path.join(apiRoot, route.file), "utf8"),
    );

    for (const rawMethod of route.methods) {
      const method = rawMethod.toLowerCase() as HttpMethod;

      if (!httpMethods.includes(method)) {
        console.warn(`Skipping unsupported method "${rawMethod}" in ${route.file}`);
        continue;
      }

      if (paths[route.path][method]) {
        console.warn(`Duplicate operation detected: ${rawMethod} ${route.path}`);
        continue;
      }

      const methodSource = getMethodSource(source, method);
      paths[route.path][method] = getOperation(route, method, methodSource);
      tags.add(route.path.split("/").filter(Boolean)[1] ?? "API");
    }
  }

  const openApiDocument = {
    openapi: "3.0.3",
    info: {
      title: "TheEliteGlam API",
      version: "1.0.0",
      description:
        "API reference generated from the implemented Next.js route handlers. It documents route parameters, known request fields, response statuses, and authentication; service-specific JSON response payloads may contain additional properties.",
    },
    tags: [...tags]
      .sort()
      .map((name) => ({
        name,
        description: tagDescriptions[name] ?? `${name} API operations.`,
      })),
    servers: [{ url: "/", description: "The current TheEliteGlam deployment." }],
    paths,
    components: {
      securitySchemes: {
        AccessTokenCookie: {
          type: "apiKey",
          in: "cookie",
          name: "accessToken",
          description: "Access token cookie set by the login endpoint.",
        },
      },
      schemas: {
        ApiResponse: {
          type: "object",
          description:
            "Successful JSON response. The exact data properties depend on the endpoint.",
          additionalProperties: true,
        },
        ApiError: {
          type: "object",
          description: "Error response returned by an API route.",
          properties: {
            success: { type: "boolean", enum: [false] },
            message: { type: "string" },
            error: { type: "string" },
          },
          additionalProperties: true,
        },
      },
    },
  };

  await writeFile(
    outputPath,
    `${JSON.stringify(openApiDocument, null, 2)}\n`,
    "utf8",
  );

  const operationCount = Object.values(paths).reduce(
    (total, routeMethods) => total + Object.keys(routeMethods).length,
    0,
  );

  console.log(`OpenAPI paths generated: ${Object.keys(paths).length}`);
  console.log(`OpenAPI operations generated: ${operationCount}`);
  console.log(`OpenAPI document written to: ${outputPath}`);
}

main().catch((error: unknown) => {
  console.error("OpenAPI generation failed:", error);
  process.exitCode = 1;
});
