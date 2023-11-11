<script lang="ts">
	import { mdiAlertRhombus } from '@mdi/js';
	import Icon from './icon.svelte';

	export let message: string = '';
	//TODO add more colors, warning, error, info, etc
</script>

<div class="flex items-center w-full p-3 -mt-2 mb-3 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert">
	<div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-orange-500 bg-orange-100 rounded-lg dark:bg-orange-700 dark:text-orange-200">
		<Icon data={mdiAlertRhombus} />
		<span class="sr-only">Warning icon</span>
	</div>
	<div class="ml-3 text-sm font-normal">{message}</div>
</div>
