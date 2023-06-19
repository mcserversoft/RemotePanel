<script lang="ts">
	import { clickOutside, getFriendlyStatusName, getStatusBgColor } from '$lib/code/shared';
	import { getSelectedServer, selectedServerId, servers } from '$lib/code/api';
	import { mdiMenuDown } from '@mdi/js';
	import Icon from '../elements/icon.svelte';

	let dropdownVisible: boolean = false;

	let searchTerm: string;
	const serverList = $servers;
	let filteredServers = serverList;

	function toggleDropdown() {
		dropdownVisible = !dropdownVisible;
	}

	function handleClickOutside() {
		dropdownVisible = false;
	}

	function handleSearch() {
		filterServers();
	}

	const filterServers = () => {
		return (filteredServers = serverList.filter((server) => {
			let searchableProperties = server.name.toLowerCase() + server.description.toLowerCase() + server.type.toLowerCase();
			return searchableProperties.includes(searchTerm.toLowerCase());
		}));
	};

	function changeSelectedServer(serverId: string) {
		if (!serverId) {
			return;
		}

		selectedServerId.set(serverId);
		dropdownVisible = false;
	}
</script>

<div class="relative" use:clickOutside on:click_outside={handleClickOutside}>
	<button
		on:click={toggleDropdown}
		aria-controls="dropdown"
		aria-expanded={dropdownVisible}
		class="inline-flex px-2 justify-center items-center group rounded-lg text-gray-800 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 focus:ring-2 focus:ring-blue-700 dark:focus:ring-blue-500"
	>
		<div class="flex items-center space-x-2 text-lg font-semibold truncate text-zinc-100">
			<span class="inline-flex rounded-full h-2 w-2 {getStatusBgColor($getSelectedServer?.status)}" title={getFriendlyStatusName($getSelectedServer?.status)} />
			<span>{$getSelectedServer?.name}</span>
		</div>
		<Icon data={mdiMenuDown} size={5} class="" />
	</button>

	{#if dropdownVisible}
		<div id="dropdown" class="absolute top-full z-20 left-0 py-1.5 mt-2 rounded shadow-lg overflow-hidden bg-custom-gray-lightest">
			<div class="p-3">
				<label for="input-group-search" class="sr-only">Search</label>
				<div class="relative">
					<div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
						<svg class="w-5 h-5 text-gray-500 dark:text-gray-400" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
							<path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
						</svg>
					</div>
					<form on:submit|preventDefault>
						<input
							bind:value={searchTerm}
							on:input={handleSearch}
							type="text"
							id="input-group-search"
							class="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
							placeholder="Search server"
						/>
					</form>
				</div>
			</div>

			<ul class="grid grid-cols-1 sm:grid-cols-2 -mt-2 xl:grid-cols-4 gap-3 h-48 overflow-y-auto overflow-x-hidden p-3 text-sm text-gray-700 dark:text-gray-200">
				{#each filteredServers || [] as { serverId, name, description, status }}
					<li class="flex flex-col max-h-16 rounded bg-gray-600">
						<button on:click={() => changeSelectedServer(serverId)} class="overflow-hidden rounded text-ellipsis p-2 focus:ring-2 focus:ring-blue-700 dark:focus:ring-blue-500">
							<div class="flex items-center space-x-2 text-lg truncate">
								<p class="inline-flex rounded-full h-2 w-2 shrink-0 {getStatusBgColor(status)}" title={getFriendlyStatusName(status)} />
								<p class="truncate">{name}</p>
							</div>
							<p class="text-left truncate">{description ? description : 'No description'}</p>
						</button>
					</li>
				{:else}
					<li class="col-span-full">
						<p class="text-center">No servers found.</p>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>
