<script lang="ts">
	import { getSelectedServer, selectedServerId } from '$lib/code/api';
	import { hasPermission, Permission } from '$lib/code/permissions';
	import Console from '$lib/components/server/console.svelte';
	import Icon from '$lib/components/elements/icon.svelte';
	import { mdiRefresh } from '@mdi/js';
	import { getFriendlyStatusName } from '$lib/code/shared';
	import ActionDropdown from '$lib/components/server/actionDropdown.svelte';
	import Statistics from '$lib/components/server/statistics.svelte';
	import ServerSwitchDropdown from '$lib/components/server/serverSwitchDropdown.svelte';

	function handleRefreshButton() {}
</script>

<svelte:head>
	<title>MCSS Remote Panel | Dashboard</title>
</svelte:head>

<section class="pt-1 min-h-screen dark:bg-gray-900 dark:text-white">
	<div class="flex pb-3 space-x-2">
		<div class="self-center grow">
			<div class="pr-3 self-nonecenter">
				<ServerSwitchDropdown />
				<p class="text-sm font-normal text-gray-500 max-sm:hidden dark:text-gray-400">{$getSelectedServer?.description}</p>
			</div>
		</div>
		<div class="self-center">
			<button
				type="button"
				on:click={handleRefreshButton}
				class="px-3 py-1.5 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
			>
				<Icon data={mdiRefresh} size={5} />
			</button>
			<span class="sr-only">Reload UI</span>
		</div>
		<div class="self-center">
			{#key $selectedServerId}
				{#if hasPermission(Permission.useServerActions, $selectedServerId)}
					<ActionDropdown statusName={getFriendlyStatusName($getSelectedServer?.status)} />
				{/if}
			{/key}
		</div>
	</div>

	{#if $selectedServerId}
		{#key $selectedServerId}
			{#if hasPermission(Permission.viewStats, $selectedServerId)}
				<Statistics />
			{/if}

			{#if hasPermission(Permission.viewConsole, $selectedServerId)}
				<Console />
			{/if}
		{/key}
	{:else}
		<div class="text-center">
			<span class="text-sm font-medium italic text-slate-400">No server selected.</span>
		</div>
	{/if}
</section>
