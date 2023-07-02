<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let label: string;
	export let value: boolean;

	const dispatch = createEventDispatcher();

	function handleInputChange() {
		dispatch('toggle', value);
	}
</script>

<div class="py-2">
	<label class="relative inline-flex items-center cursor-pointer">
		<input bind:checked={value} on:input={handleInputChange} type="checkbox" value="" class="sr-only peer" />
		<div
			class="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
		/>
		<span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">{label}</span>
	</label>

	<p class="text-sm text-gray-500 dark:text-gray-400">
		<slot />
	</p>
</div>
