<script lang="ts">
	import { getFriendlyStatusName, getStatusBgColor, getStatusTextColor } from '$lib/code/shared';

	export let status: number;
	export { className as class };

	let className: string = '';
</script>

<div class="flex items-center {className} {getStatusTextColor(status)}">
	<div class="h-2.5 w-2.5 rounded-full {getStatusBgColor(status)} mr-2" />
	{getFriendlyStatusName(status)}
</div>
