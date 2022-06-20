<script lang="ts" context="module">
	export const prerender = true;
</script>

<script type="ts">
	import { browser } from "$app/env";
	import { auth } from "$lib/store.js";
	import LoginPage from "../pages/login.svelte";
	import PanelPage from "../pages/panel.svelte";

	let isAuthenticated: boolean;
	let isPageLoadedYet: boolean;

	if (browser) {
		auth.subscribe((updatedAuth) => {

			// apiKey validation occurs with API requests
			if (updatedAuth.apiKey) {
				isAuthenticated = true;
			} else {
				isAuthenticated = false;
			}
			isPageLoadedYet = true;
		});
	}
</script>

<!-- isPageLoadedYet removes page ghosting on F5 -->
{#if isPageLoadedYet}
	{#if isAuthenticated}
		<PanelPage />
	{:else}
		<LoginPage />
	{/if}
{/if}
