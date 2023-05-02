<script lang="ts">
	import { getFriendlyStatusName, getStatusBgColor, getStatusTextColor } from '$lib/code/shared';
	import { navigateToPage } from '$lib/code/routing';
	import { servers, isLoadingServers } from '$lib/code/api';
	import Spinner from '$lib/components/spinner.svelte';
	import { mdiRefresh, mdiMagnify, mdiChevronDown } from '@mdi/js';
	import Icon from '$lib/components/icon.svelte';
	import Dropdown from '$lib/components/elements/dropdown.svelte';
	import { Button, DropdownItem } from 'flowbite-svelte';

	let title = 'Servers';
	let caption = 'General overview of all servers.';
	const items = $servers;
	let selection: any = [];

	enum MassAction {
		Start,
		Stop,
		Restart,
		Kill
	}

	// function changeSelectedServer(serverId: string) {
	// 	selectedServerId.set(serverId);
	// 	navigateToPage(Page.Dashboard);
	// }

	function toggleAll(e: any) {
		selection = e.target.checked ? [...items.map((x) => x.serverId)] : [];
	}

	function handleSearchSubmit() {
		console.log('search');
	}

	function handleRefreshButton() {
		console.log('refresh');
	}

	function handleMassAction(action: MassAction) {
		console.log(action);
	}

	function handleShortcutDropdownAction(event: any) {
		console.log(event.detail.action);
	}
</script>

<svelte:head>
	<title>MCSS Remote Panel | Servers</title>
</svelte:head>

<section class="min-h-screen dark:bg-gray-900 dark:text-white">
	<div class="relative overflow-x-auto">
		<!-- page title -->
		<div class="flex pb-3 space-x-2">
			<div class="self-center grow">
				<div class="pr-3 self-nonecenter">
					<span class="text-lg font-semibold">{title}</span>
					<p class="text-sm font-normal text-gray-500 max-sm:hidden dark:text-gray-400">{caption}</p>
				</div>
			</div>
			<div class="self-center">
				<label for="search-servers" class="sr-only">Search</label>
				<div class="relative w-full">
					<div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
						<Icon data={mdiMagnify} size={5} class="text-gray-500 dark:text-gray-400" />
					</div>
					<form on:submit|preventDefault={handleSearchSubmit}>
						<input
							type="text"
							id="search-servers"
							class="block w-full p-1.5 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
							placeholder="Search server list"
						/>
					</form>
				</div>
			</div>
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
				<Button
					btnClass="px-3 py-1.5 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
				>
					<span class="flex">Action <Icon data={mdiChevronDown} size={4} viewBox={20} class="mb-1" /></span>
				</Button>
				<Dropdown>
					<DropdownItem on:click={() => handleMassAction(MassAction.Start)}>Start</DropdownItem>
					<DropdownItem on:click={() => handleMassAction(MassAction.Stop)}>Stop</DropdownItem>
					<DropdownItem on:click={() => handleMassAction(MassAction.Restart)}>Restart</DropdownItem>
					<DropdownItem on:click={() => handleMassAction(MassAction.Kill)}>Kill</DropdownItem>
				</Dropdown>
			</div>
		</div>

		<!-- page table -->
		<table class="text-sm text-left text-gray-500 dark:text-gray-400">
			<thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
				<tr>
					<th scope="col" class="p-4">
						<div class="flex items-center">
							<input
								id="checkbox-all-search"
								on:change={toggleAll}
								checked={selection.length === items.length}
								type="checkbox"
								class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
							/>
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
				{#each items || [] as { serverId, name, description, status, creationDate }}
					<tr class="bg-white dark:bg-gray-800">
						<td class="w-4 p-4">
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
						<td class="max-w-xs px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
							<div class="flex-col">
								<p class="text-sm font-medium truncate">{name}</p>
								<p class="text-sm italic font-light truncate">{description ? description : ' No description for this server.'}</p>
							</div>
						</td>
						<td class="px-6 py-4">
							<div class="flex items-center {getStatusTextColor(status)}">
								<div class="h-2.5 w-2.5 rounded-full {getStatusBgColor(status)} mr-2" />
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
								<Button
									btnClass="px-2 py-2 text-gray-900 bg-white border border-gray-200 rounded-r-md hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
								>
									<Icon data={mdiChevronDown} size={4} viewBox={20} class="mb-1" /></Button
								>
								<Dropdown>
									<DropdownItem>View Console</DropdownItem>
									<DropdownItem>View Settings</DropdownItem>
									<DropdownItem>View Backups</DropdownItem>
									<DropdownItem>View Scheduler</DropdownItem>
								</Dropdown>
							</div>
						</td>
						<td class="px-6 py-4 space-x-3 font-medium text-center">
							<button on:click={() => ''} class="text-blue-600 dark:text-blue-500 hover:underline">Edit</button>
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
</section>
