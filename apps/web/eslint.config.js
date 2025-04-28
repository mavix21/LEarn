import baseConfig, { restrictEnvAccess } from "@skill-based/eslint-config/base";
import nextjsConfig from "@skill-based/eslint-config/next-js";
import reactConfig from "@skill-based/eslint-config/react";

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
