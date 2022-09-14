<script lang="ts">
	import { clickOutside } from '$lib/shared';
	import { sendServerAction } from '$lib/api';
	import ArrowDownSvg from '$lib/svgs/ArrowDownSvg.svelte';

	export let statusName: string;

	let actions: string[] = ['start', 'stop', 'restart', 'kill'];
	let dropdownVisible: boolean = false;

	function toggleDropdown() {
		dropdownVisible = !dropdownVisible;
	}

	function handleClickOutside() {
		dropdownVisible = false;
	}

	function serverActionClick(action: string) {
		dropdownVisible = false;
		sendServerAction(action);
	}
</script>

<div class="relative inline-flex" use:clickOutside on:click_outside={handleClickOutside}>
	<button on:click={toggleDropdown} aria-controls="dropdown" aria-expanded={dropdownVisible} class="inline-flex justify-center items-center group p-2 rounded bg-blue-600 hover:bg-blue-700">
		<div class="flex items-center truncate text-zinc-200">
			<span class="truncate ml-2 text-xs font-medium uppercase">{statusName}</span>
			<ArrowDownSvg />
		</div>
	</button>

	{#if dropdownVisible}
		<div id="dropdown" class="absolute top-full right-0 min-w-44 py-1.5 mt-1 rounded shadow-lg overflow-hidden bg-custom-gray-lightest ">
			<ul class="w-28">
				{#each actions as action}
					<li>
						<button on:click={() => serverActionClick(action)} class="flex w-full py-1 px-3 text-sm capitalize text-gray-300 hover:bg-zinc-600">{action}</button>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>
