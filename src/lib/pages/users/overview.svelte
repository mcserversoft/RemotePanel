<script lang="ts">
	import { mdiAccountPlus, mdiCheck, mdiClose } from '@mdi/js';
	import { fetchPanelUsers } from '$lib/code/api';
	import Icon from '$lib/components/icon.svelte';
	import { navigateToPage } from '$lib/code/routing';
	import { Page, type PanelUser } from '../../../types';
	import Spinner from '$lib/components/spinner.svelte';
	import PageTitleBanner from '$lib/components/page/pageTitleBanner.svelte';

	// @ts-ignore
	const version: string = __VERSION__;
	let users: PanelUser[] = [];
	let isLoading = true;

	fetchPanelUsers(
		(data: PanelUser[]) => {
			users = data;
		},
		(wasSuccess: boolean) => {
			isLoading = false;
		}
	);
</script>

<svelte:head>
	<title>MCSS Remote Panel | Users Overview</title>
</svelte:head>

<section class="pt-1 min-h-screen dark:bg-gray-900 dark:text-white">
	<div class="relative overflow-x-auto shadow-md">
		<PageTitleBanner title="Users Overview" caption="All users that are configured to view and use the Remote Panel.">
			<button
				on:click={() => navigateToPage(Page.UsersCreate)}
				type="button"
				class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
			>
				<Icon data={mdiAccountPlus} size={5} class="w-5 h-5 mr-2 -ml-1" />
				Add User
			</button>
		</PageTitleBanner>

		<div class="relative overflow-x-auto">
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
							<td scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{user.username}</td>
							<td class="px-6 py-4">
								<Icon data={user.enabled ? mdiCheck : mdiClose} class="{user.enabled ? 'text-green-400' : 'text-red-400'} " />
							</td>
							<td class="px-6 py-4">
								<Icon data={user.isAdmin ? mdiCheck : mdiClose} class="{user.isAdmin ? 'text-green-400' : 'text-red-400'} " />
							</td>
							<!--TODO server count  eg All <> (5/7) -->
							<td class="px-6 py-4">TODO</td>
							<!--TODO locale -->
							<td class="px-6 py-4">{new Date(user.lastModifiedAt).toLocaleString()}</td>
							<!--TODO locale -->
							<td class="px-6 py-4">{new Date(user.createdAt).toLocaleString()}</td>
							<td class="px-6 py-4 space-x-3">
								<a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
								<button on:click={() => confirm("Are you sure you want to delete user 'ABC'?")} class="font-medium text-red-600 dark:text-red-500 hover:underline">Remove</button>
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