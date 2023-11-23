<script lang="ts">
	import { navigateToPage } from '$lib/code/routing';
	import { onMount } from 'svelte';
	import type { PageReference } from '../../../types';

	export let name: string = 'dropdown';
	export let items: Array<PageReference> = [];
	export let isOpen: boolean = false;

	function handleToggle() {
		isOpen = !isOpen;
	}

	onMount(async () => {
		if (items.find((e) => e.isActive === true)) {
			isOpen = true;
		}
	});
</script>

<li>
	<button on:click={handleToggle} type="button" class="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
		<svg class="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
			<slot />
		</svg>
		<span class="flex-1 ml-3 text-left whitespace-nowrap">{name}</span>
		<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
	</button>

	{#if isOpen}
		<ul class="py-2 space-y-2">
			{#each items as item}
				{#if item.hasPermission}
					<li>
						<button on:click={() => navigateToPage(item.page)} class="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group dark:text-white {item.isActive ? 'bg-gray-100 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}">{item.name}</button>
					</li>
				{/if}
			{/each}
		</ul>
	{/if}
</li>
