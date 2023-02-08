import type { UserConfig } from 'vite';
import zipPack from 'vite-plugin-zip-pack';

import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit'

const config: UserConfig = {
	plugins: [sveltekit(), SvelteKitPWA(), zipPack({ inDir: 'build', outDir: 'build', outFileName: 'panel.zip' })],
	define: {
		__VERSION__: JSON.stringify(process.env.npm_package_version)
	}
};

export default config;
