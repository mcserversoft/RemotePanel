<!-- <script lang="ts">
	import { mdiAccountPlus, mdiCheck, mdiClose, mdiDatabasePlus, mdiDatabasePlusOutline, mdiRefresh } from '@mdi/js';
	import { deletePanelUser, getBackups, getPanelUsers } from '$lib/code/api';
	import Icon from '$lib/components/elements/icon.svelte';
	import { navigateToPage } from '$lib/code/routing';
	import { Page, type IPanelUser, type Backup } from '../../../types';
	import Spinner from '$lib/components/elements/spinner.svelte';
	import PageTitleBanner from '$lib/components/page/pageTitleBanner.svelte';
	import { onMount } from 'svelte';
	import ServerSelector from '$lib/components/server/serverSelector.svelte';
	import { get } from 'svelte/store';
	import { selectedServerId } from '$lib/code/global';

	let backups: Backup[] = [];
	let isLoading = true;

	onMount(async () => {
		load();
	});

	function load() {
		const serverId = get(selectedServerId);

		if (!serverId) {
			isLoading = false;
			return;
		}

		getBackups(
			serverId,
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

	function handleEditBackup(userId: string) {
		// navigateToPage(Page.UsersEdit, userId);
	}

	function handleDeleteBackup(e: any) {
		// 	const formData = Object.fromEntries(new FormData(e.target).entries());
		// 	let allowedToDelete = confirm(`Are you sure you want to delete user '${formData.username}'?`);
		// 	if (!allowedToDelete) {
		// 		return;
		// 	}
		// 	deletePanelUser(formData.userId.toString(), (wasSuccess: boolean) => {
		// 		if (wasSuccess) {
		// 			confirm(`Backup '${formData.username}' was successfully deleted.`);
		// 			handleRefreshButton();
		// 		} else {
		// 			confirm(`Failed to delete backup '${formData.username}'.`);
		// 		}
		// 	});
	}
</script>

<svelte:head>
	<title>MCSS Remote Panel | Backups Overview</title>
</svelte:head>

<section class="h-[calc(100vh-56px)] overflow-auto p-6 dark:bg-gray-900 dark:text-white">
	<div class="relative overflow-x-auto">
		<!- <PageTitleBanner title="Backups Overview" caption="All users that are configured to view and use the Remote Panel.">
			<div class="self-center">
				<button
					type="button"
					on:click={handleRefreshButton}
					class="px-3 py-1.5 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
				>
					<Icon data={mdiRefresh} size={5} class="" />
				</button>
			</div>
			<div class="self-center">
				<button
					on:click={() => navigateToPage(Page.UsersCreate)}
					type="button"
					class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-[0.45rem] text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
				>
					<Icon data={mdiAccountPlus} size={5} class="w-5 h-5 mr-2 -ml-1" />
					Add User
				</button>
			</div>
		</PageTitleBanner> ->

		<ServerSelector>
			<div class="self-center">
				<button
					type="button"
					on:click={handleRefreshButton}
					class="px-3 py-1.5 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none hover:bg-gray-100 hover:text-blue-700 focus:z-10 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 focus:ring-2 focus:ring-blue-700 dark:focus:ring-blue-500"
				>
					<Icon data={mdiRefresh} size={5} />
				</button>
				<span class="sr-only">Reload Console</span>
			</div>
			<div class="self-center">
				<button
					on:click={() => navigateToPage(Page.BackupsCreate)}
					type="button"
					class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-[0.45rem] text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
				>
					<Icon data={mdiDatabasePlus} size={5} class="w-5 h-5 mr-2 -ml-1" />
					Create Backup
				</button>
			</div>
		</ServerSelector>

		<div class="relative overflow-x-auto rounded-lg border dark:border-gray-800">
			<table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
				<thead class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
					<tr>
						<th scope="col" class="px-6 py-3">Name</th>
						<th scope="col" class="px-6 py-3">Suspend</th>
						<th scope="col" class="px-6 py-3">DeleteOldBackups</th>
						<th scope="col" class="px-6 py-3">Compression</th>
						<th scope="col" class="px-6 py-3">LastStatus</th>
						<th scope="col" class="px-6 py-3">CompletedAt</th>
						<th scope="col" class="px-6 py-3">Action</th>
					</tr>
				</thead>
				<tbody>
					{#each backups as backup}
						<tr class="bg-white dark:bg-gray-800">
							<td scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{backup.name}</td>
							<td class="px-6 py-4">
								<Icon data={backup.suspend ? mdiCheck : mdiClose} class="{backup.suspend ? 'text-green-400' : 'text-red-400'} " />
							</td>
							<td class="px-6 py-4">
								<Icon data={backup.deleteOldBackups ? mdiCheck : mdiClose} class="{backup.deleteOldBackups ? 'text-green-400' : 'text-red-400'} " />
							</td>
							<td class="px-6 py-4" />
							<td class="px-6 py-4">{new Date(backup.compression).toLocaleString(navigator.language)}</td>
							<td class="px-6 py-4">{new Date(backup.completedAt).toLocaleString(navigator.language)}</td>
							<td class="flex items-center px-6 py-4 space-x-3">
								<a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
								<button on:click={() => confirm("Are you sure you want to delete user 'ABC'?")} class="font-medium text-red-600 dark:text-red-500 hover:underline">Remove</button>
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
</section> -->
