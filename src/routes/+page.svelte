<script lang="ts" context="module">
	export const prerender = true;
</script>

<script type="ts">
	import { onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { auth } from '$lib/auth';
	import { fetchServers, isOffline } from '$lib/api';
	import { Page, selectedPage } from '$lib/routing';
	import BottomNav from '$lib/components/bottomNav.svelte';
	import Header from '$lib/components/header.svelte';
	import AboutPage from '$lib/pages/about.svelte';
	import DashboardPage from '$lib/pages/dashboard.svelte';
	import LoginPage from '$lib/pages/login.svelte';
	import ServersPage from '$lib/pages/servers.svelte';
	import OfflinePage from '$lib/pages/offline.svelte';
	import SettingsPage from '$lib/pages/settings.svelte';

	let isAuthenticated: boolean = false;
	let isPageLoadedYet: boolean = false;

	if (browser) {
		const updateServers = setInterval(() => {
			if (isAuthenticated) {
				fetchServers();
			}
		}, 5000);
		onDestroy(() => clearInterval(updateServers));

		const unsubscribe = auth.subscribe((updatedAuth) => {
			// apiKey validation occurs with API requests
			if (updatedAuth.apiKey) {
				isAuthenticated = true;

				// quicky load servers when first logging in
				fetchServers();
			} else {
				isAuthenticated = false;
			}

			isPageLoadedYet = true;
		});
		onDestroy(unsubscribe);
	}
</script>

<!-- isPageLoadedYet prevents page ghosting on F5 -->
{#if isPageLoadedYet}
	{#if $isOffline}
		<OfflinePage />
	{:else if isAuthenticated}
		<Header />

		{#if $selectedPage == Page.About}
			<AboutPage />
		{:else if $selectedPage == Page.Dashboard}
			<DashboardPage />
		{:else if $selectedPage == Page.Servers}
			<ServersPage />
		{:else if $selectedPage == Page.Settings}
			<SettingsPage />
		{/if}

		<BottomNav />
	{:else}
		<LoginPage />
	{/if}
{/if}
