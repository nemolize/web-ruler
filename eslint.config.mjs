import gitignore from "eslint-config-flat-gitignore";
import tseslint from "typescript-eslint";
import nextPlugin from "@next/eslint-plugin-next";
import unusedImports from "eslint-plugin-unused-imports";

export default [
  gitignore(),
  ...tseslint.configs.recommended,
  nextPlugin.configs["core-web-vitals"],
  {
    plugins: {
      "unused-imports": unusedImports,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "error",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
    },
  },
];
