<script lang="ts">
	import { getFriendlyStatusName, getStatusBgColor } from '$lib/code/shared';
	import { navigateToPage } from '$lib/code/routing';
	import { servers, isLoadingServers } from '$lib/code/api';
	import { selectedServerId } from '$lib/code/api';
	import { Page } from '../../types';
	import PageTitleBanner from '$lib/components/page/pageTitleBanner.svelte';
	import Spinner from '$lib/components/spinner.svelte';
	import { mdiRefresh, mdiMagnify } from '@mdi/js';
	import Icon from '$lib/components/icon.svelte';

	function changeSelectedServer(serverId: string) {
		selectedServerId.set(serverId);
		navigateToPage(Page.Dashboard);
	}
</script>

<svelte:head>
	<title>MCSS Remote Panel | Servers</title>
</svelte:head>

<section class="min-h-screen dark:bg-gray-900 dark:text-white">
	<div class="relative overflow-x-auto shadow-md">
		<PageTitleBanner title="Servers" caption="General overview of all servers." />
	</div>

	<div class="relative overflow-x-auto">
		<div class="flex justify-end p-3 space-x-2 bg-white dark:bg-gray-800">
			<!-- <div class="flex items-center justify-between p-3 bg-white dark:bg-gray-800"> -->
			<!-- <div class="w-64 pr-3 shrink">
				<label for="search-servers" class="sr-only">Search</label>
				<div class="relative w-full">
					<div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
						<Icon data={mdiMagnify} size={5} class="text-gray-500 dark:text-gray-400" />
					</div>
					<input
						type="text"
						id="search-servers"
						class="block w-full p-1.5 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
						placeholder="Search server list"
					/>
				</div>
			</div> -->
			<div class="w-64 shrink">
				<label for="search-servers" class="sr-only">Search</label>
				<div class="relative w-full">
					<div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
						<Icon data={mdiMagnify} size={5} class="text-gray-500 dark:text-gray-400" />
					</div>
					<input
						type="text"
						id="search-servers"
						class="block w-full p-1.5 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
						placeholder="Search server list"
					/>
				</div>
			</div>
			<div class="flex-none">
				<button
					type="button"
					class="px-3 py-1.5 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
				>
					<Icon data={mdiRefresh} size={5} class="" />
				</button>
			</div>
			<div class="flex-none">
				<button
					id="dropdownActionButton"
					data-dropdown-toggle="dropdownAction"
					class="inline-flex items-center font-medium rounded-lg text-sm px-3 py-1.5 text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
					type="button"
				>
					<span class="sr-only">Action button</span>
					Action
					<svg class="w-3 h-3 ml-2" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
				</button>

				<div id="dropdownAction" class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
					<ul class="py-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownActionButton">
						<li>
							<a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Reward</a>
						</li>
						<li>
							<a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Promote</a>
						</li>
						<li>
							<a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Activate account</a>
						</li>
					</ul>
					<div class="py-1">
						<a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Delete User</a>
					</div>
				</div>
			</div>
		</div>

		<table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
			<thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
				<tr>
					<th scope="col" class="p-4">
						<div class="flex items-center">
							<input id="checkbox-all-search" type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
							<label for="checkbox-all-search" class="sr-only">checkbox</label>
						</div>
					</th>
					<th scope="col" class="px-6 py-3">Details</th>
					<th scope="col" class="px-6 py-3">Status</th>
					<th scope="col" class="px-6 py-3">Created</th>
					<th scope="col" class="px-6 py-3">Shortcuts</th>
					<th scope="col" class="px-6 py-3 text-center">Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each $servers || [] as { serverId, name, description, status, creationDate }}
					<tr class="bg-white dark:bg-gray-800">
						<td class="w-4 p-4">
							<div class="flex items-center">
								<input id="checkbox-table-search-1" type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
								<label for="checkbox-table-search-1" class="sr-only">checkbox</label>
							</div>
						</td>
						<td class="max-w-xs px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
							<div class="flex-col">
								<p class="text-sm font-medium truncate">{name}</p>
								<p class="text-sm italic font-light truncate">{description ? description : ' No description for this server.'}</p>
							</div>
						</td>
						<td class="px-6 py-4">
							<div class="flex items-center">
								<div class="h-2.5 w-2.5 rounded-full {status ? 'bg-green-400' : 'bg-red-400'} mr-2" />
								{getFriendlyStatusName(status)}
							</div>
							<!-- <Icon data={status ? mdiCircleMedium : mdiCircleMedium} class="{status ? 'text-green-400' : 'text-red-400'} " /> -->
						</td>
						<!--TODO locale -->
						<td class="px-6 py-4">{new Date(creationDate).toLocaleString()}</td>
						<td class="px-6 py-4">
							<div class="inline-flex rounded-md shadow-sm" role="group">
								<button
									type="button"
									class="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-l-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
								>
									View Dashboard
								</button>
								<button
									type="button"
									class="px-2 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-r-md hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
								>
									<svg class="w-4 h-4" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
									</svg>
								</button>
							</div>
						</td>
						<td class="px-6 py-4 space-x-3 font-medium text-center">
							<a href="#" class="text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
							<button on:click={() => confirm(`Are you sure you want to delete server: ${name}?`)} class="text-red-600 dark:text-red-500 hover:underline">Remove</button>
						</td>
					</tr>
				{:else}
					<tr class="bg-white dark:bg-gray-800">
						{#if isLoadingServers}
							<td class="px-6 py-4 text-center" colspan="7"><Spinner /></td>
						{:else}
							<td class="px-6 py-4 text-center" colspan="7">No users were found.</td>
						{/if}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<!-- {#each $servers || [] as { serverId, name, description, status }}
		<div class="flex items-center mb-6 h-9" on:click={() => changeSelectedServer(serverId)}>
			<div class="flex-grow overflow-hidden">
				<div class="flex-col">
					<p class="text-sm font-medium truncate">{name}</p>
					<p class="text-sm italic font-light truncate">{description ? description : ' No description for this server.'}</p>
				</div>
			</div>
		</div>
	{:else}
		<div class="text-center">
			<span class="text-sm italic font-medium text-slate-400">{$isLoadingServers ? 'Loading Servers.' : 'No Servers found.'}</span>
		</div>
	{/each} -->
</section>
