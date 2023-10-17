import { defineConfig } from 'vite';
import { resolve } from 'path';

const DEV_PORT = 8042;

export default defineConfig(() => {
    return {
        build: {
            rollupOptions: {
                input: {
                    main: resolve(__dirname, 'index.html'),
                },
            },
        },
        root: 'editor',
        optimizeDeps: {
            esbuildOptions: {
                target: 'es2020',
            },
        },
        resolve: {
            alias: {
                "~": resolve(__dirname, './src')
            },
        },
        publicDir: 'public',
        server: {
            port: DEV_PORT,
            headers: { 'Access-Control-Allow-Origin': '*' },
            open: true,
            hmr: true,
        },
    };
});



