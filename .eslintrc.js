module.exports = {
  env: { node: true },
  extends: [
    "eslint:recommended",
    "plugin:prettier/recommended",
  ],
  plugins: ["@typescript-eslint"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    sourceType: "module",
    project: "tsconfig.json"
  },
  rules: {}
};
