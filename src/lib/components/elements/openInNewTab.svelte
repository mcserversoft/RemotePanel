<script lang="ts">
	import { mdiOpenInNew } from '@mdi/js';
	import Icon from './icon.svelte';

	export let url: string = '';
	export let text: string = '';
	export let inline: boolean = false;
</script>

<div class=" space-x-1 items-center text-gray-200 dark:text-gray-400 {inline ? 'inline-flex' : 'flex'} ">
	<a href={url} target="_blank" rel="noopener noreferrer" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">{text}</a>
	<Icon data={mdiOpenInNew} size={4} />
</div>
