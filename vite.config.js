import { defineConfig } from "vite";

import SilverBlog from "./tools/plugins/silverblog";
import config from "./develop.json";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
    publicDir: "public/custom",
    build: {
        outDir: "public/dist",
        manifest: true,
        rollupOptions: {
            input: 'src/main.ts',
        },
    },
    plugins: [
        svelte(),
        SilverBlog(config.SilverBlogServer),
    ],
});
