<script lang="ts">
	import { mdiRefresh } from '@mdi/js';
	import { createEventDispatcher, onMount } from 'svelte';
	import Icon from '../elements/icon.svelte';
	import { Label, Select } from 'flowbite-svelte';
	import { getBackups } from '$lib/code/api';
	import { get } from 'svelte/store';
	import { selectedServerId } from '$lib/code/global';
	import type { Backup } from '../../../types';
	import type { BackupJobTask } from '$lib/code/scheduler';

	export let job: any;

	let selectedBackup: string = (job as BackupJobTask)?.backupId;
	let backups: any = [];
	const dispatch = createEventDispatcher();

	onMount(async () => {
		load();
	});

	function load() {
		console.log('load backups');
		const serverId = get(selectedServerId);
		if (!serverId) {
			return;
		}

		getBackups(
			serverId,
			(data: Backup[]) => {
				backups = data.map(({ backupId, name }) => {
					return { value: backupId, name: name };
				});
			},
			(wasSuccess: boolean) => {}
		);
	}

	function handleInputChange() {
		dispatch('update', selectedBackup);
	}

	function handleReloadBackups() {
		load();
	}
</script>

<form on:submit|preventDefault={() => handleReloadBackups()}>
	<div class="flex items-end">
		<Label class="grow">
			<Select bind:value={selectedBackup} items={backups} on:change={handleInputChange} />
		</Label>

		<button type="submit" class="p-2.5 ml-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 focus:ring-2 focus:ring-blue-700 dark:focus:ring-blue-500">
			<Icon data={mdiRefresh} size={5} /> <span class="sr-only">Reload backups</span>
		</button>
	</div>
</form>
