<script lang="ts">
	import { getFriendlyStatusName, getStatusBgColor, getStatusTextColor } from '$lib/code/shared';
	import { navigateToPage } from '$lib/code/routing';
	import { servers, isLoadingServers, selectedServerId, sendMassServerAction, fetchServers } from '$lib/code/api';
	import Spinner from '$lib/components/elements/spinner.svelte';
	import { mdiRefresh, mdiMagnify, mdiChevronDown } from '@mdi/js';
	import Icon from '$lib/components/elements/icon.svelte';
	import Dropdown from '$lib/components/elements/dropdown.svelte';
	import { Button, DropdownItem } from 'flowbite-svelte';
	import { Page, Server, ServerAction } from '../../types';
	import PageTitleBanner from '$lib/components/page/pageTitleBanner.svelte';
	import StatusIndicator from '$lib/components/server/statusIndicator.svelte';

	let selection: any = [];

	let searchTerm: string;
	const serverList = $servers;
	let filteredServers = serverList;

	function changeSelectedServer(serverId: string) {
		if (!serverId) {
			return;
		}

		selectedServerId.set(serverId);
	}

	function toggleAll(e: any) {
		selection = e.target.checked ? [...filteredServers.map((x) => x.serverId)] : [];
	}

	// function handleRefreshButton() {
	// 	//fetchServers();

	// 	resetSelection();
	// 	resetSearch();
	// }

	function handleMassAction(action: ServerAction) {
		// when search is active, we only want to get the selected searched results
		let servers = getCommonServerIds(filteredServers, selection);
		sendMassServerAction(servers, action, (wasSuccess: boolean) => {
			if (!wasSuccess) {
				confirm('Something went wrong triggering the server action.');
			}
		});

		resetSelection();
	}

	function resetSelection() {
		selection = [];
	}

	function resetSearch() {
		searchTerm = '';
		filterServers();
	}

	function getCommonServerIds(servers: Server[], selectedIds: string[]): string[] {
		return servers.filter((s) => selectedIds.includes(s.serverId)).map((s) => s.serverId);
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
</script>

<svelte:head>
	<title>MCSS Remote Panel | Servers</title>
</svelte:head>

<section class="h-[calc(100vh-56px)] overflow-auto p-6 dark:bg-gray-900 dark:text-white">
	<!-- <section class="min-h-screen dark:bg-gray-900 dark:text-white"> -->
	<div class="relative overflow-x-auto">
		<PageTitleBanner title="Servers" caption="General overview of all servers.">
			<div class="self-center">
				<label for="search-servers" class="sr-only">Search</label>
				<div class="relative w-full">
					<div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
						<Icon data={mdiMagnify} size={5} class="text-gray-500 dark:text-gray-400" />
					</div>
					<form on:submit|preventDefault>
						<input
							bind:value={searchTerm}
							on:input={handleSearch}
							type="text"
							id="search-servers"
							class="block w-full p-1.5 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
							placeholder="Search server list"
						/>
					</form>
				</div>
			</div>
			<!-- <div class="self-center">
				<button
					type="button"
					on:click={handleRefreshButton}
					class="px-3 py-1.5 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none hover:bg-gray-100 hover:text-blue-700 focus:z-10 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 focus:ring-2 focus:ring-blue-700 dark:focus:ring-blue-500"
				>
					<Icon data={mdiRefresh} size={5}  />
				</button>
			</div> -->
			<div class="self-center">
				<Button
					btnClass="px-3 py-1.5 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none hover:bg-gray-100 hover:text-blue-700 focus:z-10 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 focus:ring-2 focus:ring-blue-700 dark:focus:ring-blue-500"
				>
					<span class="flex">Action <Icon data={mdiChevronDown} size={4} viewBox={20} class="mb-1" /></span>
				</Button>
				<Dropdown>
					<DropdownItem on:click={() => handleMassAction(ServerAction.Start)}>Start</DropdownItem>
					<DropdownItem on:click={() => handleMassAction(ServerAction.Stop)}>Stop</DropdownItem>
					<DropdownItem on:click={() => handleMassAction(ServerAction.Restart)}>Restart</DropdownItem>
					<DropdownItem on:click={() => handleMassAction(ServerAction.Kill)}>Kill</DropdownItem>
				</Dropdown>
			</div>
		</PageTitleBanner>

		<div class="relative overflow-x-auto shadow-md rounded-lg">
			<table class="table-auto text-sm w-full text-left text-gray-500 dark:text-gray-400">
				<thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
					<tr>
						<th scope="col" class="p-4">
							<div class="flex items-center">
								<input
									id="checkbox-all-search"
									on:change={toggleAll}
									checked={selection.length === filteredServers.length}
									type="checkbox"
									class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
								/>
								<label for="checkbox-all-search" class="sr-only">checkbox</label>
							</div>
						</th>
						<th scope="col" class="px-1 py-2 md:px-3 xl:px-6 xl:py-4">Details</th>
						<th scope="col" class="px-1 py-2 md:px-3 xl:px-6 xl:py-4 hidden md:table-cell text-center">Status</th>
						<th scope="col" class="px-1 py-2 md:px-3 xl:px-6 xl:py-4 hidden md:table-cell text-center">Created</th>
						<th scope="col" class="px-1 py-2 md:px-3 xl:px-6 xl:py-4 text-center">Shortcuts</th>
						<th scope="col" class="px-1 py-2 md:px-3 xl:px-6 xl:py-4 text-center">Actions</th>
					</tr>
				</thead>
				<!-- this colgroup HACK prevents the overflow of name & description td -->
				<colgroup>
					<col width="0%" />
					<col width="100%" />
					<col width="0%" />
					<col width="0%" />
					<col width="0%" />
					<col width="0%" />
				</colgroup>
				<tbody class="bg-white dark:bg-gray-800">
					{#each filteredServers || [] as { serverId, name, description, status, creationDate }}
						<tr>
							<td class="w-4 p-2 xl:p-4">
								<div class="flex items-center">
									<input
										id="checkbox-table-search-1"
										bind:group={selection}
										value={serverId}
										type="checkbox"
										class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
									/>
									<label for="checkbox-table-search-1" class="sr-only">checkbox</label>
								</div>
							</td>
							<td class="px-1 py-2 md:px-3 xl:px-6 xl:py-4 overflow-hidden max-w-[1px] font-medium text-ellipsis text-gray-900 dark:text-white">
								<span class="flex space-x-3">
									<p class="text-sm font-medium truncate">{name}</p>
									<StatusIndicator class="block md:hidden" {status} />
								</span>

								<p class="text-sm italic font-light truncate">{description ? description : ' No description for this server.'}</p>
							</td>
							<td class="px-1 py-2 md:px-3 xl:px-6 xl:py-4 hidden md:table-cell">
								<!-- TODO auto update status -->
								<StatusIndicator {status} />
							</td>
							<td class="px-1 py-2 md:px-3 xl:px-6 xl:py-4 hidden md:table-cell">
								<div class="whitespace-pre-wrap xl:whitespace-nowrap">
									{new Date(creationDate).toLocaleString(navigator.language)}
								</div>
							</td>
							<td class="px-1 py-2 md:px-3 xl:px-6 xl:py-4 text-center">
								<div class="inline-flex rounded-md shadow-sm" role="group">
									<button
										type="button"
										on:click={() => (changeSelectedServer(serverId), navigateToPage(Page.Dashboard))}
										class="px-2 py-1 xl:px-4 xl:py-2 hidden lg:block text-xs xl:text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-l-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
									>
										View Dashboard
									</button>
									<Button
										btnClass="px-2 py-2 text-gray-900 bg-white border border-gray-200 rounded-md lg:rounded-l-none hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
									>
										<Icon data={mdiChevronDown} size={4} viewBox={20} class="mb-1" />
									</Button>
									<Dropdown>
										<!--TODO pages-->
										<DropdownItem class="block lg:hidden text-xs xl:text-sm" on:click={() => (changeSelectedServer(serverId), navigateToPage(Page.Console))}>View Dashboard</DropdownItem>
										<DropdownItem class="text-xs xl:text-sm" on:click={() => (changeSelectedServer(serverId), navigateToPage(Page.Dashboard))}>View Console</DropdownItem>
										<DropdownItem class="text-xs xl:text-sm" on:click={() => (changeSelectedServer(serverId), navigateToPage(Page.Console))}>View Settings</DropdownItem>
										<DropdownItem class="text-xs xl:text-sm" on:click={() => (changeSelectedServer(serverId), navigateToPage(Page.Backups))}>View Backups</DropdownItem>
										<DropdownItem class="text-xs xl:text-sm" on:click={() => (changeSelectedServer(serverId), navigateToPage(Page.Console))}>View Scheduler</DropdownItem>
									</Dropdown>
								</div>
							</td>
							<td class="px-3">
								<div class="flex flex-col font-medium">
									<button on:click={() => confirm(`TODO: Edit server`)} class="text-blue-600 dark:text-blue-500 hover:underline">Edit</button>
									<button on:click={() => confirm(`TODO: Are you sure you want to delete server '${name}'?`)} class="text-red-600 dark:text-red-500 hover:underline">Remove</button>
								</div>
							</td>
						</tr>
					{:else}
						<tr>
							{#if $isLoadingServers}
								<td class="px-6 py-4 text-center" colspan="7"><Spinner /></td>
							{:else}
								<td class="px-6 py-4 text-center" colspan="7">No servers were found.</td>
							{/if}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</section>
