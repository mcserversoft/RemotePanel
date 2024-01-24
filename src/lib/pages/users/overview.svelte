<script lang="ts">
	import { mdiAccountMultipleRemove, mdiAccountPlus, mdiCheck, mdiClose, mdiRefresh } from '@mdi/js';
	import { deletePanelUser, getPanelUsers, wipeUserSessions } from '$lib/code/api';
	import { onMount } from 'svelte';
	import Icon from '$lib/components/elements/icon.svelte';
	import { navigateToPage } from '$lib/code/routing';
	import { Page, type IPanelUser } from '../../../types';
	import Spinner from '$lib/components/elements/spinner.svelte';
	import PageTitleBanner from '$lib/components/page/pageTitleBanner.svelte';
	import Button from '$lib/components/elements/button.svelte';

	let users: IPanelUser[] = [];
	let isLoading = true;

	onMount(async () => {
		load();
	});

	function load() {
		getPanelUsers(
			(data: IPanelUser[]) => {
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

	function handleLogOutActiveUsersButton() {
		let allowedToLogout = confirm(`Are you sure you want to clear all active sessions? All users will need to login again, including you.`);
		if (!allowedToLogout) {
			return;
		}

		wipeUserSessions((wasSuccess: boolean) => {
			if (wasSuccess) {
				confirm(`User sessions were cleared.`);
			} else {
				confirm(`Failed to wipe user sessions.`);
			}
		});
	}

	function handleEditPanelUser(userId: string) {
		navigateToPage(Page.UsersEdit, userId);
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

<section class="h-[calc(100vh-56px)] overflow-auto p-6 dark:bg-gray-900 dark:text-white">
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
					type="button"
					on:click={handleLogOutActiveUsersButton}
					class="px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-500 bg-white border border-gray-200 rounded-lg focus:outline-none hover:bg-red-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:hover:text-white dark:hover:bg-red-700"
				>
					<Icon data={mdiAccountMultipleRemove} size={5} class="" />
				</button>
			</div>
			<div class="self-center">
				<Button icon={mdiAccountPlus} text={'Create User'} on:click={() => navigateToPage(Page.UsersCreate)} reactive={true} />
			</div>
		</PageTitleBanner>

		<div class="relative overflow-x-auto rounded-lg border dark:border-gray-800">
			<table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
				<thead class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
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
							<td class="px-6 py-4 font-medium text-gray-800 whitespace-nowrap dark:text-white">{user.username}</td>
							<td class="px-6 py-4">
								<Icon data={user.enabled ? mdiCheck : mdiClose} class="{user.enabled ? 'text-green-400' : 'text-red-400'} " />
							</td>
							<td class="px-6 py-4">
								<Icon data={user.isAdmin ? mdiCheck : mdiClose} class="{user.isAdmin ? 'text-green-400' : 'text-red-400'} " />
							</td>
							<td class="px-6 py-4">
								<!--FUTURE hover dialog with more info? -->
								<!-- <span class="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">{user.serverAccessDetails?.hasAccessToAllServers ? 'All' : Object.keys(user.serverAccessDetails?.serverPermissions ?? 0).length}</span> -->
								<span class="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">{user.serverAccessDetails?.hasAccessToAllServers ? 'All' : user.serverAccessDetails?.getCustomServerCount()}</span>
							</td>
							<td class="px-6 py-4">{new Date(user.lastModifiedAt).toLocaleString(navigator.language)}</td>
							<td class="px-6 py-4">{new Date(user.createdAt).toLocaleString(navigator.language)}</td>
							<td class="flex px-6 py-4 space-x-3">
								<form on:submit|preventDefault={() => handleEditPanelUser(user.userId)}>
									<button type="submit" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</button>
								</form>
								<form on:submit|preventDefault={handleDeletePanelUser}>
									<input type="text" id="userId" name="userId" value={user.userId} autocomplete="off" hidden />
									<input type="text" id="username" name="username" value={user.username} autocomplete="off" hidden />
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
