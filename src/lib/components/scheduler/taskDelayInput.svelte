<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Input from '../elements/input.svelte';
	import { DelayJobTask } from '$lib/code/scheduler';
	import { Label } from 'flowbite-svelte';

	export let job: DelayJobTask;

	const dispatch = createEventDispatcher();

	function handleChange() {
		dispatch('update', job);
	}
</script>

<Label>
	Delay
	<Input bind:value={job.delay} label={''} on:input={handleChange} type={'text'} placeholder={'0'} required={true} class="mt-2">Choose a value between 1 and 600 seconds. Delays are limited to 10 minutes.</Input>
</Label>
