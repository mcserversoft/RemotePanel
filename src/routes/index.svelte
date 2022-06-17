<script lang="ts" context="module">
	export const prerender = true;
</script>

<script type="ts">
	import { browser } from "$app/env";
	import { auth } from "$lib/store.js";
	import LoginPage from "../pages/login.svelte";
	import PanelPage from "../pages/panel.svelte";

	let isAuthenticated: boolean;

	if (browser) {
		console.log("browser");

		auth.subscribe((value) => {
			console.log("sub");

			//TODO also validate if it's valid
			if (value.apiKey) {
				isAuthenticated = true;
			} else {
				isAuthenticated = false;
			}
		});
	}
</script>

{#if isAuthenticated}
	<PanelPage />
{:else}
	<LoginPage />
{/if}
