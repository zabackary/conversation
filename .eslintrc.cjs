// @ts-check

const path = require("node:path");

/** @type {import("eslint").Linter.Config} */
const config = {
  ignorePatterns: ["/*", "!/src"],
  settings: {
    "import/resolver": {
      typescript: {},
    },
  },
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "airbnb",
    "prettier",
    "plugin:react/jsx-runtime",
    "plugin:prettier/recommended",
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
    project: [path.join(__dirname, "tsconfig.json")],
  },
  plugins: [
    "react",
    "@typescript-eslint/eslint-plugin",
    "prettier",
    "react-hooks",
  ],
  rules: {
    "prettier/prettier": 0,
    "import/extensions": [
      2,
      "ignorePackages",
      {
        ts: "never",
        tsx: "never",
      },
    ],
    "no-use-before-define": 0,
    "@typescript-eslint/no-use-before-define": [2],
    "react/jsx-filename-extension": [1, { extensions: [".tsx"] }],
    "no-shadow": 0,
    "@typescript-eslint/no-shadow": [
      2,
      {
        allow: ["_"],
      },
    ],
    "react/require-default-props": 0,
    "react/prop-types": 0,
    "@typescript-eslint/no-unused-vars": [
      1,
      {
        varsIgnorePattern: "^_",
        argsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      },
    ],
    "no-restricted-syntax": 0,
    "@typescript-eslint/ban-ts-comment": [
      2,
      {
        "ts-ignore": "allow-with-description",
        minimumDescriptionLength: 10,
      },
    ],
    "class-methods-use-this": 0,
    "no-console": 0, // TODO: Remove and fix on production
    "no-useless-constructor": "off",
    "@typescript-eslint/no-useless-constructor": 1,
    "@typescript-eslint/no-unnecessary-condition": 1,
    "no-void": 0,
    "default-case": 0,
  },
};

module.exports = config;
