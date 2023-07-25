<script lang="ts">
	import { mdiRefresh } from '@mdi/js';
	import Icon from './elements/icon.svelte';
	import { isOffline } from '$lib/code/global';
</script>

{#if $isOffline}
	<div class="toast">
		<div class="alert alert-error">
			<p class="italic">Lost connection, trying to restore the connection.</p>
			<!-- <ReloadSvg className="animate-spin inline text-white" /> -->
			<Icon data={mdiRefresh} size={5} class="animate-spin inline text-white" />
		</div>
	</div>
{/if}
