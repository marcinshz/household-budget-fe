import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import {VitePWA} from 'vite-plugin-pwa'
import macrosPlugin from "vite-plugin-babel-macros";
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        macrosPlugin(),
        VitePWA({
            registerType: 'autoUpdate',
            injectRegister: 'auto',
            devOptions: {
                enabled: true
            },
            workbox: {
                runtimeCaching: [{
                    urlPattern: ({url}) => {
                        return url.origin === 'http://localhost:3000';
                    },
                    handler: "NetworkFirst" as const,
                    options: {
                        cacheName: "api-cache",
                        cacheableResponse: {
                            statuses: [0, 200]
                        }
                    }
                }],
            },
            manifest: {
                name: 'My Awesome App',
                short_name: 'MyApp',
                description: 'My Awesome App description',
                theme_color: '#ffffff',
                icons: [
                    {
                        src: 'pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any maskable'
                    }
                ],
            }
        })
    ],
})
