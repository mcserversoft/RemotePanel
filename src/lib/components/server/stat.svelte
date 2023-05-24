<script lang="ts">
	import Icon from '../elements/icon.svelte';

	export let title = '';
	export let value = '';
	export let caption = '';
	export let icon = '';
</script>

<div class="flex justify-between bg-white shadow border border-gray-200 rounded-lg dark:border-gray-700 dark:bg-gray-800">
	<div class="flex w-full flex-col p-4 text-gray-700 dark:text-gray-400">
		<h5 class="text-md">{title}</h5>
		<p class="text-xl lg:text-2xl font-extrabold dark:text-gray-300">{value}</p>
		<p class="text-xs lg:text-sm">{caption}</p>
	</div>
	<Icon data={icon} size={9} class={'mr-2  text-gray-700 dark:text-gray-300'} />
</div>
