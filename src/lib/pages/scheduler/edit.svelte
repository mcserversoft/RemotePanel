<script lang="ts">
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { mdiArchive, mdiArrowULeftTop, mdiContentSave } from '@mdi/js';
	import Icon from '$lib/components/elements/icon.svelte';
	import PageTitleBanner from '$lib/components/page/pageTitleBanner.svelte';
	import Breadcrumb from '$lib/components/navigation/breadcrumb.svelte';
	import { Page, WarningType } from '../../../types';
	import { getServer, selectedServerId } from '$lib/code/global';
	import { navigateToPage, selectedPageProps } from '$lib/code/routing';
	import { Button, TabItem, Tabs } from 'flowbite-svelte';
	import BoxedContainer from '$lib/components/elements/boxedContainer.svelte';
	import Input from '$lib/components/elements/input.svelte';
	import { getSchedulerTaskDetails } from '$lib/code/api';
	import Warning from '$lib/components/elements/warning.svelte';
	import { Permission, hasPermission } from '$lib/code/permissions';
	import { jobOptions, type ISchedulerTask, timingOptions } from '$lib/code/scheduler';
	import TaskJobServerActionInput from '$lib/components/scheduler/taskJobServerActionInput.svelte';
	import TaskJobCommandsInput from '$lib/components/scheduler/taskJobCommandsInput.svelte';
	import TaskJobBackupInput from '$lib/components/scheduler/taskJobBackupInput.svelte';
	import TaskTimingIntervalInput from '$lib/components/scheduler/taskTimingIntervalInput.svelte';
	import TaskTimingFixedTimeInput from '$lib/components/scheduler/taskTimingFixedTimeInput.svelte';
	import TaskPlayerRequirementInput from '$lib/components/scheduler/taskPlayerRequirementInput.svelte';

	let taskId: string;
	let name: string = '';

	let originalName: string = '';
	let showError: boolean;
	let errorMessage: string;
	let areButtonsDisabled: boolean = true;

	onMount(async () => {
		load();
	});

	function load() {
		taskId = get(selectedPageProps) ?? '';
		getTask(taskId);
	}

	function getTask(taskId: string) {
		getSchedulerTaskDetails($selectedServerId, taskId, (wasSuccess: boolean, taskDetails: ISchedulerTask) => {
			if (!wasSuccess) {
				showError = true;
				errorMessage = 'Unable to load this page, does the task exist?';
			} else {
				name = taskDetails.name;
				// destination = taskDetails.destination;
				// suspendServer = taskDetails.suspend;
				// deleteOldBackups = taskDetails.deleteOldBackups;
				// compression = taskDetails.compression;
				// backupFilterList.fileBlacklist = taskDetails.fileBlacklist;
				// backupFilterList.folderBlacklist = taskDetails.folderBlacklist;
				originalName = taskDetails.name;
			}
		});
	}

	function updateTask() {
		// let updatedTask: ISchedulerTask = {
		// 	name: name,
		// 	// destination: destination,
		// 	// suspend: suspendServer,
		// 	// deleteOldBackups: deleteOldBackups,
		// 	// compression: compression,
		// 	// fileBlacklist: backupFilterList.fileBlacklist,
		// 	// folderBlacklist: backupFilterList.folderBlacklist
		// };
		// editSchedulerTask($selectedServerId, taskId, updatedTask, (wasSuccess: boolean) => {
		// 	if (wasSuccess) {
		// 		confirm(`Task: '${updatedTask.name}' was successfully edited.`);
		// 		navigateBack();
		// 	} else {
		// 		showError = true;
		// 		errorMessage = `Failed to save changes for task: '${updatedTask.name}'.`;
		// 	}
		// });
	}

	function handleTaskJobServerActionInput(event: any) {
		//	areButtonsDisabled = false;
		console.log(event.detail);
	}

	function handleTaskJobCommandsInput(event: any) {
		//	areButtonsDisabled = false;
		console.log(event.detail);
	}

	function handleTaskJobBackupInput(event: any) {
		//	areButtonsDisabled = false;
		console.log(event.detail);
	}
	function handleTaskTimingIntervalInput(event: any) {
		//	areButtonsDisabled = false;
		console.log(event.detail);
	}
	function handleTaskTimingFixedTimeInput(event: any) {
		//	areButtonsDisabled = false;
		console.log(event.detail);
	}
	function handleTaskPlayerRequirementInput(event: any) {
		//	areButtonsDisabled = false;
		console.log(event.detail);
	}

	function navigateBack() {
		navigateToPage(Page.Scheduler);
	}
