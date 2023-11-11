<script lang="ts">
	import { get } from 'svelte/store';
	import { mdiArchive, mdiArchivePlus, mdiCheck, mdiClose, mdiPlay, mdiRefresh } from '@mdi/js';
	import { deleteBackup, getBackups, runBackup } from '$lib/code/api';
	import Icon from '$lib/components/elements/icon.svelte';
	import { navigateToPage } from '$lib/code/routing';
	import { Page, type Backup, BackupFilter, BackupStatus } from '../../../types';
	import Spinner from '$lib/components/elements/spinner.svelte';
	import { selectedServerId } from '$lib/code/global';
	import ServerSelector from '$lib/components/server/serverSelector.svelte';
	import Breadcrumb from '$lib/components/navigation/breadcrumb.svelte';
	import BackupProgressView from '$lib/components/elements/backupProgressView.svelte';
	import Button from '$lib/components/elements/button.svelte';
	import { getBackupStatusColor, getBackupStatusIcon } from '$lib/code/shared';

	let backups: Backup[] = [];
	let isLoading = true;

	// this loads it on mount & when the server changes
	$: $selectedServerId, load();

	function load() {
		console.log('load');

		const serverId = get(selectedServerId);
		if (!serverId) {
			isLoading = false;
			return;
		}
		console.log(serverId);

		getBackups(
			serverId,
			BackupFilter.WithoutHistory,
			(data: Backup[]) => {
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

	function handleEditBackup(backupId: string) {
		navigateToPage(Page.BackupsEdit, backupId);
	}

	function handleRunBackup(backupId: string) {
		let allowedToRun = confirm(`Are you sure you want to run this backup now?`);
		if (!allowedToRun) {
			return;
		}

		runBackup($selectedServerId, backupId, (wasSuccess: boolean) => {
			if (wasSuccess) {
				confirm(`Backup run  was successfully triggered.`);
				handleRefreshButton();
			} else {
				confirm(`Failed to trigger backup run.`);
			}
		});
	}

	function handleDeleteBackup(backupId: string) {
		let allowedToDelete = confirm(`Are you sure you want to delete this backup?`);
		if (!allowedToDelete) {
			return;
		}

		deleteBackup($selectedServerId, backupId, (wasSuccess: boolean) => {
			if (wasSuccess) {
				confirm(`Backup was successfully deleted.`);
				handleRefreshButton();
			} else {
				confirm(`Failed to delete backup.`);
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
			{ name: 'Overview', page: Page.Empty, isClickable: false }
		]}
	/>

	<ServerSelector customDescription="Overview of all backup profiles and latest run info.">
		<div class="self-center">
			<button
				type="button"
				on:click={handleRefreshButton}
				class="px-3 py-1.5 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none hover:bg-gray-100 hover:text-blue-700 focus:z-10 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 focus:ring-2 focus:ring-blue-700 dark:focus:ring-blue-500"
			>
				<Icon data={mdiRefresh} size={5} />
			</button>
			<!-- <Button icon={mdiRefresh} on:click={handleRefreshButton} /> -->
			<span class="sr-only">Reload Backups</span>
		</div>
		<div class="self-center">
			<Button icon={mdiArchivePlus} text={'Create Backup'} on:click={() => navigateToPage(Page.BackupsCreate)} reactive={true} />
		</div>
	</ServerSelector>

	<BackupProgressView />

	<div class="relative overflow-x-auto">
		<div class="relative overflow-x-auto rounded-lg border dark:border-gray-800">
			<table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
				<!-- this colgroup HACK auto fills the first column to max width -->
				<colgroup>
					<col class="w-full" />
				</colgroup>
				<thead class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
					<tr>
						<th scope="col" class="px-6 py-3">Name</th>
						<th scope="col" class="px-6 py-3">Suspend</th>
						<th scope="col" class="px-6 py-3">Last Run</th>
						<th scope="col" class="px-6 py-3">Trigger</th>
						<th scope="col" class="px-6 py-3">Action</th>
					</tr>
				</thead>

				<tbody>
					{#each backups as backup}
						<tr class="bg-white dark:bg-gray-800">
							<td class="px-6 py-4 font-medium text-gray-800 whitespace-nowrap dark:text-white">{backup.name}</td>
							<td class="px-6 py-4">
								<Icon data={backup.suspend ? mdiCheck : mdiClose} class="{backup.suspend ? 'text-green-400' : 'text-red-400'} " />
							</td>
							<td class="px-6 py-4 inline-flex items-center whitespace-nowrap">
								<Icon data={getBackupStatusIcon(backup.lastStatus)} class={getBackupStatusColor(backup.lastStatus)} />
								<span class="ml-1">{new Date(backup.completedAt).toLocaleString(navigator.language)}</span>
							</td>

							<td class=" px-6 py-4 space-x-3 whitespace-nowrap">
								<form on:submit|preventDefault={() => handleRunBackup(backup.backupId)}>
									<button type="submit" class=" text-blue-600 dark:text-blue-500 hover:underline">
										<button type="button" class="font-medium rounded-lg text-xs px-2 inline-flex items-center text-center py-[0.15rem] focus:ring-4 focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
											<Icon data={mdiPlay} size={4} />
											<span class="whitespace-nowrap">Run Now</span>
										</button>
									</button>
								</form>
							</td>

							<td class="flex px-6 py-4 space-x-3">
								<form on:submit|preventDefault={() => handleEditBackup(backup.backupId)}>
									<button type="submit" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</button>
								</form>

								<form on:submit|preventDefault={() => handleDeleteBackup(backup.backupId)}>
									<button type="submit" class="font-medium text-red-600 dark:text-red-500 hover:underline">Delete</button>
								</form>
							</td>
						</tr>
					{:else}
						<tr class="bg-white dark:bg-gray-800">
							{#if isLoading}
								<td class="px-6 py-4 text-center" colspan="7"><Spinner /></td>
							{:else}
								<td class="px-6 py-4 text-center" colspan="7">No backups were found.</td>
							{/if}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>

	<!-- <div class="relative overflow-x-auto mt-6">
		<div class="relative overflow-x-auto rounded-lg border dark:border-gray-800">
			<table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
				<!- this colgroup HACK auto fills the first column to max width --
				<colgroup>
					<col class="w-full" />
				</colgroup>
				<thead class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
					<tr>
						<th scope="col" class="px-6 py-3">Name</th>
						<!- <th scope="col" class="px-6 py-3">Suspend</th>
						<th scope="col" class="px-6 py-3">DeleteOldBackups</th>
						<th scope="col" class="px-6 py-3">Compression</th> --
						<th scope="col" class="px-6 py-3">LastStatus</th>
						<th scope="col" class="px-6 py-3">CompletedAt</th>
						<th scope="col" class="px-6 py-3">Action</th>
					</tr>
				</thead>
				<tbody>
					<tr class="bg-white dark:bg-gray-800">
						<td class="px-6 py-4 font-medium text-gray-800 whitespace-nowrap dark:text-white">Test</td>
						<td class="px-6 py-4 whitespace-nowrap">01/01/1970, 01:00:00</td>
						<td class="px-6 py-4 whitespace-nowrap">01/01/1, 00:00:00</td>
						<td class="flex px-6 py-4 space-x-3">
							<button type="submit" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</button>
							<button type="submit" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Run</button>
							<button type="submit" class="font-medium text-red-600 dark:text-red-500 hover:underline">Delete</button>
						</td>
					</tr>

					{#each backups as backup}
						{#each backup.history as history}
							<div>{history}</div>
						{/each}
						<tr class="bg-white dark:bg-gray-800">
							<td class="px-6 py-4 font-medium text-gray-800 whitespace-nowrap dark:text-white">{backup.name}</td>
							<!- <td class="px-6 py-4">
								<Icon data={backup.suspend ? mdiCheck : mdiClose} class="{backup.suspend ? 'text-green-400' : 'text-red-400'} " />
							</td>
							<td class="px-6 py-4">
								<Icon data={backup.deleteOldBackups ? mdiCheck : mdiClose} class="{backup.deleteOldBackups ? 'text-green-400' : 'text-red-400'} " />
							</td>
							<td class="px-6 py-4">{BackupCompression[backup.compression]}</td> --
							<td class="px-6 py-4 whitespace-nowrap">{new Date(backup.compression).toLocaleString(navigator.language)}</td>
							<td class="px-6 py-4 whitespace-nowrap">{new Date(backup.completedAt).toLocaleString(navigator.language)}</td>
							<td class="flex px-6 py-4 space-x-3">
								<form on:submit|preventDefault={() => handleEditBackup(backup.backupId)}>
									<button type="submit" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</button>
								</form>
								<form on:submit|preventDefault={() => handleEditBackup(backup.backupId)}>
									<button type="submit" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Run</button>
								</form>
								<form on:submit|preventDefault={() => handleDeleteBackup(backup.backupId)}>
									<button type="submit" class="font-medium text-red-600 dark:text-red-500 hover:underline">Delete</button>
								</form>
							</td>
						</tr>
					{:else}
						<tr class="bg-white dark:bg-gray-800">
							{#if isLoading}
								<td class="px-6 py-4 text-center" colspan="7"><Spinner /></td>
							{:else}
								<td class="px-6 py-4 text-center" colspan="7">No backups were found.</td>
							{/if}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div> -->
</section>
