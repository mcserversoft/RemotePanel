<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { Label, Select } from 'flowbite-svelte';
	import type { ServerActionJobTask } from '$lib/code/scheduler';

	export let job: any;

	let selectedServerAction: any = (job as ServerActionJobTask)?.action;
	let serverActions: any = [];
	const dispatch = createEventDispatcher();

	// not the same as ServerAction, this starts from 0
	enum SchedulerServerAction {
		Stop = 0,
		Start = 1,
		Kill = 2,
		Restart = 3
	}

	onMount(async () => {
		load();
	});

	function load() {
		serverActions = Object.entries(SchedulerServerAction)
			.filter(([key, value]) => !isNaN(Number(value)))
			.map(([key, value]) => ({ value, name: key }));
	}

	function handleInputChange() {
		dispatch('update', selectedServerAction);
	}
</script>

<Label>
	<Select bind:value={selectedServerAction} items={serverActions} on:change={handleInputChange} required={true} />
</Label>
