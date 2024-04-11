<script lang="ts">
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { mdiArchive, mdiArrowULeftTop, mdiContentSave } from '@mdi/js';
	import Icon from '$lib/components/elements/icon.svelte';
	import PageTitleBanner from '$lib/components/page/pageTitleBanner.svelte';
	import Breadcrumb from '$lib/components/navigation/breadcrumb.svelte';
	import { Page, McssSettingsSection, WarningType } from '../../../types';
	import { getServer, selectedServerId } from '$lib/code/global';
	import { navigateToPage, selectedPageProps } from '$lib/code/routing';
	import Toggle from '$lib/components/elements/toggle.svelte';
	import { Button, Label, Select } from 'flowbite-svelte';
	import BoxedContainer from '$lib/components/elements/boxedContainer.svelte';
	import Input from '$lib/components/elements/input.svelte';
	import { editBackup, getBackupDetails, getMcssSettings } from '$lib/code/api';
	import Warning from '$lib/components/elements/warning.svelte';
	import BackupDenylistSelector from '$lib/components/backup/backupFilterListSelector.svelte';
	import { Permission, hasPermission } from '$lib/code/permissions';
	import { BackupFilterListDetails, type BackupCompression, type IBackupDetails, type IEditBackup } from '$lib/code/backup';

	let backupId: string;
	let name: string = '';
	let destination: string = '';
	let compression: BackupCompression;
	let deleteOldBackups: boolean = false;
	let suspendServer: boolean = false;
	let backupFilterList: BackupFilterListDetails = new BackupFilterListDetails();

	let originalName: string = '';
	let showError: boolean;
	let errorMessage: string;
	let areButtonsDisabled: boolean = true;

	let deleteOldBackupsThresholdSetting: any;

	let compressionOptions = [
		{ value: 0, name: 'High' },
		{ value: 1, name: 'Low' },
		{ value: 2, name: 'None' }
	];

	onMount(async () => {
		load();

		getMcssSettings(
			McssSettingsSection.Backups,
			(data: any) => {
				deleteOldBackupsThresholdSetting = data.deleteOldBackupsThreshold;
			},
			(wasSuccess: boolean) => {
				if (!wasSuccess) {
					deleteOldBackupsThresholdSetting = '? (unable to load)';
				}
			}
		);
	});

	function load() {
		backupId = get(selectedPageProps) ?? '';
		getBackup(backupId);
	}

	function getBackup(backupId: string) {
		getBackupDetails($selectedServerId, backupId, (wasSuccess: boolean, backupDetails: IBackupDetails) => {
			if (!wasSuccess) {
				showError = true;
				errorMessage = 'Unable to load this page, does the backup exist?';
			} else {
				name = backupDetails.name;
				destination = backupDetails.destination;
				suspendServer = backupDetails.suspend;
				deleteOldBackups = backupDetails.deleteOldBackups;
				compression = backupDetails.compression;
				backupFilterList.fileBlacklist = backupDetails.fileBlacklist;
				backupFilterList.folderBlacklist = backupDetails.folderBlacklist;
				originalName = backupDetails.name;
			}
		});
	}

	function updateBackup() {
		let updatedBackup: IEditBackup = {
			name: name,
			destination: destination,
			suspend: suspendServer,
			deleteOldBackups: deleteOldBackups,
			compression: compression,
			fileBlacklist: backupFilterList.fileBlacklist,
			folderBlacklist: backupFilterList.folderBlacklist
		};
		editBackup($selectedServerId, backupId, updatedBackup, (wasSuccess: boolean) => {
			if (wasSuccess) {
				confirm(`Backup: '${updatedBackup.name}' was successfully edited.`);
				navigateBack();
			} else {
				showError = true;
				errorMessage = `Failed to save changes for backup: '${updatedBackup.name}'.`;
			}
		});
	}

	function handleInputChange() {
		areButtonsDisabled = false;
	}

	function navigateBack() {
		navigateToPage(Page.Backups);
	}
</script>

<svelte:head>
	<title>MCSS Remote Panel | Edit Backup</title>
</svelte:head>

<section class="h-[calc(100vh-56px)] overflow-auto p-6 dark:bg-gray-900 dark:text-white">
	<Breadcrumb
		icon={mdiArchive}
		items={[
			{ name: 'Backups', page: Page.Backups, isClickable: true },
			{ name: 'Edit', page: Page.Empty, isClickable: false }
		]}
	/>

	<PageTitleBanner title="Edit Backup" caption="You are modifying backup: '{originalName}' from server: {getServer($selectedServerId)?.name ?? 'Unknown server.'}." />

	{#if hasPermission(Permission.viewBackups, $selectedServerId)}
		{#if showError}
			<Warning message={errorMessage} />
		{/if}

		<form on:submit|preventDefault={updateBackup} class="space-y-3">
			<BoxedContainer class="space-y-4">
				<Input bind:value={name} on:input={handleInputChange} label={'Name'} type={'text'} required={true} />
				<Input bind:value={destination} on:input={handleInputChange} label={'Destination'} type={'text'} required={true} />

				<Label>
					Compression
					<Select bind:value={compression} on:input={handleInputChange} items={compressionOptions} class="mt-2" />
				</Label>
			</BoxedContainer>

			<BoxedContainer>
				<BackupDenylistSelector {backupFilterList} on:update={handleInputChange} />
			</BoxedContainer>

			<BoxedContainer>
				<Toggle bind:value={deleteOldBackups} on:toggle={handleInputChange} label={'Delete old backups'}>
					<form on:submit|preventDefault={() => navigateToPage(Page.BackupSettings)} class="text-sm text-gray-500 dark:text-gray-400">
						Keep {deleteOldBackupsThresholdSetting} backups before deleting the old ones. You can edit this number in the
						<button type="submit" class="-mr-1 font-medium text-blue-600 dark:text-blue-500 hover:underline">backup settings</button>
						.
					</form>
				</Toggle>

				<div class="pt-6">
					<Toggle bind:value={suspendServer} on:toggle={handleInputChange} label={'Suspend server'} />
					<p class=" text-sm text-gray-500 dark:text-gray-400">Shutdown the server during the backup and start it when the backup is finished.</p>
				</div>
			</BoxedContainer>

			<div class="flex space-x-3">
				<Button type="submit" disabled={areButtonsDisabled} color="blue">
					<Icon data={mdiContentSave} class="mr-2 -ml-1" />Save Backup
				</Button>
				<Button type="button" disabled={areButtonsDisabled} on:click={navigateBack} color="alternative">
					<Icon data={mdiArrowULeftTop} class="mr-2 -ml-1" />Cancel
				</Button>
			</div>
		</form>
	{:else}
		<Warning message={`You are missing the following permissions, to view this page: ${Permission.viewBackups}`} type={WarningType.Permission} />
	{/if}
</section>
