<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let playerRequirement: number;
	const dispatch = createEventDispatcher();

	function handleInputChange() {
		dispatch('update', playerRequirement);
	}
</script>

<span class="space-y-1 text-sm font-medium">
	<p class="">Player Requirement</p>
	<p class="text-gray-400">Depending on the player count you can block this task from being executed. Not supported on all server types.</p>
</span>

<div class="flex items-center">
	<input id="radio-selection-0" value={0} bind:group={playerRequirement} on:change={handleInputChange} type="radio" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
	<label for="radio-selection-0" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Always run, regardless of the player count (default)</label>
</div>
<div class="flex items-center">
	<input id="radio-selection-1" value={1} bind:group={playerRequirement} on:change={handleInputChange} type="radio" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
	<label for="radio-selection-1" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Only run when server is empty</label>
</div>
<div class="flex items-center">
	<input id="radio-selection-2" value={2} bind:group={playerRequirement} on:change={handleInputChange} type="radio" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
	<label for="radio-selection-2" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Only run when players are online</label>
</div>
