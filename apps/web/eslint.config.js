import baseConfig, { restrictEnvAccess } from "@learn/eslint-config/base";
import nextjsConfig from "@learn/eslint-config/next-js";
import reactConfig from "@learn/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".next/**"],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  ...restrictEnvAccess,
];
