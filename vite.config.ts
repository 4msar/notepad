import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            outDir: "dist",
            registerType: "autoUpdate",
            injectRegister: "auto",
            workbox: {
                globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
            },
            includeAssets: ["favicon.ico", "logo128.png", "logo512.png"],
            manifest: {
                name: "Noto - Note Taking App",
                short_name: "Noto",
                description:
                    "Simple note taking application with realtime sync.",
                theme_color: "#94a3b8",
                icons: [
                    {
                        src: "logo128.png",
                        sizes: "128x128",
                        type: "image/png",
                    },
                    {
                        src: "logo512.png",
                        sizes: "512x512",
                        type: "image/png",
                    },
                ],
            },
        }),
    ],
    resolve: {
        alias: {
            src: path.resolve(__dirname, "./src"),
        },
    },
});
