<script lang="ts">
	import { mdiOpenInNew } from '@mdi/js';
	import Icon from '../elements/icon.svelte';

	export let name: string = 'dropdown';
	export let isActive: boolean = false;
	export let isExternal: boolean = false;

	let textColor = isExternal ? 'text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white';
</script>

<li>
	<button on:click type="button" class="flex items-center w-full p-2 transition duration-75 rounded-lg group {textColor} {isActive ? 'bg-gray-150 dark:bg-gray-700' : 'hover:bg-gray-150 dark:hover:bg-gray-700'}">
		<slot />
		<span class="flex-1 ml-3 text-left whitespace-nowrap">{name}</span>
		{#if isExternal}
			<Icon data={mdiOpenInNew} size={5} />
		{/if}
	</button>
</li>
