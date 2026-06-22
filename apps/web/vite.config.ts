import tailwindcss from "@tailwindcss/vite"
import {defineConfig} from 'vite'
import {devtools} from "@tanstack/devtools-vite";
import react from '@vitejs/plugin-react-swc'
// import tanstackRouter from "@tanstack/router-plugin/vite";
import {fileURLToPath, URL} from "node:url";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        devtools(),
        tailwindcss(),
        react()
    ],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
   /* define: {
        'import.meta.env.VITE_BASENAME': JSON.stringify(process.env.VITE_BASENAME || ''),
    },*/
    server: {
        host: true,

        proxy: {
            '/api': {
                target: 'http://backend:4000',
                changeOrigin: true,
            },
        },
    },
})
