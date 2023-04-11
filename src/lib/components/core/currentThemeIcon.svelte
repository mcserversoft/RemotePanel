<script lang="ts">
	import { mdiBrightness2, mdiWhiteBalanceSunny } from '@mdi/js';
	import { settings } from '$lib/code/storage';
	import { PanelTheme } from '../../../types';
	import Icon from '../icon.svelte';

	export { className as class };
	let className: string = '';
</script>

<Icon data={$settings.panelTheme == PanelTheme.Light ? mdiWhiteBalanceSunny : mdiBrightness2} class={className} />
