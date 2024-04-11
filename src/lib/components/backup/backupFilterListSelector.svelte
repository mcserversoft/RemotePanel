<script lang="ts">
	import { isLoadingServers } from '$lib/code/global';
	import { doesContainsInvalidWindowsExplorerCharacters } from '$lib/code/shared';
	import { mdiArrowULeftTop, mdiBlockHelper, mdiClose, mdiContentDuplicate, mdiContentSave, mdiPlus } from '@mdi/js';
	import { Button, Modal } from 'flowbite-svelte';
	import { createEventDispatcher } from 'svelte';
	import Icon from '../elements/icon.svelte';
	import Input from '../elements/input.svelte';
	import Spinner from '../elements/spinner.svelte';
	import type { BackupFilterListDetails } from '$lib/code/backup';

	export let backupFilterList: BackupFilterListDetails;

	let fileBlacklist: any = [];
	let folderBlacklist: any = [];

	let count: number = 0;

	let inputFileName: string;
	let inputFolderName: string;
	let areButtonsDisabled: boolean = true;

	$: count = backupFilterList?.getCount();

	let showCustomServersModal: boolean = false;
	let modalContainingElement: any;

	const dispatch = createEventDispatcher();

	function loadModalData() {
		fileBlacklist = Object.create(backupFilterList.fileBlacklist);
		folderBlacklist = Object.create(backupFilterList.folderBlacklist);

		areButtonsDisabled = true;
	}

	function handleModalCustomServersToggle() {
		showCustomServersModal = !showCustomServersModal;
	}

	function doesFileAlreadyExist(file: string) {
		return fileBlacklist.includes(file);
	}

	function doesFolderAlreadyExist(folder: string) {
		return folderBlacklist.includes(folder);
	}

	function handleAddFile() {
		if (!inputFileName || doesFileAlreadyExist(inputFileName) || doesContainsInvalidWindowsExplorerCharacters(inputFileName)) {
			confirm('Failed to add file');
			return;
		}

		fileBlacklist.push(inputFileName);

		inputFileName = '';
		areButtonsDisabled = false;

		//HACK to update the state
		fileBlacklist = fileBlacklist;
	}

	function handleAddFolder() {
		if (!inputFolderName || doesFolderAlreadyExist(inputFolderName) || doesContainsInvalidWindowsExplorerCharacters(inputFolderName)) {
			confirm('Failed to add folder.');
			return;
		}

		folderBlacklist.push(inputFolderName);

		inputFolderName = '';
		areButtonsDisabled = false;

		//HACK to update the state
		folderBlacklist = folderBlacklist;
	}

	function handleClearItems() {
		fileBlacklist = [];
		folderBlacklist = [];
		areButtonsDisabled = false;
	}

	function handleDuplicateItem(blockedItem: string) {
		if (folderBlacklist.includes(blockedItem)) {
			inputFolderName = blockedItem;
		} else {
			inputFileName = blockedItem;
		}
		modalContainingElement.scrollIntoView();
	}

	function handleRemoveItem(blockedItem: string) {
		if (!blockedItem) {
			return;
		}

		// we the current api we don't know which is which, so attempt to remove twice
		fileBlacklist = fileBlacklist.filter((e: string) => e !== blockedItem);
		folderBlacklist = folderBlacklist.filter((e: string) => e !== blockedItem);

		areButtonsDisabled = false;
	}

	function handleSave() {
		//save local to original
		backupFilterList.update(fileBlacklist, folderBlacklist);

		//HACK force state update
		backupFilterList = backupFilterList;

		dispatch('update');
		showCustomServersModal = false;
	}

	function handleDiscard() {
		showCustomServersModal = false;
	}
</script>

<p class="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
	File & Folder Filter <span class="text-xs font-medium mx-1.5 px-2.5 py-0.5 rounded bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-gray-300">BETA</span>
</p>
<p class="mb-3 text-sm text-gray-500 dark:text-gray-400">Set what files and folders shouldn't be included into the backup.</p>

