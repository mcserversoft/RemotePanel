<script lang="ts">
	import { getFriendlyStatusName, getStatusBgColor } from '$lib/shared';
	import { getSelectedServer } from '$lib/api';
	import ActionDropdown from '$lib/components/actionDropdown.svelte';
</script>

<div class="flex mb-3">
	<div class="grow">
		<h2 class="leading-relaxed align-middle text-xl max-w-lg truncate">
			<span class="inline-flex rounded-full h-3 w-3  {getStatusBgColor($getSelectedServer?.status)}" title={getFriendlyStatusName($getSelectedServer?.status)} />
			{$getSelectedServer?.name}
		</h2>
	</div>

	<ActionDropdown statusName={getFriendlyStatusName($getSelectedServer?.status)} />
</div>
