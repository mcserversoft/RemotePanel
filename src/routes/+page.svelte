<script lang="ts" context="module">
	export const prerender = true;
</script>

<script type="ts">
	import { onDestroy } from "svelte";
	import { browser } from "$app/environment";
	import { auth, isOffline } from "$lib/store.js";
	import LoginPage from "$lib/pages/login.svelte";
	import PanelPage from "$lib/pages/panel.svelte";
	import OfflinePage from "$lib/pages/offline.svelte";

	let isAuthenticated: boolean;
	let isPageLoadedYet: boolean;

	if (browser) {
		const unsubscribe = auth.subscribe((updatedAuth) => {
			// apiKey validation occurs with API requests
			if (updatedAuth.apiKey) {
				isAuthenticated = true;
			} else {
				isAuthenticated = false;
			}
			isPageLoadedYet = true;
		});
		onDestroy(unsubscribe);
	}
</script>

<!-- isPageLoadedYet removes page ghosting on F5 -->
{#if isPageLoadedYet}
	{#if $isOffline}
		<OfflinePage />
	{:else if isAuthenticated}
		<PanelPage />
	{:else}
		<LoginPage />
	{/if}
{/if}
