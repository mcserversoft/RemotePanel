<script lang="ts">
	import { mdiMenuDown, mdiMenuUp } from '@mdi/js';
	import Icon from '../elements/icon.svelte';

	export let isCollapsed = true;
	export let headersRawInput: string;

	function handleCollapse() {
		isCollapsed = !isCollapsed;
	}
</script>

<form on:submit|preventDefault={() => handleCollapse()}>
	<button class="w-full cursor-pointer mt-1.5">
		<div class="flex">
			{#if isCollapsed}
				<Icon data={mdiMenuUp} class="-mt-0.5 mr-1" />
			{:else}
				<Icon data={mdiMenuDown} class="-mt-0.5 mr-1" />
			{/if}
			<p class=" text-sm font-medium text-gray-900 dark:text-white">HTTP Headers</p>
			<p class="grow text-sm text-right font-medium text-gray-500 dark:text-gray-400">Optional</p>
		</div>
	</button>
</form>

{#if !isCollapsed}
	<textarea
		bind:value={headersRawInput}
		class="block w-full h-40 font-consolas md:px-5 px-2 text-sm text-gray-800 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
		placeholder="Authentication:Bearer eyJhbGciOiJIUzI1Ni...
User-Agent:MCSS API"
	/>

	<!-- TODO: add more fancier version of the header input -->
	<!-- {#each headers as header}
		<div class="grid gap-6 mb-6 md:grid-cols-2">
			<Input bind:value={header.key} label={'Key'} type={'text'} placeholder={'Authentication'} required={true} />
			<Input bind:value={header.value} label={'Value'} type={'text'} placeholder={'Bearer eyJhbGciOiJIUz...'} required={true} />
		</div>
	{:else}{/each}

	<div>
		<form on:submit|preventDefault={() => handleAddNewHeader()}>
			<button type="submit" class="text-sm font-medium text-blue-600 dark:text-blue-500 hover:underline">+ Add Header</button>
		</form>
	</div> -->
{/if}
