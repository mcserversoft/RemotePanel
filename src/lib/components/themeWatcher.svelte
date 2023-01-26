<script lang="ts">
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { browser } from '$app/environment';
	import { settings } from '$lib/code/storage';
	import { getPanelTheme, setPanelTheme } from '$lib/code/theme';
	import { PanelTheme } from '../../types';

	// listen on panel theme changes
	$: handleThemeChange.bind($settings.panelTheme)();
	function handleThemeChange() {
		updateDocument();
	}

	// listen on system theme changes
	onMount(async () => {
		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
			if (get(settings).useSystemTheme) {
				setPanelTheme(event.matches ? PanelTheme.Dark : PanelTheme.Light);
			}
		});

		updateDocument();
	});

	function updateDocument() {
		if (!browser) {
			return;
		}

		const theme = getPanelTheme();
		switch (theme) {
			case PanelTheme.Light:
				document.documentElement.classList.remove('dark');
				break;
			case PanelTheme.Dark:
				document.documentElement.classList.add('dark');
				break;

			default:
				break;
		}
	}
</script>
