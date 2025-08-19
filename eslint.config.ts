import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import json from "@eslint/json";
import solid from "eslint-plugin-solid";
import prettier from "eslint-plugin-prettier";
import eslintConfigPrettier from "eslint-config-prettier";
import { defineConfig } from "eslint/config";

export default defineConfig([
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
        plugins: { js },
        extends: ["js/recommended"],
        languageOptions: { globals: globals.browser },
    },
    tseslint.configs.recommended as any,
    {
        files: ["**/*.{js,jsx,ts,tsx,solid}"],
        plugins: {
            solid: solid as any,
            prettier: prettier,
        },
        rules: {
            ...solid.configs.recommended.rules,
            "prettier/prettier": "error",
        },
        languageOptions: {
            parserOptions: {
                ecmaFeatures: { jsx: true },
            },
        },
    },
    { files: ["**/*.json"], plugins: { json }, language: "json/json", extends: ["json/recommended"] },
    eslintConfigPrettier,
    {
        rules: {
            "@typescript-eslint/no-explicit-any": "off",
        },
    },
]);
