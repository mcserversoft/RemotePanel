<script lang="ts">
	import { settings } from '$lib/code/storage';
	import Icon from '$lib/components/elements/icon.svelte';
	import Input from '$lib/components/elements/input.svelte';
	import Toggle from '$lib/components/elements/toggle.svelte';
	import { Select, Label, Button } from 'flowbite-svelte';
	import { mdiContentSave, mdiArrowULeftTop } from '@mdi/js';
	import { PanelTheme, type IEditPanelSettings } from '../../types';
	import { editPanelSettings } from '$lib/code/api';

	let serversRefreshRate: number = $settings.serversRefreshRate;
	let consoleRefreshRate: number = $settings.consoleRefreshRate;
	let amountOfConsoleLines: number = $settings.amountOfConsoleLines;
	let autoScrollConsole: boolean = $settings.autoScrollConsole;
	let chatModeConsole: boolean = $settings.chatModeConsole;
	let debugging: boolean = $settings.debugging;

	let inputErrorServersRefreshRate: boolean;
	let inputErrorConsoleRefreshRate: boolean;
	let inputErrorAmountOfConsoleLines: boolean;
	let areButtonsDisabled: boolean = true;

	let themeOptions = [
		{ value: 0, name: 'Dark' },
		{ value: 1, name: 'Light' },
		{ value: 2, name: 'System' }
	];

	let selectedTheme: number = $settings.panelTheme;

	// reactivity incase the theme is toggled from the side nav
	$: handleThemeChange.bind($settings.panelTheme)();
	function handleThemeChange() {
		selectedTheme = $settings.panelTheme;
	}

	function handleInputChange() {
		inputErrorServersRefreshRate = !(serversRefreshRate >= 1 && serversRefreshRate <= 3600);
		inputErrorConsoleRefreshRate = !(consoleRefreshRate >= 1 && consoleRefreshRate <= 3600);
		inputErrorAmountOfConsoleLines = !(amountOfConsoleLines >= 1 && amountOfConsoleLines <= 1000);
		areButtonsDisabled = false;
	}

	function handleFormReset() {
		serversRefreshRate = $settings.serversRefreshRate;
		consoleRefreshRate = $settings.consoleRefreshRate;
		amountOfConsoleLines = $settings.amountOfConsoleLines;
		autoScrollConsole = $settings.autoScrollConsole;
		chatModeConsole = $settings.chatModeConsole;
		debugging = $settings.debugging;
		areButtonsDisabled = true;
	}

	function handleFormSave() {
		let updatedSettings: IEditPanelSettings = {
			amountOfConsoleLines: amountOfConsoleLines,
			consoleRefreshRate: consoleRefreshRate,
			panelTheme: selectedTheme,
			serverRefreshRate: serversRefreshRate,
			enableAutomaticConsoleScrolling: autoScrollConsole,
			enableConsoleChatMode: chatModeConsole,
			enableDebugging: debugging
		};

		editPanelSettings(updatedSettings, (wasSuccess: boolean) => {
			if (wasSuccess) {
				$settings.serversRefreshRate = serversRefreshRate;
				$settings.consoleRefreshRate = consoleRefreshRate;
				$settings.amountOfConsoleLines = amountOfConsoleLines;

				if (selectedTheme === 0) {
					$settings.panelTheme = PanelTheme.Dark;
				} else if (selectedTheme === 1) {
					$settings.panelTheme = PanelTheme.Light;
				} else if (selectedTheme === 2) {
					$settings.panelTheme = PanelTheme.System;
				}

				$settings.autoScrollConsole = autoScrollConsole;
				$settings.chatModeConsole = chatModeConsole;
				$settings.debugging = debugging;

				areButtonsDisabled = true;
			} else {
				confirm(`Failed to save settings, see logs.`);
			}
		});
	}
</script>

<svelte:head>
	<title>MCSS Remote Panel | Settings</title>
</svelte:head>

<section class="h-[calc(100vh-56px)] overflow-auto p-6 dark:bg-gray-900 dark:text-white py-12">
	<div class="text-center">
		<h1 class="text-3xl font-bold pb-1">Settings</h1>
		<p>Control how the panel interacts with the MCSS API.</p>
		<p class="italic">These settings are now synced to mcss. <span class="bg-purple-100 text-purple-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-purple-900 dark:text-purple-300">NEW</span></p>

		<!-- TODO check if failed to load at login, if so provide a way to refetch here -->
	</div>

	<form on:submit|preventDefault={handleFormSave} class="max-w-3xl mx-auto my-6">
		<div class="form-control mb-6">
			<div class="rounded-xl my-4 p-6 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
				<Label>
					Panel Theme
					<Select bind:value={selectedTheme} on:input={handleInputChange} items={themeOptions} class="mt-2" />
				</Label>
				<p class="mt-3 text-sm text-gray-500 dark:text-gray-400">Choose between light or dark. You can also use the theme defined by your system.</p>
			</div>

			<div class="rounded-xl my-4 p-6 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
				<Input bind:value={serversRefreshRate} on:input={handleInputChange} error={inputErrorServersRefreshRate} label={'Server Refresh Rate'} type={'number'} min="1" max="3600" required={true}>Value between 1 and 3600 seconds.</Input>
			</div>

			<div class="rounded-xl my-4 p-6 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
				<Input bind:value={consoleRefreshRate} on:input={handleInputChange} error={inputErrorConsoleRefreshRate} label={'Console Refresh Rate'} type={'number'} min="1" max="3600" required={true}>Value between 1 and 3600 seconds. Fast refresh rates can lead to performance issues.</Input>
			</div>

			<div class="rounded-xl my-4 p-6 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
				<Input bind:value={amountOfConsoleLines} on:input={handleInputChange} error={inputErrorAmountOfConsoleLines} label={'Amount of Console Lines'} type={'number'} min="1" max="1000" required={true}>Value between 1 and 1000. High numbers can lead to performance issues.</Input>
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

			<Button type="submit" disabled={areButtonsDisabled}>
				<Icon data={mdiContentSave} class="mr-2 -ml-1" /> Save
			</Button>
			<Button type="button" disabled={areButtonsDisabled} on:click={handleFormReset} color="alternative">
				<Icon data={mdiArrowULeftTop} class="mr-2 -ml-1" /> Revert
			</Button>
		</div>
	</form>
</section>
