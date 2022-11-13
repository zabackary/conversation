module.exports = {
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
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
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
      "error",
      "ignorePackages",
      {
        ts: "never",
        tsx: "never",
      },
    ],
    "no-use-before-define": "off",
    "@typescript-eslint/no-use-before-define": ["error"],
    "react/jsx-filename-extension": ["warn", { extensions: [".tsx"] }],
    "no-shadow": "off",
    "@typescript-eslint/no-shadow": ["error"],
  },
};