</script>

<svelte:head>
	<title>MCSS Remote Panel | Edit Scheduler Task</title>
</svelte:head>

<section class="h-[calc(100vh-56px)] overflow-auto p-6 dark:bg-gray-900 dark:text-white">
	<Breadcrumb
		icon={mdiArchive}
		items={[
			{ name: 'Scheduler', page: Page.Scheduler, isClickable: true },
			{ name: 'Edit', page: Page.Empty, isClickable: false }
		]}
	/>

	<PageTitleBanner title="Edit Task" caption="You are modifying task: '{originalName}' from server: {getServer($selectedServerId)?.name ?? 'Unknown server.'}." />

	{#if hasPermission(Permission.viewSchedulerTasks, $selectedServerId)}
		{#if showError}
			<Warning message={errorMessage} />
		{/if}

		<form on:submit|preventDefault={updateTask}>
			<BoxedContainer class="space-y-3">
				<Input bind:value={name} label={'Name'} type={'string'} placeholder={'Task name'} required={true} />
			</BoxedContainer>
			<BoxedContainer class="space-y-3">
				<span class="space-y-1 text-sm font-medium">
					<p class="">Job</p>
					<p class="text-gray-400">Choose what this task should do.</p>
				</span>

				<Tabs style="full" defaultClass="flex rounded-lg divide-x rtl:divide-x-reverse divide-gray-200 shadow dark:divide-gray-700" contentClass="bg-inherit pt-2">
					<TabItem class="w-full" open>
						<span class="text-xs sm:text-sm" slot="title">{jobOptions[0].name}</span>
						<TaskJobServerActionInput on:update={handleTaskJobServerActionInput} />
					</TabItem>
					<TabItem class="w-full">
						<span class="text-xs sm:text-sm" slot="title">{jobOptions[1].name}</span>
						<TaskJobCommandsInput on:update={handleTaskJobCommandsInput} />
					</TabItem>
					<TabItem class="w-full">
						<span class="text-xs sm:text-sm" slot="title">{jobOptions[2].name}</span>
						<TaskJobBackupInput on:update={handleTaskJobBackupInput} />
					</TabItem>
				</Tabs>
			</BoxedContainer>
			<BoxedContainer class="space-y-3">
				<span class="space-y-1 text-sm font-medium">
					<p class="">Timing</p>
					<p class="text-gray-400">Choose when and how frequent this task should run.</p>
				</span>

				<Tabs style="full" defaultClass="flex rounded-lg divide-x rtl:divide-x-reverse divide-gray-200 shadow dark:divide-gray-700" contentClass="bg-inherit pt-2">
					<TabItem class="w-full">
						<span class="text-xs sm:text-sm" slot="title">{timingOptions[0].name}</span>
						<TaskTimingIntervalInput on:update={handleTaskTimingIntervalInput} />
					</TabItem>
					<TabItem class="w-full" open>
						<span class="text-xs sm:text-sm" slot="title">{timingOptions[1].name}</span>
						<TaskTimingFixedTimeInput on:update={handleTaskTimingFixedTimeInput} />
					</TabItem>
					<TabItem class="w-full">
						<span class="text-xs sm:text-sm" slot="title">{timingOptions[2].name}</span>
						<p class="text-sm text-gray-500 dark:text-gray-400 text-center">
							A <b>timeless</b> task has no timing options.
						</p>
					</TabItem>
				</Tabs>
			</BoxedContainer>

			<BoxedContainer class="space-y-3">
				<TaskPlayerRequirementInput on:update={handleTaskPlayerRequirementInput} />
			</BoxedContainer>

			<div class="flex space-x-3">
				<Button type="submit" color="blue">
					<Icon data={mdiContentSave} disabled={areButtonsDisabled} class="mr-2 -ml-1" />Save Task
				</Button>
				<Button type="button" on:click={navigateBack} color="alternative">
					<Icon data={mdiArrowULeftTop} disabled={areButtonsDisabled} class="mr-2 -ml-1" />Cancel
				</Button>
			</div>
		</form>
	{:else}
		<Warning message={`You are missing the following permissions, to view this page: ${Permission.viewSchedulerTasks}`} type={WarningType.Permission} />
	{/if}
</section>
