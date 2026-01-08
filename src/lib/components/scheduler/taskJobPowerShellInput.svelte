<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Input from '../elements/input.svelte';
	import { PowerShellJobTask } from '$lib/code/scheduler';
	import Toggle from '../elements/toggle.svelte';
	import { Label } from 'flowbite-svelte';

	export let job: PowerShellJobTask;

	const dispatch = createEventDispatcher();

	function handleChange() {
		dispatch('update', job);
	}
</script>

<Label>
	PowerShell Command
	<Input bind:value={job.shellCommand} label={''} on:input={handleChange} type={'text'} placeholder={'Example: robocopy <source> <destination>'} required={true} class="mt-2" />
</Label>

<div class="pt-2">
	<Toggle bind:value={job.hideWindow} label={'Hide console window'} on:toggle={handleChange} />
	<p class=" text-sm text-gray-500 dark:text-gray-400">Display the system console when running the command.</p>
</div>
