
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const inventoryPath = path.resolve("api-route-inventory.json");
const outputPath = path.resolve("openapi.json");

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

interface OpenApiOperation {
  operationId: string;
  summary: string;
  description: string;
  tags: string[];
  responses: Record<string, { description: string }>;
  "x-documentation-status": "needs-review";
  "x-source-file": string;
}

async function main(): Promise<void> {
  const inventoryContent = await readFile(inventoryPath, "utf8");
  const routes = JSON.parse(inventoryContent) as RouteRecord[];

  const paths: Record<string, Partial<Record<HttpMethod, OpenApiOperation>>> =
    {};

  for (const route of routes) {
    paths[route.path] ??= {};

    for (const rawMethod of route.methods) {
      const method = rawMethod.toLowerCase() as HttpMethod;

      if (!httpMethods.includes(method)) {
        console.warn(
          `Skipping unsupported method "${rawMethod}" in ${route.file}`,
        );
        continue;
      }

      if (paths[route.path][method]) {
        console.warn(
          `Duplicate operation detected: ${rawMethod} ${route.path}`,
        );
        continue;
      }

      const routeName = route.path
        .replace(/^\/api\//, "")
        .replace(/[{}]/g, "")
        .split("/")
        .filter(Boolean);

      const operationId = [
        method,
        ...routeName.map((segment) =>
          segment.replace(/[^a-zA-Z0-9]/g, "-"),
        ),
      ]
        .join("-")
        .replace(/-+/g, "-");

      const tag = routeName[0] ?? "API";

      paths[route.path][method] = {
        operationId,
        summary: `${method.toUpperCase()} ${route.path}`,
        description:
          "Generated from the route inventory. Verify the request, response, authentication, and error behavior against the route handler.",
        tags: [tag],
        responses: {
          default: {
            description:
              "Response details need verification against the implementation.",
          },
        },
        "x-documentation-status": "needs-review",
        "x-source-file": route.file,
      };
    }
  }

  const openApiDocument = {
    openapi: "3.1.0",
    info: {
      title: "TheEliteGlam API",
      version: "1.0.0",
      description:
        "API documentation for TheEliteGlam. Generated operations require review before being treated as verified contracts.",
    },
    paths,
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
