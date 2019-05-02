module.exports = {
  env: { node: true },
  globals: { Promise: false },
  extends: ["eslint:recommended", "plugin:prettier/recommended"],
  plugins: ["@typescript-eslint"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    sourceType: "module",
    project: "tsconfig.json"
  },
  rules: {}
};
