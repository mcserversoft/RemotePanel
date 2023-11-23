<script lang="ts">
	import { mdiMenuDown } from '@mdi/js';
	import { selectedServer } from '$lib/code/global';
	import { clickOutside } from '$lib/code/shared';
	import ServerSwitchDropdown from '$lib/components/server/serverSelectorDropdown.svelte';
	import Icon from '../elements/icon.svelte';
	import StatusIndicator from './statusIndicator.svelte';

	export let customDescription: string = '';
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
					class="inline-flex px-2 justify-center items-center rounded-lg text-gray-800 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:text-white dark:hover:bg-gray-600 focus:ring-2 focus:ring-blue-700 dark:focus:ring-blue-500"
				>
					<div class="flex items-center space-x-2 text-lg font-semibold">
						<StatusIndicator status={$selectedServer?.status ?? 0} hideTitle={true} class="-mr-2" />
						<span class="text-left line-clamp-1 text-base md:text-lg">{$selectedServer?.name}</span>
					</div>
					<Icon data={mdiMenuDown} size={5} />
				</button>
			</div>

			<p class="pl-2 text-sm font-normal text-gray-500 max-sm:hidden dark:text-gray-400">{customDescription ? customDescription : $selectedServer?.description}</p>
		</div>
		<slot />
	</div>
	<ServerSwitchDropdown bind:this={serverSwitchDropdownComponent} />
</span>
