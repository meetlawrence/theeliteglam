import type { defineConfig } from "jest";

const config: defineConfig = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>"],
  testMatch: ["**/*.test.ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@prisma/client$": "<rootDir>/src/backend/db/generated/prisma/client",
  },
  verbose: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
};

export default config;
