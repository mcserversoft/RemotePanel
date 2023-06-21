<script lang="ts">
	import { Button, Modal } from 'flowbite-svelte';
	import Icon from '../elements/icon.svelte';
	import { mdiArrowULeftTop, mdiContentSave } from '@mdi/js';
	import { isLoadingServers, servers } from '$lib/code/api';
	import Spinner from '../elements/spinner.svelte';
	import type { ICustomServerPermission } from '../../../types';

	export let customServerPermissions: Record<string, Partial<ICustomServerPermission>> = {};

	let selection: any = [];
	let savedSelection: any = [];

	let isCustomServerSelected: boolean = false;
	let showCustomServersModal: boolean = false;

	// run on open
	$: if (showCustomServersModal) {
		$servers.forEach((server) => {
			customServerPermissions[server.serverId] = {
				viewStats: false,
				viewConsole: false,
				useConsole: false,
				useServerActions: false
			};
		});
	}

	function handlePermissionInput(event: any, serverId: string) {
		let value = event.target.value;
		let checked = event.target.checked;

		if (!customServerPermissions[serverId]) {
			return;
		}

		if (value == 0) {
			customServerPermissions[serverId].viewStats = checked;
		} else if (value == 1) {
			customServerPermissions[serverId].viewConsole = checked;
		} else if (value == 2) {
			customServerPermissions[serverId].useConsole = checked;
		} else if (value == 3) {
			customServerPermissions[serverId].useServerActions = checked;
		}

		console.log(customServerPermissions);
	}

	function handleSave() {
		showCustomServersModal = false;
		isCustomServerSelected = true;
		savedSelection = selection;

		// remove non selected items
		Object.entries(customServerPermissions).forEach((object: any) => {
			if (!savedSelection.includes(object[0])) {
				delete customServerPermissions[object[0]];
			}
		});

		console.log(customServerPermissions);
	}

	function handleDiscard() {
		showCustomServersModal = false;
		selection = savedSelection;
	}

	function handleModalCustomServersToggle() {
		showCustomServersModal = true;
	}
</script>

<p class="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Server Access & Permissions</p>
<p class="mb-3 text-sm text-gray-500 dark:text-gray-400">Set what servers & permissions this new user will be able to use.</p>

<div class="flex space-x-4">
	<div class="flex items-center">
		<input
			checked
			id="radio-selection-all"
			name="radio-selection"
			value={false}
			bind:group={isCustomServerSelected}
			type="radio"
			class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
		/>
		<label for="radio-selection-all" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">All</label>
	</div>
	<div class="flex items-center">
		<input
			id="radio-selection-custom"
			name="radio-selection"
			value={true}
			bind:group={isCustomServerSelected}
			type="radio"
			class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
		/>
		<label for="radio-selection-custom" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Custom ({selection.length})</label>
	</div>
	<div class="flex items-center">
		<form on:submit|preventDefault={handleModalCustomServersToggle}>
			<button type="submit" class="px-3 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Set Servers</button>
		</form>
	</div>
</div>

<Modal bind:open={showCustomServersModal} title="Custom Server Access & Permissions" class="overflow-hidden my-0 sm:my-20">
	<ul class="space-y-3">
		{#each $servers || [] as { serverId, name, description }, index}
			<li class=" text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
				<label class="flex items-center p-3 text-base font-bold">
					<input
						id="checkbox-custom-server-{index}"
						bind:group={selection}
						value={serverId}
						type="checkbox"
						class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
					/>
					<label for="checkbox-custom-server-{index}" class="sr-only">checkbox</label>
					<div class="ml-3 w-full pr-9">
						<p class="truncate">{name}</p>
						<p class="text-sm italic font-light truncate">{description ? description : ' No description for this server.'}</p>
					</div>
				</label>

				<ul class="items-center px-3 space-x-3 w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-t-none rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
					<li class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
						<div class="flex items-center">
							<input
								id="checkbox-permission-view-stats-{index}"
								type="checkbox"
								value="0"
								on:change={(event) => handlePermissionInput(event, serverId)}
								class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
							/>
							<label for="checkbox-permission-view-stats-{index}" class="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">View Stats</label>
						</div>
					</li>
					<li class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
						<div class="flex items-center">
							<input
								id="checkbox-permission-view-console-{index}"
								type="checkbox"
								value="1"
								on:change={(event) => handlePermissionInput(event, serverId)}
								class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
							/>
							<label for="checkbox-permission-view-console-{index}" class="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">View Console</label>
						</div>
					</li>
					<li class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
						<div class="flex items-center">
							<input
								id="checkbox-permission-use-console-{index}"
								type="checkbox"
								value="2"
								on:change={(event) => handlePermissionInput(event, serverId)}
								class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
							/>
							<label for="checkbox-permission-use-console-{index}" class="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Use Console</label>
						</div>
					</li>
					<li class="w-full dark:border-gray-600">
						<div class="flex items-center">
							<input
								id="checkbox-permission-use-server-actions-{index}"
								type="checkbox"
								value="3"
								on:change={(event) => handlePermissionInput(event, serverId)}
								class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
							/>
							<label for="checkbox-permission-use-server-actions-{index}" class="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300 whitespace-nowrap">Use Server Actions</label>
						</div>
					</li>
				</ul>
			</li>
		{:else}
			<li>
				{#if $isLoadingServers}
					<p class="text-center"><Spinner /></p>
				{:else}
					<p class="text-center">No servers were found.</p>
				{/if}
			</li>
		{/each}
	</ul>

	<svelte:fragment slot="footer">
		<div class="flex justify-end space-x-1 w-full">
			<Button type="submit" disabled={false} on:click={handleDiscard} color="alternative">
				<Icon data={mdiArrowULeftTop} class="mr-2 -ml-1" /> Discard
			</Button>
			<Button type="submit" disabled={false} on:click={handleSave}>
				<Icon data={mdiContentSave} class="mr-2 -ml-1" /> Save
			</Button>
		</div>
	</svelte:fragment>
</Modal>
