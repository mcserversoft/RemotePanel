<script lang="ts" context="module">
	export const prerender = true;
</script>

<script type="ts">
	import { onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { auth } from '$lib/auth';
	import { Page, selectedPage } from '$lib/routing';
	import { isOffline } from '$lib/storage';
	import LoginPage from '$lib/pages/login.svelte';
	import DashboardPage from '$lib/pages/dashboard.svelte';
	import ServersPage from '$lib/pages/servers.svelte';
	import OfflinePage from '$lib/pages/offline.svelte';
	import BottomNav from '$lib/components/bottomNav.svelte';
	import Header from '$lib/components/header.svelte';
	import About from '$lib/pages/about.svelte';
	import Server from '$lib/components/server.svelte';

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
<!-- {#if isPageLoadedYet} -->
<!-- {#if $isOffline}
	<OfflinePage />
{:else if isAuthenticated} -->
{#if isAuthenticated}
	<Header />

	{#if $selectedPage == Page.About}
		<p>About</p>
	{:else if $selectedPage == Page.Dashboard}
		<DashboardPage />
	{:else if $selectedPage == Page.Servers}
		<ServersPage />
	{:else if $selectedPage == Page.Settings}
		<p>Settings</p>
	{/if}
	
	<BottomNav />
{:else}
	<LoginPage />
{/if}
<!-- {/if} -->
