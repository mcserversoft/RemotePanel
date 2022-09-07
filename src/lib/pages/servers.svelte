<script lang="ts">
	import { onDestroy } from 'svelte';
	import { get } from 'svelte/store';
	import { browser } from '$app/environment';
	import { auth, baseUrl, isOffline, selectedServer } from '$lib/storage';
	import { logout, getStatusBgColor } from '$lib/common.js';
	import { navigateToPage, Page } from '$lib/routing';

	interface Server {
		guid: string;
		name: string;
		description: string;
		status: number;
	}

	enum Filter {
		None,
		Minimal,
		Status
	}

	let servers: Server[];
	let loadingServers: boolean;
	let loadingMessage: string = '';

	if (browser) {
		const updateServerStatus = setInterval(() => {
			loadServers(Filter.Minimal);
		}, 5000);

		onDestroy(() => clearInterval(updateServerStatus));
	}

	loadServers();

	async function loadServers(filter: Filter = Filter.None) {
		loadingServers = true;
		const request = new Request(`${get(baseUrl)}/api/v1/servers?filter=${filter}`, {
			method: `GET`,
			headers: {
				apiKey: get(auth).apiKey
			}
		});

		await fetch(request)
			.then((response) => {
				if (response.status === 200) {
					return response.json();
				}
				return Promise.reject(response);
			})
			.then((data) => {
				servers = data;

				// update current server
				let foundSelectedServer = servers.find((s) => s.guid == $selectedServer.guid);
				if (foundSelectedServer) {
					$selectedServer.name = foundSelectedServer.name;
					$selectedServer.status = foundSelectedServer.status;
				}

				if (!data.any) {
					loadingMessage = 'No Servers found.';
				}
			})
			.catch((error) => {
				if (error.status === 401) {
					logout();
				} else if (!error.status) {
					$isOffline = true;
				}
				loadingMessage = 'Failed to fetch servers.';
			})
			.finally(() => {
				loadingServers = false;
			});
	}

	function reloadServers() {
		if (!loadingServers) {
			loadServers();
		}
	}

	function setSelectedServer(guid: string, name: string, status: number) {
		selectedServer.set({
			guid: guid,
			name: name,
			status: status
		});

		navigateToPage(Page.Dashboard);
	}
</script>

<section class="pt-3 px-6">
	<!-- <div class="flex items-center justify-between">
		<div class="flex shrink-0 ml-2">
			<button on:click={reloadServers} disabled={loadingServers} class="disabled:text-slate-700 text-slate-400">
				<ReloadSvg className={loadingServers ? 'animate-spin' : ''} />
			</button>
		</div>
	</div> -->

	{#each servers || [] as { guid, name, description, status }}
		<div class="flex items-center mb-6 h-9" on:click={() => setSelectedServer(guid, name, status)}>
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
			<span class="text-sm font-medium italic text-slate-400">{loadingMessage}</span>
		</div>
	{/each}
</section>
