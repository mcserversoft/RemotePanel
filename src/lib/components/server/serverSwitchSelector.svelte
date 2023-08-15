<script lang="ts">
	import { getFriendlyStatusName, getStatusBgColor } from '$lib/code/shared';
	import { mdiMenuDown } from '@mdi/js';
	import Icon from '../elements/icon.svelte';
	import { getSelectedServer } from '$lib/code/global';

	export let dropdownVisible: boolean;

	function toggleDropdown() {
		dropdownVisible = !dropdownVisible;
	}
</script>

<div class="flex pr-1.5">
	<button
		on:click={toggleDropdown}
		aria-controls="dropdown"
		aria-expanded={dropdownVisible}
		class="inline-flex px-2 justify-center items-center rounded-lg text-gray-800 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 focus:ring-2 focus:ring-blue-700 dark:focus:ring-blue-500"
	>
		<div class="flex items-center space-x-2 text-lg font-semibold text-zinc-100">
			<span class="inline-flex rounded-full h-2 w-2 pr-2 {getStatusBgColor($getSelectedServer?.status)}" title={getFriendlyStatusName($getSelectedServer?.status)} />
			<span class="text-left line-clamp-1 text-base md:text-lg">{$getSelectedServer?.name}</span>
		</div>
		<Icon data={mdiMenuDown} size={5} />
	</button>
</div>
