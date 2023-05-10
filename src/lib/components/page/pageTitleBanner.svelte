<script lang="ts">
	import { mdiAccountMultiple } from '@mdi/js';
	import Icon from '../icon.svelte';

	export let title: string;
	export let caption: string;
</script>



<div class="flex pb-3 space-x-2">
	<div class="self-center grow">
		<div class="pr-3 self-nonecenter">
			<span class="text-lg font-semibold">{title}</span>
			<p class="text-sm font-normal text-gray-500 max-sm:hidden dark:text-gray-400">{caption}</p>
		</div>
	</div>
	<!-- <div class="self-center">
		<label for="search-servers" class="sr-only">Search</label>
		<div class="relative w-full">
			<div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
				<Icon data={mdiMagnify} size={5} class="text-gray-500 dark:text-gray-400" />
			</div>
			<form on:submit|preventDefault>
				<input
					type="text"
					id="search-servers"
					class="block w-full p-1.5 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
					placeholder="Search server list"
				/>
			</form>
		</div>
	</div> -->

	<slot />
</div>
