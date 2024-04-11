<script>
	import ThemeWatcher from '$lib/components/theme/themeWatcher.svelte';
	import { pwaInfo } from 'virtual:pwa-info';
	import '../app.css';

	$: webManifestLink = pwaInfo ? pwaInfo.webManifest.linkTag : '';
</script>

<svelte:head>
	{@html webManifestLink}
</svelte:head>

<slot />
<ThemeWatcher />
