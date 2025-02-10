import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import {VitePWA} from "vite-plugin-pwa";

export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate', // 자동 업데이트
            manifest: {
                name: 'My PWA App',
                short_name: 'PWA App',
                description: 'A Progressive Web App built with Vite',
                theme_color: '#ffffff',
                icons: [
                    {
                        src: '/icons/icon-192x192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: '/icons/icon-512x512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    }
                ]
            },
            workbox: {
                runtimeCaching: [
                    {
                        urlPattern: /^https:\/\/my-api\.com\//,
                        handler: 'NetworkFirst',
                        options: {
                            cacheName: 'api-cache',
                            expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 }
                        }
                    }
                ]
            }
        })
    ],
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    server: {
        host: true, // 네트워크에서 접근 가능하게 설정
        port: 5173, // 기본 포트 유지
        proxy: {
            '/auth': {
                target: 'http://localhost:8080',
                changeOrigin: true,
                secure: false,
            },
            '/schedule': {
                target: 'http://localhost:8080',
                changeOrigin: true,
                secure: false,
            },
            '/time-table': {
                target: 'http://localhost:8080',
                changeOrigin: true,
                secure: false,
            },
            '/api/dorm': {
                target: 'http://localhost:8000',
                changeOrigin: true,
                secure: false,
            },
            '/api/cafeteria': {
                target: 'http://localhost:8000',
                changeOrigin: true,
                secure: false,
            }
        }
    }
});