<div class="flex flex-col space-y-4 select-none">
	<div class="inline-flex items-center {count ? 'text-red-500' : 'text-green-500'}">
		<Icon data={mdiBlockHelper} size={4} />
		<label for="radio-selection-custom" class="ml-2 text-sm font-medium">{count} items are currently blocked.</label>
	</div>
	<form on:submit|preventDefault={handleModalCustomServersToggle}>
		<button type="submit" on:click={loadModalData} class="px-3 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Open filter</button>
	</form>
</div>

<!-- FUTURE this has a weird white line in dark mode -->
<Modal bind:open={showCustomServersModal} title="File & Folder Filter" class="overflow-hidden my-0 sm:my-20">
	<div bind:this={modalContainingElement}>
		<form on:submit|preventDefault={() => handleAddFile()}>
			<div class="flex items-end">
				<Input bind:value={inputFileName} label={'Add file'} placeholder={'Enter a filename or path to the file. E.g. plugins/plugin.jar'} type={'text'} required={true} class={'grow'} />

				<button type="submit" class="p-2.5 ml-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 focus:ring-2 focus:ring-blue-700 dark:focus:ring-blue-500">
					<Icon data={mdiPlus} size={5} /> <span class="sr-only">Add File</span>
				</button>
			</div>
		</form>
		<form on:submit|preventDefault={() => handleAddFolder()}>
			<div class="flex items-end">
				<Input bind:value={inputFolderName} label={'Add folder'} placeholder={'Enter a foldername or path to the folder. E.g. plugins/example'} type={'text'} required={true} class={'grow'} />

				<button type="submit" class="p-2.5 ml-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 focus:ring-2 focus:ring-blue-700 dark:focus:ring-blue-500">
					<Icon data={mdiPlus} size={5} /> <span class="sr-only">Add Folder</span>
				</button>
			</div>
		</form>

		<div class="flex pt-3 mb-2 items-center">
			<p class="grow text-sm font-medium text-gray-900 dark:text-gray-400">Blocked Items</p>

			<form on:submit|preventDefault={() => handleClearItems()}>
				<button type="submit" class="text-sm font-medium text-red-500">Clear all items</button>
			</form>
		</div>
		<div class="rounded-xl px-3 py-2 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
			<ul>
				{#each [...(folderBlacklist?.sort() || []), ...(fileBlacklist?.sort() || [])] || [] as blockedItem}
					<li class="flex items-center p-1 rounded hover:bg-gray-100 hover:dark:bg-gray-700 text-gray-800 dark:text-white">
						<span class="grow">{blockedItem}</span>

						<form on:submit|preventDefault={() => handleDuplicateItem(blockedItem)}>
							<button type="submit" class="pt-1" aria-label="Duplicate item text"><Icon data={mdiContentDuplicate} size={4} class={'text-blue-500 mr-2'} /></button>
						</form>
						<form on:submit|preventDefault={() => handleRemoveItem(blockedItem)}>
							<button type="submit" class="pt-1" aria-label="Remove item"><Icon data={mdiClose} size={5} class={'text-red-500'} /></button>
						</form>
					</li>
				{:else}
					<li>
						{#if $isLoadingServers}
							<p class="text-center"><Spinner /></p>
						{:else}
							<p class="text-center">No blocked items.</p>
						{/if}
					</li>
				{/each}
			</ul>
		</div>
	</div>

	<svelte:fragment slot="footer">
		<div class="flex justify-end space-x-1 w-full">
			<Button disabled={areButtonsDisabled} on:click={handleDiscard} color="alternative">
				<Icon data={mdiArrowULeftTop} class="mr-2 -ml-1" /> Discard
			</Button>
			<Button disabled={areButtonsDisabled} on:click={handleSave} color="blue">
				<Icon data={mdiContentSave} class="mr-2 -ml-1" /> Save
			</Button>
		</div>
	</svelte:fragment>
</Modal>
