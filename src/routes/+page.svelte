<script lang="ts">
	import { onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { auth } from '$lib/code/auth';
	import { getServers } from '$lib/code/api';
	import { Page, selectedPage } from '$lib/code/routing';
	import { settings } from '$lib/code/storage';
	import AboutPage from '$lib/pages/about.svelte';
	import AccountPage from '$lib/pages/account.svelte';
	import BackupsCreatePage from '$lib/pages/backups/create.svelte';
	import BackupsEditPage from '$lib/pages/backups/edit.svelte';
	import BackupsPage from '$lib/pages/backups/overview.svelte';
	import BackupHistoryPage from '$lib/pages/backups/history.svelte';
	import BackupSettingsPage from '$lib/pages/backups/settings.svelte';
	import ConsolePage from '$lib/pages/console.svelte';
	import DashboardPage from '$lib/pages/dashboard.svelte';
	import LoginPage from '$lib/pages/login.svelte';
	import OfflineWarning from '$lib/components/offlineWarning.svelte';
	import ServerEditPage from '$lib/pages/server/edit.svelte';
	import ServersPage from '$lib/pages/servers.svelte';
	import SettingsPage from '$lib/pages/settings.svelte';
	import SideNav from '$lib/components/navigation/sideNav.svelte';
	import UsersCreatePage from '$lib/pages/users/create.svelte';
	import UsersEditPage from '$lib/pages/users/edit.svelte';
	import UsersOverviewPage from '$lib/pages/users/overview.svelte';
	import SchedulerPage from '$lib/pages/scheduler/overview.svelte';
	import SchedulerTaskCreatePage from '$lib/pages/scheduler/create.svelte';
	import SchedulerTaskEditPage from '$lib/pages/scheduler/edit.svelte';
	import ApiKeysOverviewPage from '$lib/pages/apiKeys/overview.svelte';
	import ApiKeysCreatePage from '$lib/pages/apiKeys/create.svelte';
	import ApiKeysCreatedPage from '$lib/pages/apiKeys/created.svelte';
	import WebhooksPage from '$lib/pages/webhooks/overview.svelte';
	import WebhooksCreatePage from '$lib/pages/webhooks/create.svelte';
	import WebhooksEditPage from '$lib/pages/webhooks/edit.svelte';

	let isAuthenticated: boolean = false;
	let isPageLoadedYet: boolean = false;

	if (browser) {
		const updateServers = setInterval(
			() => {
				if (isAuthenticated) {
					getServers();
				}
			},
			$settings.serversRefreshRate * 1000 ?? 5000
		);
		onDestroy(() => clearInterval(updateServers));

		const unsubscribe = auth.subscribe((updatedAuth) => {
			// apiKey validation occurs with API requests
			if (updatedAuth.apiKey) {
				isAuthenticated = true;

				// quickly load servers upon page refresh & login
				getServers();
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
	{#if isAuthenticated}
		<SideNav />
		<div class="mt-14 md:ml-64 bg-gray-50 dark:bg-gray-900">
			{#if $selectedPage == Page.About}
				<AboutPage />
			{:else if $selectedPage == Page.Account}
				<AccountPage />
			{:else if $selectedPage == Page.Backups}
				<BackupsPage />
			{:else if $selectedPage == Page.BackupsCreate}
				<BackupsCreatePage />
			{:else if $selectedPage == Page.BackupsEdit}
				<BackupsEditPage />
			{:else if $selectedPage == Page.BackupHistory}
				<BackupHistoryPage />
			{:else if $selectedPage == Page.BackupSettings}
				<BackupSettingsPage />
			{:else if $selectedPage == Page.Console}
				<ConsolePage />
			{:else if $selectedPage == Page.Dashboard}
				<DashboardPage />
			{:else if $selectedPage == Page.ServerEdit}
				<ServerEditPage />
			{:else if $selectedPage == Page.Servers}
				<ServersPage />
			{:else if $selectedPage == Page.Settings}
				<SettingsPage />
			{:else if $selectedPage == Page.Scheduler}
				<SchedulerPage />
			{:else if $selectedPage == Page.SchedulerTaskCreate}
				<SchedulerTaskCreatePage />
			{:else if $selectedPage == Page.SchedulerTaskEdit}
				<SchedulerTaskEditPage />
			{:else if $selectedPage == Page.UsersCreate}
				<UsersCreatePage />
			{:else if $selectedPage == Page.UsersEdit}
				<UsersEditPage />
			{:else if $selectedPage == Page.Users}
				<UsersOverviewPage />
			{:else if $selectedPage == Page.ApiKeysOverview}
				<ApiKeysOverviewPage />
			{:else if $selectedPage == Page.ApiKeysCreate}
				<ApiKeysCreatePage />
			{:else if $selectedPage == Page.ApiKeysCreated}
				<ApiKeysCreatedPage />
			{:else if $selectedPage == Page.Webhooks}
				<WebhooksPage />
			{:else if $selectedPage == Page.WebhooksCreate}
				<WebhooksCreatePage />
			{:else if $selectedPage == Page.WebhooksEdit}
				<WebhooksEditPage />
			{/if}
		</div>

		<OfflineWarning />
	{:else}
		<LoginPage />
	{/if}
{/if}
