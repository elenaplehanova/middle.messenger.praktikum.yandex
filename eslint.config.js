import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import hbsPlugin from "eslint-plugin-hbs";

export default [
  // Базовые настройки игнорирования
  {
    ignores: ["**/node_modules/", "**/dist/", "**/*.config.js"],
  },

  // Настройки для TypeScript
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      ...tsPlugin.configs["recommended-type-checked"].rules,
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/consistent-type-imports": "error",
    },
  },

  // Настройки для Handlebars
  {
    files: ["**/*.hbs"],
    plugins: {
      hbs: hbsPlugin,
    },
    rules: {
      "hbs/no-partials": "off",
    },
  },
];
