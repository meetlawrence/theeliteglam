
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const apiRoot = path.resolve("src/app/api");
const outputPath = path.resolve("api-route-inventory.json");

const httpMethods = [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "OPTIONS",
  "HEAD",
] as const;

type HttpMethod = (typeof httpMethods)[number];

interface RouteRecord {
  file: string;
  path: string;
  methods: HttpMethod[];
}

async function findRouteFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await findRouteFiles(fullPath)));
    } else if (/^route\.(ts|js)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

function getExportedMethods(source: string): HttpMethod[] {
  const methods = new Set<HttpMethod>();

  for (const method of httpMethods) {
    const functionExport = new RegExp(
      String.raw`^\s*export\s+(?:async\s+)?function\s+${method}\b`,
      "m",
    );

    const variableExport = new RegExp(
      String.raw`^\s*export\s+(?:const|let|var)\s+${method}\b`,
      "m",
    );

    if (functionExport.test(source) || variableExport.test(source)) {
      methods.add(method);
    }
  }

  return [...methods];
}

async function main(): Promise<void> {
  const files = await findRouteFiles(apiRoot);
  const routes: RouteRecord[] = [];

  for (const file of files.sort()) {
    const source = await readFile(file, "utf8");
    const relativeFile = path
      .relative(apiRoot, file)
      .split(path.sep)
      .join("/");

    const routePath = `/api/${relativeFile
      .replace(/\/route\.(ts|js)$/, "")
      .replace(/\[([^\]]+)\]/g, "{$1}")}`;

    routes.push({
      file: relativeFile,
      path: routePath,
      methods: getExportedMethods(source),
    });
  }

  await writeFile(
    outputPath,
    JSON.stringify(routes, null, 2) + "\n",
    "utf8",
  );

  const methodCount = routes.reduce(
    (total, route) => total + route.methods.length,
    0,
  );

  console.log(`Route files discovered: ${routes.length}`);
  console.log(`HTTP method exports detected: ${methodCount}`);
  console.log(`Inventory written to: ${outputPath}`);

  for (const route of routes) {
    console.log(
      `${route.methods.length ? route.methods.join(", ") : "UNKNOWN"} ${route.path}`,
    );
  }
}

main().catch((error: unknown) => {
  console.error("API route discovery failed:", error);
  process.exitCode = 1;
});
