import { defineConfig } from "vite";

import SilverBlog from "./tools/plugins/silverblog";
import config from "./develop.json";

export default defineConfig({
    build: {
        outDir: "public/dist",
        manifest: true,
        rollupOptions: {
            input: 'src/main.ts',
        },
    },
    plugins: [
        SilverBlog(config.SilverBlogServer),
    ]
});
