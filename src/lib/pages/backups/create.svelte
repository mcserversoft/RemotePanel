<script lang="ts">
	import { mdiArchive, mdiArchivePlus, mdiArrowULeftTop } from '@mdi/js';
	import Icon from '$lib/components/elements/icon.svelte';
	import PageTitleBanner from '$lib/components/page/pageTitleBanner.svelte';
	import Breadcrumb from '$lib/components/navigation/breadcrumb.svelte';
	import { Page, BackupCompression, type INewBackup } from '../../../types';
	import { getServer, selectedServerId } from '$lib/code/global';
	import { createBackup } from '$lib/code/api';
	import { navigateToPage } from '$lib/code/routing';
	import Input from '$lib/components/elements/input.svelte';
	import Toggle from '$lib/components/elements/toggle.svelte';
	import { Button, Label, Select } from 'flowbite-svelte';
	import BoxedContainer from '$lib/components/elements/boxedContainer.svelte';

	let name: string = '';
	let destination: string = '';
	let compression: BackupCompression;
	let deleteOldBackups: boolean = false;
	let suspendServer: boolean = false;
	let backupNow: boolean = false;
	//TODO fileBlacklist & folderBlacklist
	let fileBlacklist: any;
	let folderBlacklist: any;

	let compressionOptions = [
		{ value: 0, name: 'High' },
		{ value: 1, name: 'Low' },
		{ value: 2, name: 'None' }
	];

	function createNewBackup() {
		let newBackup: INewBackup = {
			name: name,
			destination: destination,
			suspend: suspendServer,
			deleteOldBackups: deleteOldBackups,
			compression: compression,
			runBackupAfterCreation: backupNow,
			fileBlacklist: fileBlacklist,
			folderBlacklist: folderBlacklist
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

	<form on:submit|preventDefault={createNewBackup} class="space-y-3">
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

			<div class="pt-6">
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
</section>
