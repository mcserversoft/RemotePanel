<script lang="ts">
	import { mdiArchive, mdiArrowULeftTop, mdiContentSave } from '@mdi/js';
	import Icon from '$lib/components/elements/icon.svelte';
	import { navigateToPage } from '$lib/code/routing';
	import { Page } from '../../../types';
	import Breadcrumb from '$lib/components/navigation/breadcrumb.svelte';
	import { Button } from 'flowbite-svelte';
	import PageTitleBanner from '$lib/components/page/pageTitleBanner.svelte';
	import BoxedContainer from '$lib/components/elements/boxedContainer.svelte';
	import Input from '$lib/components/elements/input.svelte';
	import { Url, getUrl } from '$lib/code/urlLibrary';
	import OpenInNewTab from '$lib/components/elements/openInNewTab.svelte';

	//TODO load backup settings
	export let zipFileFormat: string = 'Backup of [servername]_[backupname] [unix]';
	export let deleteOldBackupThreshold: number = 12;

	function updateBackupSettings() {
		console.log('TODO updateBackupSettings');
	}

	function handleFormReset() {
		// see panel settings
		console.log('TODO handleFormReset');

		//	areButtonsDisabled = true;
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

	<form on:submit|preventDefault={updateBackupSettings} class="space-y-3">
		<BoxedContainer>
			<Input bind:value={zipFileFormat} label={'ZIP File Format'} type={'string'} min="1" max="3600" required={true}>Provide a custom format for backup ZIP files. If the format is invalid the default will be used.<br />Available parameters: [date] [time] [unix] [backupname] [servername]</Input>
			<OpenInNewTab url={getUrl(Url.DocumentationCustomZipFileFormat)} text={'More info about custom formats and parameters.'} />
		</BoxedContainer>

		<BoxedContainer>
			<Input bind:value={deleteOldBackupThreshold} label={'Delete Old Backups Threshold'} type={'number'} min="5" max="100" required={true}>The amount of backups in a destination folder that should be kept before being deleted by age.<br />Value between 5 and 100 backups.</Input>
		</BoxedContainer>

		<div class="flex space-x-3">
			<Button type="submit" color="blue">
				<Icon data={mdiContentSave} class="mr-2 -ml-1" />Save Settings
			</Button>
			<Button type="button" on:click={handleFormReset} color="alternative">
				<Icon data={mdiArrowULeftTop} class="mr-2 -ml-1" />Revert
			</Button>
		</div>
	</form>
</section>
