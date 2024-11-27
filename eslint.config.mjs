import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: {
      globals: {
        ...globals.node,
        // You can add any additional global variables you need here
      },
      parser: pluginJs.configs.recommended.parser, // Ensure the correct parser is used
    },
  },
  pluginJs.configs.recommended,
];
