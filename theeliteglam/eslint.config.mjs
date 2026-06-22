import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettierRecommended from "eslint-plugin-prettier/recommended";
import globals from "globals";

const eslintConfig = defineConfig([
  // Next.js performance rules
  ...nextVitals,

  // Next.js + TypeScript rules
  ...nextTs,

  // Prettier integration
  prettierRecommended,

  // Custom rules for your project
  {
    files: ["**/*.{ts,tsx}"], // Only TypeScript files
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },
      parserOptions: {
        project: "./tsconfig.json", //This line is important
      },
    },
    rules: {
      // Prettier formatting issues = errors
      "prettier/prettier": [
        "error",
        {
          singleQuote: false,
          parser: "flow",
          semi: true,
          endOfLine: "auto",
          trailingComma: "es5",
          tabWidth: 2,
          printWidth: 100,
        },
      ],

      // TypeScript rules
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-floating-promises": "error",

      // General rules
      "no-console": "warn", // Warn on console logs
      eqeqeq: ["error", "always"], // Enforce strict equality
      "no-var": "error",
    },
  },

  // Override default ignores of eslint-config-next
  globalIgnores([
    ".next/**", // Next.js build output
    "out/**", // Static export folder
    "build/**", // Custom build folder
    "next-env.d.ts", // Auto-generated Next.js TS env file
    "node_modules/**",
    "dist/**",
    "coverage/**",
  ]),
]);

export default eslintConfig;
