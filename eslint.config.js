import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
 

export default [ 
  {
    ignores: [
      "**/*.hbs",
      "**/node_modules/",
      "**/dist/",
      "**/*.config.js",
      "**/*.config.ts",
      ".stylelintrc.cjs",
    ],
  }, 
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
];
