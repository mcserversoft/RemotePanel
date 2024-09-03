<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { Label, Select } from 'flowbite-svelte';
	import { SchedulerServerAction, type JobTask, type ServerActionJobTask } from '$lib/code/scheduler';

	export let job: JobTask;

	let selectedServerAction: any = (job as ServerActionJobTask)?.action;
	let serverActions: any = [];
	const dispatch = createEventDispatcher();

	onMount(async () => {
		load();
	});

	function load() {
		serverActions = Object.entries(SchedulerServerAction)
			.filter(([key, value]) => !isNaN(Number(value)))
			.map(([key, value]) => ({ value, name: key }));
	}

	function handleChange() {
		dispatch('update', { id: job.jobId, order: job.order, enabled: job.enabled, action: selectedServerAction });
	}
</script>

<Label>
	<Select bind:value={selectedServerAction} items={serverActions} on:change={handleChange} required={true} />
</Label>
