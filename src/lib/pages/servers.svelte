<script lang="ts">
	import { getFriendlyStatusName, getStatusBgColor, getStatusTextColor } from '$lib/code/shared';
	import { navigateToPage, Page } from '$lib/code/routing';
	import { servers, isLoadingServers } from '$lib/code/api';
	import { selectedServerGuid } from '$lib/code/api';

	function changeSelectedServer(guid: string) {
		selectedServerGuid.set(guid);
		navigateToPage(Page.Dashboard);
	}

	import { Card, Listgroup, Avatar, Button } from 'flowbite-svelte';
	import Icon from '$lib/components/icon.svelte';
	import { mdiContentSave, mdiDotsVertical } from '@mdi/js';
	import ServerSvg from '$lib/svgs/serverSvg.svelte';
	import PageContainer from '$lib/layouts/pageContainer.svelte';
	let list = [
		{ img: { src: '/images/profile-picture-1.webp', alt: 'Neil Sims' }, name: 'Neil Sims', email: 'email@windster.com', value: '$320' },
		{ img: { src: '/images/profile-picture-2.webp', alt: 'Bonnie Green' }, name: 'Bonnie Green', email: 'email@windster.com', value: '$3467' },
		{ img: { src: '/images/profile-picture-3.webp', alt: 'Michael Gough' }, name: 'Michael Gough', email: 'email@windster.com', value: '$67' },
	];
</script>

<svelte:head>
	<title>MCSS Remote Panel | Panel</title>
</svelte:head>

<PageContainer>
	<div class="bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white">Servers ({$servers.length})</h5>
			<a href="#" class="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500"> View all </a>
		</div>

		<div class="overflow-x-auto shadow-md sm:rounded-lg">
			<table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
				<thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
					<tr>
						<th scope="col" class="px-6 py-3">name</th>
						<th scope="col" class="px-6 py-3">status</th>
						<th scope="col" class="px-6 py-3">Type</th>
						<th scope="col" class="px-6 py-3">Version</th>

						<th scope="col" class="px-6 py-3">
							<span class="sr-only">Edit</span>
						</th>
					</tr>
				</thead>
				<tbody>
					{#each $servers || [] as { guid, name, description, status, type, version }}
						<tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 ">
							<td scope="row" class="px-6 py-4 font-medium max-w-[150px] truncate text-gray-900 whitespace-nowrap dark:text-white">{name}</td>
							<td class="px-6 py-4">
								<span class="text-xs font-medium mr-2 px-2.5 py-0.5 rounded {getStatusBgColor(status)} text-white">{getFriendlyStatusName(status)}</span>
							</td>
							<td class="px-6 py-4 max-w-0 truncate">{type}</td>
							<td class="px-6 py-4 max-w-0 truncate">{version.length ? version : 'unknown'} </td>
							<td class="px-6 py-4 text-right">
								<a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
							</td>
						</tr>
					{:else}
						<tr><p>Nothing here</p></tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
	<!----
		<div class="flow-root">
			<ul role="list" class="divide-y divide-gray-200 dark:divide-gray-700">
				{#each $servers || [] as { guid, name, description, status }}
					<li class="py-3 sm:py-4">
						<div class="flex items-center space-x-4">
							<div class="flex-shrink-0">
								<div class="relative">
									<ServerSvg className="w-6 h-6 dark:text-white" />
									<span class="left-auto top-0 right-0 -translate-y-1/2 translate-x-1/2 absolute w-3.5 h-3.5 {getStatusBgColor(status)} border-2 border-white dark:border-gray-800 rounded-full" />
								</div>
							</div>
							<div class="flex-1 min-w-0">
								<p class="text-sm font-medium text-gray-900 truncate dark:text-white">{name}</p>
								<p class="text-sm text-gray-500 truncate dark:text-gray-400">{description ? description : ' No description for this server.'}</p>
							</div>
							<Button type="submit" color="alternative">
								<Icon data={mdiDotsVertical} />
							</Button>
						</div>
					</li>
				{:else}{/each}
			</ul>
		</div>-->

	<!-- {#each $servers || [] as { guid, name, description, status }}
		<div class="flex items-center mb-6 h-9" on:click={() => changeSelectedServer(guid)}>
			<div class="flex-none w-14">
				<div class="indicator">
					<span class="indicator-item badge rounded-full border-none scale-50 mt-1 mr-1 {getStatusBgColor(status)}" />
					<div class="grid w-6 h-6 bg-base-300 place-items-center">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M21.75 17.25v-.228a4.5 4.5 0 00-.12-1.03l-2.268-9.64a3.375 3.375 0 00-3.285-2.602H7.923a3.375 3.375 0 00-3.285 2.602l-2.268 9.64a4.5 4.5 0 00-.12 1.03v.228m19.5 0a3 3 0 01-3 3H5.25a3 3 0 01-3-3m19.5 0a3 3 0 00-3-3H5.25a3 3 0 00-3 3m16.5 0h.008v.008h-.008v-.008zm-3 0h.008v.008h-.008v-.008z"
							/>
						</svg>
					</div>
				</div>
			</div>

			<div class="flex-grow overflow-hidden">
				<div class="flex-col">
					<p class="text-sm font-medium truncate">{name}</p>
					<p class="text-sm font-light italic truncate">{description ? description : ' No description for this server.'}</p>
				</div>
			</div>
		</div>
	{:else}
		<div class="text-center">
			<span class="text-sm font-medium italic text-slate-400">{$isLoadingServers ? 'Loading Servers.' : 'No Servers found.'}</span>
		</div>
	{/each} -->
</PageContainer>
