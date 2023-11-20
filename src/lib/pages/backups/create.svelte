<script lang="ts">
	import { onMount } from 'svelte';
	import { mdiArchive, mdiArchivePlus, mdiArrowULeftTop } from '@mdi/js';
	import Icon from '$lib/components/elements/icon.svelte';
	import PageTitleBanner from '$lib/components/page/pageTitleBanner.svelte';
	import Breadcrumb from '$lib/components/navigation/breadcrumb.svelte';
	import { Page, BackupCompression, type INewBackup, McssSettingsSection, BackupFilterListDetails, WarningType } from '../../../types';
	import { getServer, selectedServerId } from '$lib/code/global';
	import { createBackup, getMcssSettings } from '$lib/code/api';
	import { navigateToPage } from '$lib/code/routing';
	import Input from '$lib/components/elements/input.svelte';
	import Toggle from '$lib/components/elements/toggle.svelte';
	import { Button, Label, Select } from 'flowbite-svelte';
	import BoxedContainer from '$lib/components/elements/boxedContainer.svelte';
	import BackupDenyListSelector from '$lib/components/backup/backupFilterListSelector.svelte';
	import { Permission, hasPermission } from '$lib/code/permissions';
	import Warning from '$lib/components/elements/warning.svelte';

	let name: string = '';
	let destination: string = '';
	let compression: BackupCompression = BackupCompression.High;
	let deleteOldBackups: boolean = false;
	let suspendServer: boolean = true;
	let backupNow: boolean = false;
	let backupFilterList: BackupFilterListDetails = new BackupFilterListDetails();

	let deleteOldBackupsThresholdSetting: any;

	let compressionOptions = [
		{ value: 0, name: 'High' },
		{ value: 1, name: 'Low' },
		{ value: 2, name: 'None' }
	];

	onMount(async () => {
		load();
	});

	function load() {
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
	}

	function createNewBackup() {
		let newBackup: INewBackup = {
			name: name,
			destination: destination,
			suspend: suspendServer,
			deleteOldBackups: deleteOldBackups,
			compression: compression,
			runBackupAfterCreation: backupNow,
			fileBlacklist: backupFilterList.fileBlacklist,
			folderBlacklist: backupFilterList.folderBlacklist
		};

		createBackup($selectedServerId, newBackup, (wasSuccess: boolean) => {
			if (wasSuccess) {
				confirm(`Backup: '${newBackup.name}' was successfully created.`);
				navigateBack();
			} else {
				confirm(`Failed to create backup: '${newBackup.name}'.`);
			}
		});
	}

	function navigateBack() {
		navigateToPage(Page.Backups);
	}
</script>

<svelte:head>
	<title>MCSS Remote Panel | Create Backup</title>
</svelte:head>

<section class="h-[calc(100vh-56px)] overflow-auto p-6 dark:bg-gray-900 dark:text-white">
	<Breadcrumb
		icon={mdiArchive}
		items={[
			{ name: 'Backups', page: Page.Backups, isClickable: true },
			{ name: 'Create', page: Page.Empty, isClickable: false }
		]}
	/>

	<PageTitleBanner title="Create Backup" caption="Create a new backup for server: {getServer($selectedServerId)?.name ?? 'Unknown server.'}." />

	{#if hasPermission(Permission.viewBackups, $selectedServerId)}
		<form on:submit|preventDefault={createNewBackup}>
			<BoxedContainer class="space-y-3">
				<Input bind:value={name} label={'Name'} type={'string'} placeholder={'Backup name'} required={true} />
				<Input bind:value={destination} label={'Destination'} type={'string'} required={true} />

				<Label>
					Compression
					<Select bind:value={compression} items={compressionOptions} class="mt-2" />
				</Label>
			</BoxedContainer>

			<BoxedContainer>
				<BackupDenyListSelector {backupFilterList} />
			</BoxedContainer>

			<BoxedContainer class="space-y-4">
				<div>
					<Toggle bind:value={deleteOldBackups} label={'Delete old backups'}>
						<form on:submit|preventDefault={() => navigateToPage(Page.BackupSettings)} class="text-sm text-gray-500 dark:text-gray-400">
							Keep {deleteOldBackupsThresholdSetting} backups before deleting the old ones. You can edit this number in the
							<button type="submit" class="-mr-1 font-medium text-blue-600 dark:text-blue-500 hover:underline">backup settings</button>
							.
						</form>
					</Toggle>
				</div>
				<div>
					<Toggle bind:value={suspendServer} label={'Suspend server'} />
					<p class=" text-sm text-gray-500 dark:text-gray-400">Shutdown the server during the backup and start it when the backup is finished.</p>
				</div>
				<div>
					<Toggle bind:value={backupNow} label={'Backup now'} />
					<p class=" text-sm text-gray-500 dark:text-gray-400">Start the backup after creating this backup.</p>
				</div>
			</BoxedContainer>

			<div class="flex space-x-3">
				<Button type="submit" color="blue">
					<Icon data={mdiArchivePlus} class="mr-2 -ml-1" />Create Backup
				</Button>
				<Button type="button" on:click={navigateBack} color="alternative">
					<Icon data={mdiArrowULeftTop} class="mr-2 -ml-1" />Cancel
				</Button>
			</div>
		</form>
	{:else}
		<Warning message={`You are missing the following permissions, to view this page: ${Permission.viewBackups}`} type={WarningType.Permission} />
	{/if}
</section>
