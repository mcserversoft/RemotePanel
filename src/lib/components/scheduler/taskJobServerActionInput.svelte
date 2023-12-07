<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { Label, Select } from 'flowbite-svelte';
	import { ServerAction } from '../../../types';

	let selectedServerAction: any;
	let serverActions: any = [];
	const dispatch = createEventDispatcher();

	onMount(async () => {
		load();
	});

	function load() {
		serverActions = Object.entries(ServerAction)
			.filter(([key, value]) => !isNaN(Number(value)))
			.map(([key, value]) => ({ value, name: key }));
	}

	function handleInputChange() {
		dispatch('update', selectedServerAction);
	}
</script>

<Label>
	<Select bind:value={selectedServerAction} items={serverActions} on:change={handleInputChange} />
</Label>
