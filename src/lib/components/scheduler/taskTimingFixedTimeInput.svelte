<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Input from '../elements/input.svelte';
	import Toggle from '../elements/toggle.svelte';
	import type { FixedTimeTaskTiming } from '$lib/code/scheduler';

	export let timing: any;

	let fixedTime: string = (timing as FixedTimeTaskTiming)?.time;
	let repeat: boolean = (timing as FixedTimeTaskTiming)?.repeat;
	const dispatch = createEventDispatcher();

	function handleInputChange() {
		if (fixedTime) {
			dispatch('update', { fixedTime, repeat });
		}
	}
</script>

<!--
(?:[0-9]|0[0-9]|1[0-9]|2[0-3]):(?:[0-5][0-9]|[0-9]):(?:[0-5][0-9]|[0-9])
Single-digit hours, minutes and seconds (0-9).
Double-digit hours from 00 to 23.
Double-digit minutes and seconds from 00 to 59.
 -->
<Input bind:value={fixedTime} label={''} type={'string'} placeholder={'HH:mm:ss'} pattern="(?:[0-9]|0[0-9]|1[0-9]|2[0-3]):(?:[0-5][0-9]|[0-9]):(?:[0-5][0-9]|[0-9])" required={true} on:change={handleInputChange}>
	Define a <b>time</b> in the 24h format. E.g. 13:05:00
</Input>

<div class="mt-6">
	<Toggle bind:value={repeat} label={'Repeat'} on:toggle={handleInputChange} />
	<p class=" text-sm text-gray-500 dark:text-gray-400">Loop this task while the server is online.</p>
</div>
