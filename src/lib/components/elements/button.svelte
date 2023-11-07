<script lang="ts">
	import Icon from './icon.svelte';

	export let text: string = '';
	export let icon: string = '';
	export let color: string = 'blue';
	export let reactive: boolean = false;
</script>

<!-- TODO button styling -->
<!-- TODO create color styling lib? -->
<button
	on:click
	type="button"
	class="font-medium rounded-lg text-sm px-5 text-center py-[0.45rem] inline-flex items-center focus:ring-4 focus:outline-none
	text-white bg-{color}-700 hover:bg-{color}-800 focus:ring-{color}-300 dark:bg-{color}-600 dark:hover:bg-{color}-700 dark:focus:ring-{color}-800"
>
	{#if icon}
		<Icon data={icon} size={5} class="" />
	{:else}
		<div class="h-5" />
	{/if}
	{#if text}
		<span class="ml-2 whitespace-nowrap {reactive ? 'hidden sm:block' : ''}">
			{text}
		</span>
	{/if}
</button>
