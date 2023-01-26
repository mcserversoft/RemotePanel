import type { UserConfig } from 'vite';
import zipPack from 'vite-plugin-zip-pack';

import { sveltekit } from '@sveltejs/kit/vite';

const config: UserConfig = {
	plugins: [sveltekit(), zipPack({ inDir: 'build', outDir: 'build', outFileName: 'panel.zip' })],
	define: {
		__VERSION__: JSON.stringify(process.env.npm_package_version)
	}
};

export default config;
