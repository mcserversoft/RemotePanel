<script lang="ts">
	import { isOffline } from '$lib/code/api';
	import ReloadSvg from '$lib/svgs/ReloadSvg.svelte';
</script>

{#if $isOffline}
	<div class="toast">
		<div class="alert alert-error">
			<p class="italic">Lost connection, trying to restore the connection.</p>
			<ReloadSvg className="animate-spin inline text-white" />
		</div>
	</div>
{/if}
