import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import {VitePWA} from 'vite-plugin-pwa'
import macrosPlugin from "vite-plugin-babel-macros";

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
                name: 'Household Budget',
                short_name: 'Household Budget',
                description: 'Application for managing your household budget',
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
