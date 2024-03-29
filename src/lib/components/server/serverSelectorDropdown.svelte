<script lang="ts">
	import { selectedServerId, servers } from '$lib/code/global';
	import { derived, writable } from 'svelte/store';
	import StatusIndicator from './statusIndicator.svelte';

	let dropdownVisible: boolean = false;

	const searchTerm = writable('');
	const filteredServers = derived([searchTerm, servers], ([$term, $servers]) =>
		$servers.filter((server) => {
			let searchableProperties = (server.name + server.description + server.type).toLowerCase();
			return searchableProperties.includes($term.toLowerCase());
		})
	);

	export function toggle() {
		dropdownVisible = !dropdownVisible;
	}

	export function close() {
		dropdownVisible = false;
	}

	function changeSelectedServer(serverId: string) {
		if (!serverId) {
			return;
		}

		selectedServerId.set(serverId);
		dropdownVisible = false;
	}
</script>

{#if dropdownVisible}
	<div class="relative">
		<div id="dropdown" class="absolute top-full w-full z-20 left-0 border border-gray-300 dark:border-gray-600 rounded shadow-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
			<div class="p-4">
				<label for="input-group-search" class="sr-only">Search</label>
				<div class="relative -mt-1.5">
					<div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
						<svg class="w-5 h-5 text-gray-500 dark:text-gray-400" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
							<path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
						</svg>
					</div>
					<form on:submit|preventDefault>
						<input
							bind:value={$searchTerm}
							type="text"
							id="input-group-search"
							class="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
							placeholder="Search server"
						/>
					</form>
				</div>
			</div>

			<ul class="grid grid-cols-1 sm:grid-cols-2 -mt-3 xl:grid-cols-4 gap-3 h-48 overflow-y-auto overflow-x-hidden p-3 text-sm">
				{#each $filteredServers || [] as { serverId, name, description, status }}
					<li class="flex flex-col max-h-16 rounded bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500">
						<button on:click={() => changeSelectedServer(serverId)} class="overflow-hidden rounded text-ellipsis p-2 focus:ring-2 focus:ring-blue-700 dark:focus:ring-blue-500">
							<div class="flex items-center pl-1 space-x-2 text-lg truncate">
								<StatusIndicator {status} hideTitle={true} class="-mr-2" />
								<p class="font-semibold">{name}</p>
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
	</div>
{/if}
