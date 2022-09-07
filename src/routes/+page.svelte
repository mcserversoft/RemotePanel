<script lang="ts" context="module">
	export const prerender = true;
</script>

<script type="ts">
	import { onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { auth, isOffline, selectedPage } from '$lib/storage';
	import LoginPage from '$lib/pages/login.svelte';
	import DashboardPage from '$lib/pages/dashboard.svelte';
	import ServersPage from '$lib/pages/servers.svelte';
	import OfflinePage from '$lib/pages/offline.svelte';
	import BottomNav from '$lib/components/bottomNav.svelte';
	import Header from '$lib/components/header.svelte';
	import { Page, navigateToPage } from '$lib/routing';

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

		// navigateToPage(Page.Servers);
		// console.log($selectedPage.pageName);
	}
</script>

<!-- isPageLoadedYet removes page ghosting on F5 -->
<!-- {#if isPageLoadedYet} -->
<!-- {#if $isOffline}
	<OfflinePage />
{:else if isAuthenticated} -->
{#if isAuthenticated}
	<Header />

	{#if $selectedPage.pageName == Page.Servers}
		<ServersPage />
	{:else if $selectedPage.pageName == Page.Dashboard}
		<DashboardPage />
	{/if}
	<BottomNav />

{:else}
	<LoginPage />
{/if}
<!-- {/if} -->
