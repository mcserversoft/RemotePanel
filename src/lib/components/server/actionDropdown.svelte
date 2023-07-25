<script lang="ts">
	import { get } from 'svelte/store';
	import { clickOutside } from '$lib/code/shared';
	import { postServerAction } from '$lib/code/api';
	import { ServerAction } from '../../../types';
	import Icon from '../elements/icon.svelte';
	import { mdiMenuDown } from '@mdi/js';
	import { selectedServerId } from '$lib/code/global';

	export let statusName: string;

	let dropdownVisible: boolean = false;

	function toggleDropdown() {
		dropdownVisible = !dropdownVisible;
	}

	function handleClickOutside() {
		dropdownVisible = false;
	}

	function serverActionClick(action: any) {
		dropdownVisible = false;
		const serverId = get(selectedServerId);
		if (!serverId) {
			return;
		}
		postServerAction(serverId, action.toLowerCase());
	}
</script>

<div class="relative" use:clickOutside on:click_outside={handleClickOutside}>
	<button on:click={toggleDropdown} aria-controls="dropdown" aria-expanded={dropdownVisible} class="inline-flex justify-center items-center group p-[7px] rounded-lg bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-700 dark:focus:ring-blue-500">
		<div class="flex items-center truncate text-zinc-100">
			<span class="truncate ml-2 text-xs font-medium uppercase">{statusName}</span>
			<Icon data={mdiMenuDown} size={5} />
		</div>
	</button>

	{#if dropdownVisible}
		<div id="dropdown" class="absolute top-full z-20 right-0 min-w-44 py-1.5 mt-1 rounded shadow-lg overflow-hidden bg-custom-gray-lightest">
			<ul class="w-28">
				{#each Object.values(ServerAction).filter((element) => typeof element === 'string') as action}
					<li>
						<button on:click={() => serverActionClick(action)} class="flex w-full py-1 px-3 text-sm capitalize text-gray-300 hover:bg-zinc-600">{action}</button>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>
