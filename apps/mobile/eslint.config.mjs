// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import nextPlugin from "@next/eslint-plugin-next";

export default tseslint.config(
  { ignores: ["node_modules/**",".next/**","out/**","public/**","prisma/generated/**","coverage/**","next-env.d.ts","capacitor.config.ts","eslint.config.mjs","next.config.mjs","postcss.config.mjs","prisma/seed.ts","scripts/**","electron/**","tests/e2e/**","**/*.config.js","**/*.config.cjs"] },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    plugins: { react: reactPlugin, "react-hooks": reactHooksPlugin, "@next/next": nextPlugin },
    languageOptions: { ecmaVersion: 2024, sourceType: "module", parserOptions: { project: "./tsconfig.json", tsconfigRootDir: import.meta.dirname } },
    settings: { react: { version: "detect" } },
    rules: {
      "react/no-unescaped-entities": "off",
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" }],
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-unsafe-enum-comparison": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/require-await": "warn",
      "@typescript-eslint/no-misused-promises": "warn",
      "@typescript-eslint/no-floating-promises": "warn",
      "@typescript-eslint/no-base-to-string": "off",
      "@typescript-eslint/no-unnecessary-type-assertion": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/restrict-template-expressions": "off",
      "@typescript-eslint/await-thenable": "off",
      "@typescript-eslint/no-redundant-type-constituents": "off",
      "prefer-rest-params": "off",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "warn",
      "no-empty": "warn",
      eqeqeq: ["error", "always", { null: "ignore" }],
      curly: ["warn", "multi-line"],
      "prefer-const": "warn",
      "@next/next/no-html-link-for-pages": "error",
      "@next/next/no-img-element": "warn",
    },
  },
);
