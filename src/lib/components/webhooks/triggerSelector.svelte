<script lang="ts">
	import { getCustomTriggers as getSelectableWebhookTriggers } from '$lib/code/webhook';

	export let selectedTriggers: string[] = [];
	let areAllTriggersSelected: boolean = false;

	$: if (areAllTriggersSelected) {
		selectedTriggers = getSelectableWebhookTriggers();
	}

	function handleSelectAll() {
		areAllTriggersSelected = true;
	}

	function handleUnselectAll() {
		areAllTriggersSelected = false;
		selectedTriggers = [];
	}

	function handleTriggerInput(event: any, trigger: string) {
		areAllTriggersSelected = selectedTriggers.length >= getSelectableWebhookTriggers().length;
	}
</script>

<h3 class=" text-sm font-medium text-gray-900 dark:text-white">Triggers</h3>

<ul class="flex space-x-2 mb-4">
	<li>
		<div class="flex space-x-2">
			<form on:submit|preventDefault={() => handleSelectAll()}>
				<button type="submit" class="text-sm font-medium text-blue-600 dark:text-blue-500 hover:underline">Select all</button>
			</form>
		</div>
	</li>
	<li>|</li>
	<li>
		<form on:submit|preventDefault={() => handleUnselectAll()}>
			<button type="submit" class="text-sm font-medium text-blue-600 dark:text-blue-500 hover:underline">Unselect all</button>
		</form>
	</li>
</ul>

<ul class="text-sm space-y-2">
	{#each getSelectableWebhookTriggers() as trigger}
		<li class="flex items-center">
			<input
				id="checkbox-{trigger}"
				type="checkbox"
				bind:group={selectedTriggers}
				on:change={(event) => handleTriggerInput(event, trigger)}
				value={trigger}
				class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
			/>
			<label for="checkbox-{trigger}" class="ms-2 font-medium text-gray-900 dark:text-gray-300">{trigger}</label>
		</li>
	{/each}
</ul>
