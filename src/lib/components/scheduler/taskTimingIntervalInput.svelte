<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Input from '../elements/input.svelte';
	import Toggle from '../elements/toggle.svelte';
	import type { IntervalTaskTiming } from '$lib/code/scheduler';

	export let timing: any;

	let interval: number = (timing as IntervalTaskTiming)?.interval;
	let repeat: boolean = (timing as IntervalTaskTiming)?.repeat;
	const dispatch = createEventDispatcher();

	function handleInputChange() {
		if (interval) {
			dispatch('update', { interval, repeat });
		}
	}
</script>

<Input bind:value={interval} label={''} type={'number'} placeholder={'Interval in seconds'} required={true} on:input={handleInputChange}>
	The task wil run at the specified <b>interval</b>. Important to note is that the interval will start counting from when the server was detected as online, not from when it was started.
</Input>

<div class="mt-6">
	<Toggle bind:value={repeat} label={'Repeat'} on:toggle={handleInputChange} />
	<p class=" text-sm text-gray-500 dark:text-gray-400">Loop this task while the server is online.</p>
</div>
