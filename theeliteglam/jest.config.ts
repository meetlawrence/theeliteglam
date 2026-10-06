import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest/presets/default-esm", // ESM-aware preset for Prisma
  testEnvironment: "node",
  roots: ["<rootDir>/src/back-end/jest-test"],
  testMatch: ["**/*.test.ts", "**/*.spec.ts"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  clearMocks: true,
  restoreMocks: true,
  verbose: true,
  testTimeout: 30000,
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: {
          module: "esnext",
          moduleResolution: "node",
          esModuleInterop: true,
          strict: true,
        },
      },
    ],
  },
  extensionsToTreatAsEsm: [".ts"],
};

export default config;
