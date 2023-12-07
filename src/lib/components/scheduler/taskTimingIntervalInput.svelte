<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Input from '../elements/input.svelte';
	import Toggle from '../elements/toggle.svelte';

	let interval: number;
	let suspendServer: boolean = true;
	const dispatch = createEventDispatcher();

	function handleInputChange() {
		if (interval) {
			dispatch('update', { interval, suspendServer });
		}
	}
</script>

<Input bind:value={interval} label={''} type={'number'} placeholder={'Interval in seconds'} required={true} on:input={handleInputChange}>
	The task wil run at the specified <b>interval</b>. Important to note is that the interval will start counting from when the server was detected as online, not from when it was started.
</Input>

<div class="mt-6">
	<Toggle bind:value={suspendServer} label={'Repeat'} on:toggle={handleInputChange} />
	<p class=" text-sm text-gray-500 dark:text-gray-400">Loop this task while the server is online.</p>
</div>
