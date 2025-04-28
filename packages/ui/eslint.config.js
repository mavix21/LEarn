import baseConfig from "@skill-based/eslint-config/base";
import reactConfig from "@skill-based/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ["dist/**"],
  },
  ...baseConfig,
  ...reactConfig,
];
