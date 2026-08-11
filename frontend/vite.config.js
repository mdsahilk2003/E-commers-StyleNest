import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        rollupOptions: {
            output: {
                entryFileNames: `assets/[name]-v2-[hash].js`,
                chunkFileNames: `assets/[name]-v2-[hash].js`,
                assetFileNames: `assets/[name]-v2-[hash].[ext]`,
            },
        },
    },
    server: {
        port: 5173,
        proxy: {
            '/api': {
                target: 'http://localhost:5000',
                changeOrigin: true,
            },
        },
    },
});
