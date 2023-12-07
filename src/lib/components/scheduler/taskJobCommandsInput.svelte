<script lang="ts">
	import { mdiClose, mdiContentDuplicate, mdiPlus } from '@mdi/js';
	import { createEventDispatcher } from 'svelte';
	import Icon from '../elements/icon.svelte';
	import Input from '../elements/input.svelte';

	let commands: any = [];
	let inputCommand: string;

	const dispatch = createEventDispatcher();

	function handleAddCommand() {
		if (!inputCommand) {
			confirm('Failed to add command');
			return;
		}

		commands.push(inputCommand);
		//HACK update state
		commands = commands;

		inputCommand = '';
		dispatch('update', commands);
	}

	function handleDuplicateCommand(command: string) {
		inputCommand = command;
	}

	function handleRemoveCommand(index: number) {
		commands.splice(index, 1);
		//HACK update state
		commands = commands;
		dispatch('update', commands);
	}
</script>

<div class="rounded-xl px-3 py-2 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
	<ul>
		{#each [...commands] || [] || [] as command, index}
			<li class="flex items-center p-1 rounded hover:bg-gray-100 hover:dark:bg-gray-700 text-gray-800 dark:text-white">
				<span class="grow"><span class="text-gray-500 pr-1">{index + 1}</span> {command}</span>

				<form on:submit|preventDefault={() => handleDuplicateCommand(command)}>
					<button type="submit" class="pt-1" aria-label="Duplicate command"><Icon data={mdiContentDuplicate} size={4} class={'text-blue-500 mr-2'} /></button>
				</form>
				<form on:submit|preventDefault={() => handleRemoveCommand(index)} class="">
					<button type="submit" class="pt-1" aria-label="Remove command"><Icon data={mdiClose} size={5} class={'text-red-500'} /></button>
				</form>
			</li>
		{:else}
			<li>
				<p class="text-center">No commands.</p>
			</li>
		{/each}
	</ul>
</div>

<form on:submit|preventDefault={() => handleAddCommand()} class="pt-6 mb-2">
	<div class="flex items-end">
		<Input bind:value={inputCommand} label={''} placeholder={'Enter a server command, leading slashes (/) will be ignored when triggering.'} type={'text'} required={true} class={'grow'} />

		<button type="submit" class="p-2.5 ml-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 focus:ring-2 focus:ring-blue-700 dark:focus:ring-blue-500">
			<Icon data={mdiPlus} size={5} /> <span class="sr-only">Add File</span>
		</button>
	</div>
</form>
