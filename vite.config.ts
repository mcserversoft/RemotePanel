import type { UserConfig } from 'vite';
import zipPack from 'vite-plugin-zip-pack';

import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit'

const config: UserConfig = {
	plugins: [
		sveltekit(),
		SvelteKitPWA({
			manifest: {
				short_name: 'MCSS Remote',
				name: 'MCSS Remote Panel',
				description: 'App that allows you to remotely control MC Server Soft.',
				start_url: '/',
				scope: '/',
				display: 'standalone',
				theme_color: "#202124",
				background_color: "#202124",
				lang: 'en-US',
				icons: [
					{
						src: 'icons/icon-72.png',
						sizes: '72x72',
						type: 'image/png',
						purpose: 'any',
					},
					{
						src: 'icons/icon-96.png',
						sizes: '96x96',
						type: 'image/png',
						purpose: 'any',
					},
					{
						src: 'icons/icon-128.png',
						sizes: '128x128',
						type: 'image/png',
						purpose: 'any',
					},
					{
						src: 'icons/icon-144.png',
						sizes: '144x144',
						type: 'image/png',
						purpose: 'any',
					},
					{
						src: 'icons/icon-152.png',
						sizes: '152x152',
						type: 'image/png',
						purpose: 'any',
					},
					{
						src: 'icons/icon-192.png',
						sizes: '192x192',
						type: 'image/png',
					},
					{
						src: 'icons/icon-384.png',
						sizes: '384x384',
						type: 'image/png',
					},
					{
						src: 'icons/icon-512.png',
						sizes: '512x512',
						type: 'image/png',
					}
				],
			},

		}),
		//zipPack({ inDir: 'build', outDir: 'build', outFileName: 'panel.zip' })
    ],
	define: {
		__VERSION__: JSON.stringify(process.env.npm_package_version)
	}
};

export default config;
