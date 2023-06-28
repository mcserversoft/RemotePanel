<script lang="ts">
	import { mdiAccountPlus, mdiCheck, mdiClose, mdiRefresh } from '@mdi/js';
	import { deletePanelUser, fetchPanelUsers, servers } from '$lib/code/api';
	import Icon from '$lib/components/elements/icon.svelte';
	import { navigateToPage } from '$lib/code/routing';
	import { Page, type PanelUser } from '../../../types';
	import Spinner from '$lib/components/elements/spinner.svelte';
	import PageTitleBanner from '$lib/components/page/pageTitleBanner.svelte';
	import { onMount } from 'svelte';

	let users: PanelUser[] = [];
	let isLoading = true;

	onMount(async () => {
		load();
	});

	function load() {
		fetchPanelUsers(
			(data: PanelUser[]) => {
				users = data;
			},
			(wasSuccess: boolean) => {
				isLoading = false;
			}
		);
	}

	function handleRefreshButton() {
		isLoading = true;
		users = [];
		load();
	}

	//TODO handleEditPanelUser
	function handleEditPanelUser() {
		console.log('edit');
	}

	function handleDeletePanelUser(e: any) {
		const formData = Object.fromEntries(new FormData(e.target).entries());

		let allowedToDelete = confirm(`Are you sure you want to delete user '${formData.username}'?`);
		if (!allowedToDelete) {
			return;
		}

		deletePanelUser(formData.userId.toString(), (wasSuccess: boolean) => {
			if (wasSuccess) {
				confirm(`User '${formData.username}' was successfully deleted.`);
				handleRefreshButton();
			} else {
				confirm(`Failed to delete user '${formData.username}'.`);
			}
		});
	}
</script>

<svelte:head>
	<title>MCSS Remote Panel | Users Overview</title>
</svelte:head>

<section class="min-h-screen dark:bg-gray-900 dark:text-white">
	<!-- <section class="min-h-screen dark:bg-gray-900 dark:text-white"> -->
	<div class="relative overflow-x-auto">
		<PageTitleBanner title="Users Overview" caption="All users that are configured to view and use the Remote Panel.">
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
		</PageTitleBanner>

		<div class="relative overflow-x-auto shadow-md rounded-b-none sm:rounded-lg">
			<table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
				<thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
					<tr>
						<th scope="col" class="px-6 py-3">Username</th>
						<th scope="col" class="px-6 py-3">Enabled</th>
						<th scope="col" class="px-6 py-3">Admin</th>
						<th scope="col" class="px-6 py-3">Servers</th>
						<th scope="col" class="px-6 py-3">Last Modified</th>
						<th scope="col" class="px-6 py-3">Created</th>
						<th scope="col" class="px-6 py-3">Action</th>
					</tr>
				</thead>
				<tbody>
					{#each users as user}
						<tr class="bg-white dark:bg-gray-800">
							<td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{user.username}</td>
							<td class="px-6 py-4">
								<Icon data={user.enabled ? mdiCheck : mdiClose} class="{user.enabled ? 'text-green-400' : 'text-red-400'} " />
							</td>
							<td class="px-6 py-4">
								<Icon data={user.isAdmin ? mdiCheck : mdiClose} class="{user.isAdmin ? 'text-green-400' : 'text-red-400'} " />
							</td>
							<!--TODO FUTURE hover dialog with more info? -->
							<td class="px-6 py-4">
								<span class="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">{user.hasAccessToAllServers ? 'All' : Object.keys(user.customServerPermissions).length}</span>
							</td>
							<td class="px-6 py-4">{new Date(user.lastModifiedAt).toLocaleString(navigator.language)}</td>
							<td class="px-6 py-4">{new Date(user.createdAt).toLocaleString(navigator.language)}</td>
							<td class="flex px-6 py-4 space-x-3">
								<form on:submit|preventDefault={handleEditPanelUser}>
									<button type="submit" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</button>
								</form>
								<form on:submit|preventDefault={handleDeletePanelUser}>
									<input type="text" id="userId" name="userId" value={user.userId} hidden />
									<input type="text" id="username" name="username" value={user.username} hidden />
									<button type="submit" class="font-medium text-red-600 dark:text-red-500 hover:underline">Delete</button>
								</form>
							</td>
						</tr>
					{:else}
						<tr class="bg-white dark:bg-gray-800">
							{#if isLoading}
								<td class="px-6 py-4 text-center" colspan="7"><Spinner /></td>
							{:else}
								<td class="px-6 py-4 text-center" colspan="7">No users were found.</td>
							{/if}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</section>
