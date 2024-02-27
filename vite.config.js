import { defineConfig } from "vite";

export default defineConfig({
    build: {
        outDir: "public/dist",
        manifest: true,
        rollupOptions: {
            input: 'src/main.ts',
        },
    },
});
