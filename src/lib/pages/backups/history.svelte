<script lang="ts">
	import { get } from 'svelte/store';
	import { mdiArchive, mdiArchiveRemove, mdiRefresh } from '@mdi/js';
	import { deleteBackupHistory, getBackupHistory } from '$lib/code/api';
	import Icon from '$lib/components/elements/icon.svelte';
	import { Page, type BackupHistory } from '../../../types';
	import Spinner from '$lib/components/elements/spinner.svelte';
	import { selectedServerId } from '$lib/code/global';
	import ServerSelector from '$lib/components/server/serverSelector.svelte';
	import Breadcrumb from '$lib/components/navigation/breadcrumb.svelte';
	import Button from '$lib/components/elements/button.svelte';
	import { getBackupStatusColor, getBackupStatusIcon, getBackupStatusName } from '$lib/code/shared';

	let backups: BackupHistory[] = [];
	let isLoading = true;

	// this loads it on mount & when the server changes
	$: $selectedServerId, load();

	function load() {
		const serverId = get(selectedServerId);
		if (!serverId) {
			isLoading = false;
			return;
		}
		console.log(serverId);

		getBackupHistory(
			serverId,
			(data: BackupHistory[]) => {
				backups = data;
			},
			(wasSuccess: boolean) => {
				isLoading = false;
			}
		);
	}

	function handleRefreshButton() {
		isLoading = true;
		backups = [];
		load();
	}

	function handleClearBackupHistory(e: any) {
		let allowedToDelete = confirm(`Are you sure you want to delete the backup history for this server?`);
		if (!allowedToDelete) {
			return;
		}

		deleteBackupHistory(get(selectedServerId), (wasSuccess: boolean) => {
			if (wasSuccess) {
				confirm(`Backup history was successfully deleted.`);
				handleRefreshButton();
			} else {
				confirm(`Failed to delete backup history.`);
			}
		});
	}
</script>

<svelte:head>
	<title>MCSS Remote Panel | Backups Overview</title>
</svelte:head>

<section class="h-[calc(100vh-56px)] overflow-auto p-6 dark:bg-gray-900 dark:text-white">
	<Breadcrumb
		icon={mdiArchive}
		items={[
			{ name: 'Backups', page: Page.Backups, isClickable: true },
			{ name: 'History', page: Page.Empty, isClickable: false }
		]}
	/>

	<ServerSelector customDescription="The last 15 executed backups can be found below.">
		<div class="self-center">
			<button
				type="button"
				on:click={handleRefreshButton}
				class="px-3 py-1.5 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none hover:bg-gray-100 hover:text-blue-700 focus:z-10 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 focus:ring-2 focus:ring-blue-700 dark:focus:ring-blue-500"
			>
				<Icon data={mdiRefresh} size={5} />
			</button>
			<span class="sr-only">Reload Backups</span>
		</div>
		<div class="self-center">
			<Button icon={mdiArchiveRemove} text={'Clear History'} color="red" on:click={handleClearBackupHistory} reactive={true} />
		</div>
	</ServerSelector>

	<div class="relative overflow-x-auto">
		<div class="relative overflow-x-auto rounded-lg border dark:border-gray-800">
			<table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
				<thead class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
					<tr>
						<th scope="col" class="px-6 py-3">Run At</th>
						<th scope="col" class="px-6 py-3">Status</th>
						<th scope="col" class="px-6 py-3">Name</th>
						<th scope="col" class="px-6 py-3">Log Message</th>
					</tr>
				</thead>
				<tbody>
					{#each backups as backup}
						<tr class="bg-white dark:bg-gray-800">
							<td class="px-6 py-4 whitespace-nowrap">{new Date(backup.lastRun).toLocaleString(navigator.language)} </td>
							<td class="px-6 py-4 whitespace-nowrap inline-flex items-center">
								<Icon data={getBackupStatusIcon(backup.status)} class={getBackupStatusColor(backup.status) + ' mr-1.5'} />
								{getBackupStatusName(backup.status)}
							</td>
							<td class="px-6 py-4 whitespace-nowrap">{backup.name}</td>
							<td class="px-6 py-4 whitespace-nowrap overflow-hidden w-full max-w-[1px] text-ellipsis">{backup.logMessage}</td>
						</tr>
					{:else}
						<tr class="bg-white dark:bg-gray-800">
							{#if isLoading}
								<td class="px-6 py-4 text-center" colspan="7"><Spinner /></td>
							{:else}
								<td class="px-6 py-4 text-center" colspan="7">No backup history was found.</td>
							{/if}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</section>
