<script type="ts">
	import { onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { auth } from '$lib/code/auth';
	import { fetchServers, isOffline } from '$lib/code/api';
	import { Page, selectedPage } from '$lib/code/routing';
	import { settings } from '$lib/code/storage';
	import BottomNav from '$lib/components/bottomNav.svelte';
	import Header from '$lib/layouts/header.svelte';
	import AboutPage from '$lib/pages/about.svelte';
	import DashboardPage from '$lib/pages/dashboard.svelte';
	import LoginPage from '$lib/pages/login.svelte';
	import ServersPage from '$lib/pages/servers.svelte';
	import OfflinePage from '$lib/pages/offline.svelte';
	import SettingsPage from '$lib/pages/settings.svelte';
	import Sidebar from '$lib/layouts/sidebar.svelte';
	import Footer from '$lib/layouts/footer.svelte';

	let isAuthenticated: boolean = false;
	let isPageLoadedYet: boolean = false;

	if (browser) {
		const updateServers = setInterval(() => {
			if (isAuthenticated) {
				fetchServers();
			}
		}, $settings.serversRefreshRate * 1000 ?? 5000);
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

	let sidebarWidth: number = 0;
	let sidebarMarginLeft: string = `ml-[${sidebarWidth}px] `;
	$: sidebarWidth: (w: number) => {
		sidebarMarginLeft = `ml-[${w}px] `;
	};

	// function test(w: number) {
	// 	sidebarMarginLeft = `ml-[${w}px] `;
	// }
</script>

<!-- isPageLoadedYet prevents page ghosting on F5 -->
{#if isPageLoadedYet}
	<!-- {#if $isOffline}
		<OfflinePage />
	{:else if isAuthenticated} -->

	{#if isAuthenticated}
		<div id="left" class="sticky top-0 h-screen">
			<Sidebar />
		</div>

		<div id="right" class="flex-grow">
			<header class="sticky top-0">
				<Header />
			</header>

			<main class="{sidebarMarginLeft} border-l border-gray-100 dark:border-gray-700">
				<!-- <article class="flex-grow"> -->
				{#if $selectedPage == Page.About}
					<AboutPage />
				{:else if $selectedPage == Page.Dashboard}
					<DashboardPage />
				{:else if $selectedPage == Page.Servers}
					<ServersPage />
				{:else if $selectedPage == Page.Settings}
					<SettingsPage />
				{/if}
				<!-- </article> -->
			</main>
		</div>

		<!-- <Footer /> -->

		<!-- <BottomNav /> -->
	{:else}
		<header />
		<aside />
		<article>
			<LoginPage />
		</article>
		<footer />
	{/if}
{/if}

<!-- <section class="py-24 min-h-screen dark:bg-gray-900 dark:text-white">
	<div class="flex flex-col lg:flex-row">
		<div class="flex-none hidden lg:block">
			-- <Sidebar /> -
		</div>
		<div class="flex-grow p-6">
			<div class="mb-20">
				{#if $selectedServerGuid}
					<Server />
					{#key $selectedServerGuid}
						{#if hasPermission(Permission.viewStats, $selectedServerGuid)}
							<ServerStats />
						{/if}

						{#if hasPermission(Permission.viewConsole, $selectedServerGuid)}
							<Console />
						{/if}
					{/key}
				{:else}
					<div class="text-center">
						<span class="text-sm font-medium italic text-slate-400">No server selected.</span>
					</div>
				{/if}
			</div>
		</div>
	</div>
</section> -->
