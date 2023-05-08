<script lang="ts">
	import { mdiOpenInNew } from '@mdi/js';
	import Icon from '../icon.svelte';

	export let name: string = 'dropdown';
	export let isExternal: boolean = false;

	let textColor = isExternal ? 'text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white';
</script>

<button on:click type="button" class="flex items-center w-full p-2 transition duration-75 rounded-lg group hover:bg-gray-100 {textColor} dark:hover:bg-gray-700">
	<slot />
	<span class="flex-1 ml-3 text-left whitespace-nowrap">{name}</span>
	{#if isExternal}
		<Icon data={mdiOpenInNew} size={5} />
	{/if}
</button>
