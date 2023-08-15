<script lang="ts">
	import { getSelectedServer } from '$lib/code/global';
	import { clickOutside, getFriendlyStatusName, getStatusBgColor } from '$lib/code/shared';
	import ServerSwitchDropdown from '$lib/components/server/serverSelectorDropdown.svelte';
	import { mdiMenuDown } from '@mdi/js';
	import Icon from '../elements/icon.svelte';

	let serverSwitchDropdownComponent: any;

	function handleToggle() {
		serverSwitchDropdownComponent.toggle();
	}

	function handleClickOutside() {
		serverSwitchDropdownComponent.close();
	}
</script>

<span use:clickOutside on:click_outside={handleClickOutside}>
	<div class="flex pb-3 space-x-2">
		<div class="self-center grow">
			<div class="flex p-1">
				<button
					on:click={handleToggle}
					aria-controls="dropdown"
					class="inline-flex px-2 justify-center items-center rounded-lg text-gray-800 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 focus:ring-2 focus:ring-blue-700 dark:focus:ring-blue-500"
				>
					<div class="flex items-center space-x-2 text-lg font-semibold text-zinc-100">
						<span class="inline-flex rounded-full h-2 w-2 pr-2 {getStatusBgColor($getSelectedServer?.status)}" title={getFriendlyStatusName($getSelectedServer?.status)} />
						<span class="text-left line-clamp-1 text-base md:text-lg">{$getSelectedServer?.name}</span>
					</div>
					<Icon data={mdiMenuDown} size={5} />
				</button>
			</div>

			<p class="pl-2 text-sm font-normal text-gray-500 max-sm:hidden dark:text-gray-400">{$getSelectedServer?.description}</p>
		</div>
		<slot />
	</div>
	<ServerSwitchDropdown bind:this={serverSwitchDropdownComponent} />
</span>
