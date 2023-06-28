import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';

const config: UserConfig = {
    plugins: [sveltekit()],
    server: {
        port: 3112,
        strictPort: true,
        https: false,
        proxy: {}
    }
};

export default config;
