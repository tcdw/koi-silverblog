import fs from "node:fs";
import { fileURLToPath } from "node:url";

const original = JSON.parse(
    fs.readFileSync(fileURLToPath(new URL("../../public/dist/.vite/manifest.json", import.meta.url)), {
        encoding: "utf8",
    }),
);

const transformed = {
    JSFile: original["src/main.ts"].file,
    CSSFile: original["src/main.ts"].css,
};

fs.writeFileSync(
    fileURLToPath(new URL("../../public/dist/vite-assets.json", import.meta.url)),
    JSON.stringify(transformed),
    {
        encoding: "utf8",
    },
);
