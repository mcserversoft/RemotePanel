<script type="ts">
	import { settings } from '$lib/code/storage';
	import { togglePanelTheme } from '$lib/code/theme';
	import { mdiMoonWaningCrescent, mdiBrightness2, mdiWeatherSunny } from '@mdi/js';
	import { Button, ToolbarButton, Tooltip } from 'flowbite-svelte';
	import { PanelTheme } from '../../types';
	import Icon from './icon.svelte';

	function onToggleThemeClick() {
		togglePanelTheme();
	}
</script>

<ToolbarButton on:click={onToggleThemeClick}>
	<Icon data={$settings.panelTheme == PanelTheme.Light ? mdiWeatherSunny : mdiMoonWaningCrescent} size={5} />
</ToolbarButton>

<!-- <div class="flex flex-wrap items-center">
	<Button on:click={onToggleThemeClick} color="dark" pill={true} outline={true} class="!p-2" size="xl">
		<Icon data={$settings.panelTheme == PanelTheme.Light ? mdiWeatherSunny : mdiBrightness2} />
	</Button>
	<Tooltip placement={'left'}>Toggle theme</Tooltip>
</div> -->
