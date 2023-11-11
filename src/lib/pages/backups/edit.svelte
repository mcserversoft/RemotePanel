<script lang="ts">
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { mdiAlertRhombus, mdiArchive, mdiArrowULeftTop, mdiContentSave, mdiRefreshCircle } from '@mdi/js';
	import Icon from '$lib/components/elements/icon.svelte';
	import PageTitleBanner from '$lib/components/page/pageTitleBanner.svelte';
	import Breadcrumb from '$lib/components/navigation/breadcrumb.svelte';
	import { Page, BackupCompression, type IBackupDetails, type IEditBackup } from '../../../types';
	import { getServer, selectedServerId } from '$lib/code/global';
	import { navigateToPage, selectedPageProps } from '$lib/code/routing';
	import Toggle from '$lib/components/elements/toggle.svelte';
	import { Button, Label, Select } from 'flowbite-svelte';
	import BoxedContainer from '$lib/components/elements/boxedContainer.svelte';
	import Input from '$lib/components/elements/input.svelte';
	import { editBackup, getBackupDetails } from '$lib/code/api';
	import Warning from '$lib/components/elements/warning.svelte';

	let backupId: string;
	let name: string = '';
	let destination: string = '';
	let compression: BackupCompression;
	let deleteOldBackups: boolean = false;
	let suspendServer: boolean = false;
	//TODO fileBlacklist & folderBlacklist
	let fileBlacklist: any;
	let folderBlacklist: any;

	let originalName: string = '';
	let showError: boolean;
	let errorMessage: string;
	let areButtonsDisabled: boolean = true;

	let compressionOptions = [
		{ value: 0, name: 'High' },
		{ value: 1, name: 'Low' },
		{ value: 2, name: 'None' }
	];

	onMount(async () => {
		load();
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
				originalName = backupDetails.name;

				name = backupDetails.name;
				destination = backupDetails.destination;
				suspendServer = backupDetails.suspend;
				deleteOldBackups = backupDetails.deleteOldBackups;
				compression = backupDetails.compression;
				fileBlacklist = backupDetails.fileBlacklist;
				folderBlacklist = backupDetails.folderBlacklist;
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
			fileBlacklist: fileBlacklist,
			folderBlacklist: folderBlacklist
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

	{#if showError}
		<Warning message={errorMessage} />
	{/if}

	<form on:submit|preventDefault={updateBackup} class="space-y-3">
		<BoxedContainer>
			<Input bind:value={name} label={'Name'} type={'string'} required={true} />
			<!-- TODO hidden because there is no file explorer yet -->
			<!-- <Input bind:value={destination} label={'Destination'} type={'string'} required={true} /> -->

			<Label>
				Compression
				<Select bind:value={compression} items={compressionOptions} class="mt-2" />
			</Label>
		</BoxedContainer>

		<BoxedContainer>
			<Toggle bind:value={deleteOldBackups} label={'Delete old backups'}>
				<!-- TODO fetch max backup count setting, instead of just displaying 12 -->
				<p class=" text-sm text-gray-500 dark:text-gray-400">Keep 12 backups before deleting the old ones. You can edit this number in the backup settings.</p>
			</Toggle>

			<div class="pt-6">
				<Toggle bind:value={suspendServer} label={'Suspend server'} />
				<p class=" text-sm text-gray-500 dark:text-gray-400">Shutdown the server during the backup and start it when the backup is finished.</p>
			</div>
		</BoxedContainer>

		<div class="flex space-x-3">
			<Button type="submit" color="blue">
				<Icon data={mdiContentSave} class="mr-2 -ml-1" />Save Backup
			</Button>
			<!-- TODO should this be revert or cancel? edit server & edit user behaves different -->
			<Button type="button" on:click={navigateBack} color="alternative">
				<Icon data={mdiArrowULeftTop} class="mr-2 -ml-1" />Cancel
			</Button>
		</div>
	</form>
</section>
