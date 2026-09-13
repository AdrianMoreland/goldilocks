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
    preview: {
        host: true,
        // Vite 5+ rejects unrecognized Host headers by default — needed so
        // `vite preview` behind Railway's *.up.railway.app proxy (or a future
        // custom domain) actually serves requests instead of 403ing them.
        allowedHosts: true,
    },
})
