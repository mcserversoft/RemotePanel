<script lang="ts">
	import { mdiConnection, mdiRefresh } from '@mdi/js';
	import Icon from './elements/icon.svelte';
	import { isOffline } from '$lib/code/global';
</script>

{#if $isOffline}
	<div id="toast-bottom-right alert alert-error" class="z-50 fixed flex items-center w-full max-w-xs p-4 rounded-lg shadow right-5 bottom-5 text-red-500 bg-red-100 dark:bg-red-800 dark:text-red-200" role="alert">
		<div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8">
			<Icon data={mdiConnection} size={5} class="animate-pulse inline text-white" />
			<span class="sr-only">Lost connection icon</span>
		</div>
		<div class="pl-4 text-sm font-semibold">Lost connection, trying to reconnect.</div>
	</div>
{/if}
