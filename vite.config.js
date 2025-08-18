import { defineConfig } from "vite";

import SilverBlog from "./tools/plugins/silverblog";
import config from "./develop.json";
import solidPlugin from "vite-plugin-solid";

import sharedConfig from "./develop.json";
import { viteStaticCopy } from "vite-plugin-static-copy";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    publicDir: "public/custom",
    build: {
        outDir: "public/dist",
        manifest: true,
        rollupOptions: {
            input: "src/main.ts",
        },
    },
    plugins: [
        tailwindcss(),
        solidPlugin(),
        SilverBlog(config.SilverBlogServer),
        viteStaticCopy({
            targets: [
                {
                    src: "node_modules/sql.js/dist/worker.sql-wasm.js",
                    dest: "vendors/sql.js/",
                },
                {
                    src: "node_modules/sql.js/dist/sql-wasm.wasm",
                    dest: "vendors/sql.js/",
                },
            ],
        }),
    ],
    server: {
        origin: sharedConfig.ViteHMRServer,
    },
});
