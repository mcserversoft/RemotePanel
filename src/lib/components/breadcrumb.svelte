<script lang="ts">
	import { mdiChevronRight, mdiHome } from '@mdi/js';

	import Icon from './icon.svelte';
	import type { BreadcrumbItem, Page } from '../../types';
	import { navigateToPage } from '$lib/code/routing';

	export let icon: string = mdiHome;
	export let items = new Array<BreadcrumbItem>();
</script>

<nav class="flex mb-3" aria-label="Breadcrumb">
	<ol class="inline-flex items-center space-x-1 md:space-x-3">
		{#each items as item, index}
			{#if index == 0}
				<li class="inline-flex items-center">
					<button on:click={() => navigateToPage(item.page)} class="inline-flex items-center text-sm font-medium capitalize text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
						<Icon data={icon} size={4} class={'mr-2'} />
						{item.name}
					</button>
				</li>
			{:else}
				<li>
					<div class="flex items-center">
						{#if item.isClickable}
							<button on:click={() => navigateToPage(item.page)} class="inline-flex items-center text-sm font-medium capitalize text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
								<Icon data={mdiChevronRight} size={5} class={'text-gray-400'} />
								<span class="ml-1 text-sm font-medium capitalize md:ml-2 text-gray-500 dark:text-gray-400">{item.name}</span>
							</button>
						{:else}
							<Icon data={mdiChevronRight} size={5} class={'text-gray-400'} />
							<span class="ml-1 text-sm font-medium capitalize md:ml-2 text-gray-500 dark:text-gray-400">{item.name}</span>
						{/if}
					</div>
				</li>
			{/if}
		{/each}
	</ol>
</nav>
