<script type="ts">
	import { settings } from '$lib/code/storage';
	import { mdiArrowExpandLeft, mdiArrowExpandRight } from '@mdi/js';
	import { ToolbarButton } from 'flowbite-svelte';
	import Icon from './icon.svelte';

	function onToggleSizeClick() {
		settings.update((s) => {
			s.collapseSidebar = !s.collapseSidebar;
			return s;
		});
	}
</script>

<ToolbarButton on:click={onToggleSizeClick}>
	<Icon data={$settings.collapseSidebar ? mdiArrowExpandRight : mdiArrowExpandLeft} size={5} />
</ToolbarButton>
