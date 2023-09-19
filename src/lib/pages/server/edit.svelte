<script lang="ts">
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { mdiAccountMultiple, mdiAlertRhombus, mdiArrowULeftTop, mdiContentSave } from '@mdi/js';
	import { navigateToPage, selectedPageProps } from '$lib/code/routing';
	import { Page, type IServerSettings, KeepOnline } from '../../../types';
	import { getServer, editServer } from '$lib/code/api';
	import Icon from '$lib/components/elements/icon.svelte';
	import Toggle from '$lib/components/elements/toggle.svelte';
	import Input from '$lib/components/elements/input.svelte';
	import PageTitleBanner from '$lib/components/page/pageTitleBanner.svelte';
	import Breadcrumb from '$lib/components/navigation/breadcrumb.svelte';
	import { Button, Label, Select } from 'flowbite-svelte';
	import BoxedContainer from '$lib/components/elements/boxedContainer.svelte';

	let loadedServerSettings: IServerSettings;
	let serverId: string;

	let name: string;
	let description: string;
	let isSetToAutoStart: boolean;
	let forceSaveOnStop: boolean;
	let javaAllocatedMemory: number;
	let keepOnline: KeepOnline;

	let showError: boolean;
	let errorMessage: string;
	let areButtonsDisabled: boolean = true;

	let keepOnlineOptions = [
		{ value: 0, name: 'None' },
		{ value: 1, name: 'Elevated' },
		{ value: 2, name: 'Aggressive' }
	];

	onMount(async () => {
		load();
	});

	function load() {
		serverId = get(selectedPageProps) ?? '';
		loadServerDetails(serverId);
	}

	function loadServerDetails(serverId: string) {
		getServer(serverId, (wasSuccess: boolean, settings: IServerSettings) => {
			if (!wasSuccess) {
				showError = true;
				errorMessage = 'Unable to load these server details, does this server exist?';
			} else {
				loadedServerSettings = settings;
				populateEditForm(settings);
			}
		});
	}

	function populateEditForm(server: IServerSettings) {
		name = server.name;
		description = server.description;
		javaAllocatedMemory = server.javaAllocatedMemory;

		isSetToAutoStart = server.isSetToAutoStart;
		forceSaveOnStop = server.forceSaveOnStop;
		keepOnline = server.keepOnline;
	}

	function updateServer() {
		let editedServer: IServerSettings = {
			name: name,
			description: description,
			isSetToAutoStart: isSetToAutoStart,
			forceSaveOnStop: forceSaveOnStop,
			javaAllocatedMemory: javaAllocatedMemory,
			keepOnline: keepOnline
		};

		editServer(serverId, editedServer, (wasSuccess: boolean) => {
			if (wasSuccess) {
				confirm(`Settings for server '${name}' were successfully saved.`);
				navigateBack();
			} else {
				showError = true;
				errorMessage = 'Failed to save settings, check browser console.';
			}
		});
	}

	function handleInputChange() {
		areButtonsDisabled = false;
	}

	function handleFormReset() {
		populateEditForm(loadedServerSettings);
		areButtonsDisabled = true;
	}

	function navigateBack() {
		navigateToPage(Page.Servers);
	}
</script>

<svelte:head>
	<title>MCSS Remote Panel | Editing Server</title>
</svelte:head>

<section class="h-[calc(100vh-56px)] overflow-auto p-6 dark:bg-gray-900 dark:text-white">
	<Breadcrumb
		icon={mdiAccountMultiple}
		items={[
			{ name: 'Servers', page: Page.Servers, isClickable: true },
			{ name: 'Edit', page: Page.Empty, isClickable: false }
		]}
	/>

	<PageTitleBanner title="Edit Server" caption="You are modifying server: '{name}'." />

	{#if showError}
		<div class="flex items-center w-full p-3 -mt-2 mb-3 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert">
			<div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-orange-500 bg-orange-100 rounded-lg dark:bg-orange-700 dark:text-orange-200">
				<Icon data={mdiAlertRhombus} />
				<span class="sr-only">Warning icon</span>
			</div>
			<div class="ml-3 text-sm font-normal">{errorMessage}</div>
		</div>
	{/if}

	<form on:submit|preventDefault={updateServer} class="space-y-3">
		<BoxedContainer>
			<Input bind:value={name} on:input={handleInputChange} label={'Name'} type={'text'} placeholder={'My Server Name'} required={true} />
			<Input bind:value={description} on:input={handleInputChange} label={'Description'} type={'text'} placeholder={'My Cool Server'} required={true} />
		</BoxedContainer>

		<BoxedContainer>
			<Input bind:value={javaAllocatedMemory} on:input={handleInputChange} label={'Amount of Memory'} type={'number'} required={true} />

			<Label>
				Crash Handling
				<Select bind:value={keepOnline} on:input={handleInputChange} items={keepOnlineOptions} class="mt-2" />
			</Label>
			<ul class="pt-3 text-gray-500 dark:text-gray-400 text-sm">
				<li><span class="font-bold">None:</span> Mcss will not automatically restart crashed or stopped servers.</li>
				<li><span class="font-bold">Elevated:</span> If the server crashes or is stopped by NON-MCSS input it will automatically restart.</li>
				<li><span class="font-bold">Aggressive:</span> If the server crashes or is stopped by ANY input it will automatically restart. This option can conflict with scheduler and backup tasks.</li>
			</ul>
		</BoxedContainer>

		<BoxedContainer>
			<Toggle bind:value={isSetToAutoStart} on:toggle={handleInputChange} label={'Autostart'}>Start server when MC Server Soft is launched.</Toggle>

			<div class="pt-6">
				<Toggle bind:value={forceSaveOnStop} on:toggle={handleInputChange} label={'Force Save'}>
					<p class=" text-sm text-gray-500 dark:text-gray-400">Send the /save-all command before shutting down the server.</p>
				</Toggle>
			</div>
		</BoxedContainer>

		<div class="flex space-x-3">
			<Button type="submit" disabled={areButtonsDisabled} color="blue">
				<Icon data={mdiContentSave} class="mr-2 -ml-1" />Save
			</Button>
			<Button type="button" on:click={handleFormReset} color="alternative" disabled={areButtonsDisabled}>
				<Icon data={mdiArrowULeftTop} class="mr-2 -ml-1" /> Revert
			</Button>
		</div>
	</form>
</section>
