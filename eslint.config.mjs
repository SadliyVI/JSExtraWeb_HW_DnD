import js from "@eslint/js";
import globals from "globals";
import pluginImport from "eslint-plugin-import";
import prettierConfig from "eslint-config-prettier";

export default [
    {
        ignores: ["dist/", "coverage/", "**/*.test.js"],
    },

    {
        files: ["src/**/*.js"],

        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.jest,
            },
        },

        plugins: {
            import: pluginImport,
        },

        rules: {
            ...js.configs.recommended.rules,
            ...pluginImport.configs.recommended.rules,

            ...prettierConfig.rules,

            "import/order": [
                "error",
                {
                    groups: [
                        "builtin",
                        "external",
                        "internal",
                        "parent",
                        "sibling",
                        "index",
                    ],
                    "newlines-between": "always",
                },
            ],
        },
    },
];