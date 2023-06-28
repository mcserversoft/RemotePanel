<script lang="ts">
	import { settings } from '$lib/code/storage';
	import { getPanelTheme } from '$lib/code/theme';
	import Icon from '$lib/components/elements/icon.svelte';
	import Input from '$lib/components/elements/input.svelte';
	import Toggle from '$lib/components/elements/toggle.svelte';
	import { Select, Label, Button } from 'flowbite-svelte';
	import { mdiContentSave, mdiArrowULeftTop } from '@mdi/js';
	import { PanelTheme } from '../../types';

	let serversRefreshRate: number = $settings.serversRefreshRate;
	let consoleRefreshRate: number = $settings.consoleRefreshRate;
	let amountOfConsoleLines: number = $settings.amountOfConsoleLines;
	let autoScrollConsole: boolean = $settings.autoScrollConsole;
	let chatModeConsole: boolean = $settings.chatModeConsole;
	let debugging: boolean = $settings.debugging;

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

	// reactivity incase the theme is toggled from the side nav
	$: selectedTheme = $settings.panelTheme;

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
		chatModeConsole = $settings.chatModeConsole;
		debugging = $settings.debugging;
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
		$settings.chatModeConsole = chatModeConsole;
		$settings.debugging = debugging;
		disableButtons = true;
	}
</script>

<svelte:head>
	<title>MCSS Remote Panel | Settings</title>
</svelte:head>

<section class="py-12 min-h-screen">
	<div class="text-center">
		<h1 class="text-3xl font-bold pb-1">Settings</h1>
		<p>Control how this panel interacts with the MCSS API, these settings are only stored in this browser.</p>
	</div>

	<form on:submit|preventDefault={handleFormSave} class="max-w-3xl mx-auto my-6">
		<div class="form-control mb-6">
			<div class="rounded-xl my-4 p-6 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
				<Label>
					Panel Theme
					<!--TODO this is broken-->
					<Select class="mt-2" items={themeOptions} bind:value={selectedTheme} on:input={handleInputChange} />
				</Label>
				<p class="mt-3 text-sm text-gray-500 dark:text-gray-400">Choose between light or dark. You can also use the theme defined by your system.</p>
			</div>

			<div class="rounded-xl my-4 p-6 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
				<Input bind:value={serversRefreshRate} error={inputErrorServersRefreshRate} label={'Server Refresh Rate'} type={'number'} placeholder={'Username'} min="1" max="3600" required={true}>Value between 1 and 3600 seconds.</Input>
			</div>

			<div class="rounded-xl my-4 p-6 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
				<Input bind:value={consoleRefreshRate} error={inputErrorConsoleRefreshRate} label={'Console Refresh Rate'} type={'number'} placeholder={'Username'} min="1" max="3600" required={true}>Value between 1 and 3600 seconds. Fast refresh rates can lead to performance issues.</Input>
			</div>

			<div class="rounded-xl my-4 p-6 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
				<Input bind:value={amountOfConsoleLines} error={inputErrorAmountOfConsoleLines} label={'Amount of Console Lines'} type={'number'} placeholder={'Username'} min="1" max="1000" required={true}>Value between 1 and 1000. Higher numbers can lead to performance issues.</Input>
			</div>

			<div class="rounded-xl my-4 p-6 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
				<Toggle bind:value={autoScrollConsole} on:toggle={handleInputChange} label={'Automatic Console Scrolling'}>When the console is updated, automatically scroll to the bottom.</Toggle>
			</div>

			<div class="rounded-xl my-4 p-6 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
				<Toggle bind:value={chatModeConsole} on:toggle={handleInputChange} label={'Console Chat Mode'}>
					Automatically convert your console input to the <span class="p-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">/say &lt;input&gt;</span> format.
				</Toggle>
			</div>

			<div class="rounded-xl my-4 p-6 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
				<Toggle bind:value={debugging} on:toggle={handleInputChange} label={'Debugging'}>Developer option to enable verbose logging in the browser's console.</Toggle>
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
