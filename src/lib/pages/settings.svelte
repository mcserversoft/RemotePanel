<script type="ts">
	import { settings } from '$lib/code/storage';
	import { getPanelTheme } from '$lib/code/theme';
	import Icon from '$lib/components/icon.svelte';
	import { Select, Label, Input, Toggle, Helper, Button } from 'flowbite-svelte';
	import { mdiContentSave, mdiArrowULeftTop } from '@mdi/js';
	import { PanelTheme } from '../../types';

	let serversRefreshRate: number = $settings.serversRefreshRate;
	let consoleRefreshRate: number = $settings.consoleRefreshRate;
	let amountOfConsoleLines: number = $settings.amountOfConsoleLines;
	let autoScrollConsole: boolean = $settings.autoScrollConsole;

	let inputErrorServersRefreshRate: boolean;
	let inputErrorConsoleRefreshRate: boolean;
	let inputErrorAmountOfConsoleLines: boolean;
	let disableButtons: boolean = true;

	let themeOptions = [
		{ value: 0, name: 'Light' },
		{ value: 1, name: 'Dark' },
		{ value: 2, name: 'System' }
	];

	let selectedTheme: number;
	if ($settings.useSystemTheme) {
		selectedTheme = 2;
	} else {
		selectedTheme = $settings.panelTheme;
	}

	function handleInputChange() {
		inputErrorServersRefreshRate = !(serversRefreshRate >= 1 && serversRefreshRate <= 3600);
		inputErrorConsoleRefreshRate = !(consoleRefreshRate >= 1 && consoleRefreshRate <= 3600);
		inputErrorAmountOfConsoleLines = !(amountOfConsoleLines >= 1 && amountOfConsoleLines <= 1000);
		disableButtons = false;
	}

	function handleFormReset() {
		serversRefreshRate = $settings.serversRefreshRate;
		consoleRefreshRate = $settings.consoleRefreshRate;
		amountOfConsoleLines = $settings.amountOfConsoleLines;
		autoScrollConsole = $settings.autoScrollConsole;
		disableButtons = true;
	}

	function handleFormSave() {
		if (serversRefreshRate >= 1 && serversRefreshRate <= 1000) {
			$settings.serversRefreshRate = serversRefreshRate;
		}

		if (consoleRefreshRate >= 1 && consoleRefreshRate <= 1000) {
			$settings.consoleRefreshRate = consoleRefreshRate;
		}

		if (amountOfConsoleLines >= 1 && amountOfConsoleLines <= 2000) {
			$settings.amountOfConsoleLines = amountOfConsoleLines;
		}

		console.log(selectedTheme);
		if (selectedTheme === 0) {
			$settings.panelTheme = PanelTheme.Light;
			$settings.useSystemTheme = false;
		} else if (selectedTheme === 1) {
			$settings.panelTheme = PanelTheme.Dark;
			$settings.useSystemTheme = false;
		} else if (selectedTheme === 2) {
			$settings.useSystemTheme = true;
			$settings.panelTheme = getPanelTheme();
		}

		$settings.autoScrollConsole = autoScrollConsole;
		disableButtons = true;
	}
</script>

<svelte:head>
	<title>MCSS Remote Panel | Settings</title>
</svelte:head>

<section class="py-24 min-h-screen dark:bg-gray-900 dark:text-white">
	<div class="text-center">
		<h1 class="text-3xl font-bold pb-1">Settings</h1>
		<p>Control how this panel interacts with the MCSS API, these settings are only stored in this browser.</p>
	</div>

	<form on:submit|preventDefault={handleFormSave} class="max-w-3xl mx-auto my-6">
		<div class="form-control mb-6">
			<div class="rounded-xl my-4 p-6 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
				<Label>
					Panel Theme
					<Select class="mt-2" items={themeOptions} bind:value={selectedTheme} on:input={handleInputChange} />
				</Label>
				<Helper class="text-sm mt-3">Choose between light or dark. You can also use the theme defined by your system.</Helper>
			</div>

			<div class="rounded-xl my-4 p-6 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
				<Label for="serversRefreshRate" class="mb-2">Server Refresh Rate</Label>
				<Input bind:value={serversRefreshRate} on:input={handleInputChange} color={inputErrorServersRefreshRate ? 'red' : 'base'} type="number" min="1" max="3600" id="serversRefreshRate" required />
				<Helper class="text-sm mt-3">Value between 1 and 3600 seconds.</Helper>
			</div>

			<div class="rounded-xl my-4 p-6 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
				<Label for="consoleRefreshRate" class="mb-2">Console Refresh Rate</Label>
				<Input bind:value={consoleRefreshRate} on:input={handleInputChange} color={inputErrorConsoleRefreshRate ? 'red' : 'base'} type="number" min="1" max="3600" id="consoleRefreshRate" required />
				<Helper class="text-sm mt-3">Value between 1 and 3600 seconds. Fast refresh rates can lead to performance issues.</Helper>
			</div>

			<div class="rounded-xl my-4 p-6 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
				<Label for="amountOfConsoleLines" class="mb-2">Amount of Console Lines</Label>
				<Input bind:value={amountOfConsoleLines} on:input={handleInputChange} color={inputErrorAmountOfConsoleLines ? 'red' : 'base'} type="number" min="1" max="1000" id="amountOfConsoleLines" required />
				<Helper class="text-sm mt-3">Value between 1 and 1000. Higher numbers can lead to performance issues.</Helper>
			</div>

			<div class="rounded-xl my-4 p-6 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
				<Toggle bind:checked={autoScrollConsole} on:click={handleInputChange}>Automatic Console Scrolling</Toggle>
				<Helper class="text-sm mt-3">When the console is updated, automatically scroll to the bottom.</Helper>
			</div>

			<Button type="submit" disabled={disableButtons}>
				<Icon data={mdiContentSave} class="mr-2 -ml-1" /> Save
			</Button>
			<Button type="button" disabled={disableButtons} on:click={handleFormReset} color="alternative">
				<Icon data={mdiArrowULeftTop} class="mr-2 -ml-1" /> Revert
			</Button>
		</div>
	</form>
</section>
