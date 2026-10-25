import { defineConfig } from "vitest/config"
import { fileURLToPath, URL } from "node:url"

// Kept apart from vite.config.ts so tests skip the dev-only plugins (devtools, tailwind, react).
export default defineConfig({
    resolve: {
        alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
    },
    test: {
        environment: "node",
        include: ["src/**/*.spec.{ts,tsx}"],
    },
})
