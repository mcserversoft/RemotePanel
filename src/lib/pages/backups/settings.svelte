<script lang="ts">
	import { mdiArchive, mdiClose, mdiContentSave } from '@mdi/js';
	import Icon from '$lib/components/elements/icon.svelte';
	import Breadcrumb from '$lib/components/navigation/breadcrumb.svelte';
	import { Button } from 'flowbite-svelte';
	import PageTitleBanner from '$lib/components/page/pageTitleBanner.svelte';
	import BoxedContainer from '$lib/components/elements/boxedContainer.svelte';
	import Input from '$lib/components/elements/input.svelte';
	import { Url, getUrl } from '$lib/code/urlLibrary';
	import OpenInNewTab from '$lib/components/elements/openInNewTab.svelte';
	import { onMount } from 'svelte';
	import { getMcssSettings, updateMcssSettings } from '$lib/code/api';
	import Warning from '$lib/components/elements/warning.svelte';
	import { Page } from '$lib/code/routing';
	import { McssSettingsSection } from '$lib/code/mcss';

	let zipFileFormat: string;
	let deleteOldBackupsThreshold: number;

	let showError: boolean;
	let errorMessage: string;
	let areButtonsDisabled: boolean = true;

	let inputDeleteOldBackupsThreshold: boolean;

	onMount(async () => {
		load();
	});

	function load() {
		getMcssSettings(
			McssSettingsSection.Backups,
			(data: any) => {
				zipFileFormat = data.customZipFileFormat;
				deleteOldBackupsThreshold = data.deleteOldBackupsThreshold;
			},
			(wasSuccess: boolean) => {
				if (!wasSuccess) {
					showError = true;
					errorMessage = 'Unable to load the mcss settings.';
				}
			}
		);
	}

	function handleInputChange() {
		inputDeleteOldBackupsThreshold = !(deleteOldBackupsThreshold >= 5 && deleteOldBackupsThreshold <= 100);
		areButtonsDisabled = false;
	}

	function handleFormReset() {
		load();
		areButtonsDisabled = true;
	}

	function saveBackupSettings() {
		let updatedSettings: any = {
			customZipFileFormat: zipFileFormat,
			deleteOldBackupsThreshold: deleteOldBackupsThreshold
		};

		updateMcssSettings(updatedSettings, (wasSuccess: boolean) => {
			if (wasSuccess) {
				confirm(`Settings were successfully saved.`);
				areButtonsDisabled = true;
			} else {
				confirm(`Failed to save settings, see logs.`);
			}
		});
	}
</script>

<svelte:head>
	<title>MCSS Remote Panel | Backups Settings</title>
</svelte:head>

<section class="h-[calc(100vh-56px)] overflow-auto p-6 dark:bg-gray-900 dark:text-white">
	<Breadcrumb
		icon={mdiArchive}
		items={[
			{ name: 'Backups', page: Page.Backups, isClickable: true },
			{ name: 'Settings', page: Page.Empty, isClickable: false }
		]}
	/>

	<PageTitleBanner title="Editing Backup Settings" caption="You are modifying global backup settings." />

	{#if showError}
		<Warning message={errorMessage} />
	{/if}

	<form on:submit|preventDefault={saveBackupSettings} class="space-y-3">
		<BoxedContainer>
			<Input bind:value={zipFileFormat} on:input={handleInputChange} label={'ZIP File Format'} type={'text'} min="1" max="3600" required={true}>
				Provide a custom format for backup ZIP files. If the format is invalid the default will be used.<br />Available parameters: [date] [time] [unix] [backupname] [servername]</Input
			>
			<OpenInNewTab url={getUrl(Url.DocumentationCustomZipFileFormat)} text={'More info about custom formats and parameters.'} />
		</BoxedContainer>

		<BoxedContainer>
			<Input bind:value={deleteOldBackupsThreshold} error={inputDeleteOldBackupsThreshold} on:input={handleInputChange} label={'Delete Old Backups Threshold'} type={'number'} min="5" max="100" required={true}>
				The amount of backups in a destination folder that should be kept before being deleted by age.<br />Value between 5 and 100 backups.</Input
			>
		</BoxedContainer>

		<div class="flex space-x-3">
			<Button type="submit" disabled={areButtonsDisabled} color="blue">
				<Icon data={mdiContentSave} class="mr-2 -ml-1" />Save Settings
			</Button>
			<Button type="button" disabled={areButtonsDisabled} on:click={handleFormReset} color="alternative">
				<Icon data={mdiClose} class="mr-2 -ml-1" />Discard
			</Button>
		</div>
	</form>
</section>
