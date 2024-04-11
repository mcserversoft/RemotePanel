<script lang="ts">
	import { mdiBrightness2, mdiWhiteBalanceSunny } from '@mdi/js';
	import { settings } from '$lib/code/storage';
	import Icon from '../elements/icon.svelte';
	import { PanelTheme } from '$lib/code/panel';

	export { className as class };
	let className: string = '';
</script>

<Icon data={$settings.panelTheme == PanelTheme.Light ? mdiWhiteBalanceSunny : mdiBrightness2} class={className} />
