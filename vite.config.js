import { sveltekit } from '@sveltejs/kit/vite';
import basicSsl from '@vitejs/plugin-basic-ssl';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [
		sveltekit(),
		basicSsl(),
	],
	server: {
        port: 3110,
		strictPort: true,
        https: true,
        proxy: {}
    }
};

export default config;
