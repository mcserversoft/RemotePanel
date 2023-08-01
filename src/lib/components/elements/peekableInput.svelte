<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { HTMLInputTypeAttribute } from 'svelte/elements';
	import Icon from './icon.svelte';
	import { mdiEye, mdiEyeOff } from '@mdi/js';

	export { className as class };
	export let label: string;
	export let value: string | number;
	export let placeholder: string = '';
	export let required: boolean;

	let className: string = '';
	let showPassword: boolean = false;
	$: type = showPassword ? ('text' as HTMLInputTypeAttribute) : ('password' as HTMLInputTypeAttribute);

	const dispatch = createEventDispatcher();

	function handleInputChange() {
		dispatch('input', value);
	}
	function toggleViewPassword() {
		showPassword = !showPassword;
	}
</script>

<div class="relative w-full {className} ">
	<label for={label} class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{label}</label>
	<input
		{...{ type }}
		bind:value
		on:input={handleInputChange}
		id={label}
		class="block w-full p-2.5 text-sm rounded-lg bg-gray-50 text-gray-900 border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-500 dark:focus:ring-blue-500"
		{placeholder}
		{required}
	/>

	<form on:submit|preventDefault={toggleViewPassword}>
		<button type="submit" class="text-gray-300 absolute right-2.5 bottom-2.5">
			<Icon data={showPassword ? mdiEyeOff : mdiEye} />
		</button>
	</form>
</div>
