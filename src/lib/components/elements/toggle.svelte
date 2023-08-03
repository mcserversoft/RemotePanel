<script lang="ts">
	import { afterUpdate, createEventDispatcher } from 'svelte';

	export let color: string = 'blue';
	export let label: string;
	export let value: boolean = true;

	const dispatch = createEventDispatcher();
	let isInitialized = false;

	afterUpdate(() => {
		isInitialized = false;
	});

	$: handleInputChange(value);

	function handleInputChange(value: boolean) {
		// don't trigger on the initial load
		// this doesn't seem an issue with other controls
		if (isInitialized) {
			dispatch('toggle', value);
		} else {
			isInitialized = true;
		}
	}

	function getColorLabelInfo(): string {
		if (color == 'red') {
			return 'text-red-500 dark:text-red-500 ';
		} else {
			return 'text-blue-500 dark:text-blue-500 ';
		}
	}

	function getColorToggleInfo(): string {
		if (color == 'red') {
			return 'peer-focus:ring-red-300 dark:peer-focus:ring-red-800 peer-checked:bg-red-600 ';
		}
		return 'peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 peer-checked:bg-blue-600 ';
	}
</script>

<div class="py-2">
	<label class="relative inline-flex items-center cursor-pointer">
		<input bind:checked={value} type="checkbox" value="toggle" class="sr-only peer" />
		<div
			class="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 {getColorToggleInfo()}"
		/>
		<span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300 {getColorLabelInfo()}">{label}</span>
	</label>

	<p class="text-sm text-gray-500 dark:text-gray-400">
		<slot />
	</p>
</div>
