import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

const config = {
	preprocess: [
	  preprocess({
		postcss: true,
	  }),
	],

	kit: {
		adapter: adapter(),
		trailingSlash: 'always'
	}
};

export default config;
