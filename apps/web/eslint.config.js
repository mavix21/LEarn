import baseConfig, { restrictEnvAccess } from "@myapp/eslint-config/base";
import nextjsConfig from "@myapp/eslint-config/next-js";
import reactConfig from "@myapp/eslint-config/react";

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
