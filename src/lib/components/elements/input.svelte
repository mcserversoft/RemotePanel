<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { HTMLInputTypeAttribute } from 'svelte/elements';

	export let label: string;
	export let value: string | number;
	export let placeholder: string = '';
	export let type: HTMLInputTypeAttribute = 'text';
	export let min: string = '';
	export let max: string = '';
	export let required: boolean = false;
	export let readonly: boolean = false;
	export let error: boolean = false;
	export let inputClass: string = '';

	const dispatch = createEventDispatcher();

	function handleInputChange() {
		dispatch('input', value);
	}

	function getStyling() {
		let style: string = 'bg-gray-50 text-gray-900  border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-500 dark:focus:ring-blue-500';

		if (error) {
			style = 'bg-red-50 text-red-900 border-red-500 dark:bg-gray-700 placeholder-red-700 dark:placeholder-red-500 dark:border-red-500 dark:text-red-500 focus:border-red-500 focus:ring-red-500 dark:focus:border-red-500 dark:focus:ring-red-500';
		}

		if (readonly) {
			style += '!text-gray-500 dark:!text-gray-400 pointer-events-none';
		}

		return `${style} ${inputClass}`;
	}
</script>

<label for={label} class="block mb-2 text-sm font-medium">{label}</label>
<input {...{ type }} bind:value on:input={handleInputChange} id={label} class="block w-full p-2.5 text-sm rounded-lg {getStyling()} " {placeholder} {required} {min} {max} {readonly} />

<p class="mt-3 text-sm text-gray-500 dark:text-gray-400">
	<slot />
</p>
