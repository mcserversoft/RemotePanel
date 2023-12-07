<script lang="ts">
	import { onMount } from 'svelte';
	import { mdiArchive, mdiArchivePlus, mdiArrowULeftTop } from '@mdi/js';
	import Icon from '$lib/components/elements/icon.svelte';
	import PageTitleBanner from '$lib/components/page/pageTitleBanner.svelte';
	import Breadcrumb from '$lib/components/navigation/breadcrumb.svelte';
	import { Page, WarningType } from '../../../types';
	import { getServer, selectedServerId } from '$lib/code/global';
	import { createSchedulerTask } from '$lib/code/api';
	import { navigateToPage } from '$lib/code/routing';
	import Input from '$lib/components/elements/input.svelte';
	import { Button } from 'flowbite-svelte';
	import BoxedContainer from '$lib/components/elements/boxedContainer.svelte';
	import { Permission, hasPermission } from '$lib/code/permissions';
	import Warning from '$lib/components/elements/warning.svelte';
	import { Tabs, TabItem } from 'flowbite-svelte';
	import TaskJobCommandsInput from '$lib/components/scheduler/taskJobCommandsInput.svelte';
	import TaskJobBackupInput from '$lib/components/scheduler/taskJobBackupInput.svelte';
	import TaskJobServerActionInput from '$lib/components/scheduler/taskJobServerActionInput.svelte';
	import TaskTimingIntervalInput from '$lib/components/scheduler/taskTimingIntervalInput.svelte';
	import TaskTimingFixedTimeInput from '$lib/components/scheduler/taskTimingFixedTimeInput.svelte';
	import TaskPlayerRequirementInput from '$lib/components/scheduler/taskPlayerRequirementInput.svelte';
	import { jobOptions, timingOptions } from '$lib/code/scheduler';

	let name: string = '';
	const tabItemStyle = 'inline-block text-sm font-medium text-center disabled:cursor-not-allowed p-4 w-full group-first:rounded-l-lg group-last:rounded-r-lg text-white bg-blue-500 focus:ring-4 focus:ring-primary-300 focus:outline-none dark:bg-blue-700 dark:text-white';

	onMount(async () => {
		load();
	});

	function load() {
		// getMcssSettings(
		// 	McssSettingsSection.Backups,
		// 	(data: any) => {
		// 		deleteOldBackupsThresholdSetting = data.deleteOldBackupsThreshold;
		// 	},
		// 	(wasSuccess: boolean) => {
		// 		if (!wasSuccess) {
		// 			deleteOldBackupsThresholdSetting = '? (unable to load)';
		// 		}
		// 	}
		// );
	}

	function createNewScheduledTask() {
		// let newTask: INewBackup = {
		// 	name: name,
		// 	destination: destination,
		// 	suspend: suspendServer,
		// 	deleteOldBackups: deleteOldBackups,
		// 	compression: timing,
		// 	runBackupAfterCreation: backupNow,
		// 	fileBlacklist: backupFilterList.fileBlacklist,
		// 	folderBlacklist: backupFilterList.folderBlacklist
		// };
		// createSchedulerTask($selectedServerId, newTask, (wasSuccess: boolean) => {
		// 	if (wasSuccess) {
		// 		confirm(`Task: '${newTask.name}' was successfully created.`);
		// 		navigateBack();
		// 	} else {
		// 		confirm(`Failed to create task: '${newTask.name}'.`);
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
	<title>MCSS Remote Panel | Create Scheduler Task</title>
</svelte:head>

<section class="h-[calc(100vh-56px)] overflow-auto p-6 dark:bg-gray-900 dark:text-white">
	<Breadcrumb
		icon={mdiArchive}
		items={[
			{ name: 'Scheduler', page: Page.Scheduler, isClickable: true },
			{ name: 'Create', page: Page.Empty, isClickable: false }
		]}
	/>

	<PageTitleBanner title="Create Task" caption="Create a new task for server: {getServer($selectedServerId)?.name ?? 'Unknown server.'}." />

	{#if hasPermission(Permission.createSchedulerTask, $selectedServerId)}
		<form on:submit|preventDefault={createNewScheduledTask}>
			<BoxedContainer class="space-y-3">
				<Input bind:value={name} label={'Name'} type={'string'} placeholder={'Task name'} required={true} />
			</BoxedContainer>
			<BoxedContainer class="space-y-3">
				<span class="space-y-1 text-sm font-medium">
					<p class="">Job</p>
					<p class="text-gray-400">Choose what this task should do.</p>
				</span>

				<Tabs style="full" defaultClass="flex rounded-lg divide-x rtl:divide-x-reverse divide-gray-200 shadow dark:divide-gray-700" contentClass="bg-inherit pt-2">
					<TabItem class="w-full" activeClasses={tabItemStyle} open>
						<span class="text-xs sm:text-sm" slot="title">{jobOptions[0].name}</span>
						<TaskJobServerActionInput job={undefined} on:update={handleTaskJobServerActionInput} />
					</TabItem>
					<TabItem class="w-full" activeClasses={tabItemStyle}>
						<span class="text-xs sm:text-sm" slot="title">{jobOptions[1].name}</span>
						<TaskJobCommandsInput job={undefined} on:update={handleTaskJobCommandsInput} />
					</TabItem>
					<TabItem class="w-full" activeClasses={tabItemStyle}>
						<span class="text-xs sm:text-sm" slot="title">{jobOptions[2].name}</span>
						<TaskJobBackupInput job={undefined} on:update={handleTaskJobBackupInput} />
					</TabItem>
				</Tabs>
			</BoxedContainer>
			<BoxedContainer class="space-y-3">
				<span class="space-y-1 text-sm font-medium">
					<p class="">Timing</p>
					<p class="text-gray-400">Choose when and how frequent this task should run.</p>
				</span>

				<Tabs style="full" defaultClass="flex rounded-lg divide-x rtl:divide-x-reverse divide-gray-200 shadow dark:divide-gray-700" contentClass="bg-inherit pt-2">
					<TabItem class="w-full" activeClasses={tabItemStyle} open>
						<span class="text-xs sm:text-sm" slot="title">{timingOptions[0].name}</span>
						<TaskTimingIntervalInput timing={undefined} on:update={handleTaskTimingIntervalInput} />
					</TabItem>
					<TabItem class="w-full" activeClasses={tabItemStyle}>
						<span class="text-xs sm:text-sm" slot="title">{timingOptions[1].name}</span>
						<TaskTimingFixedTimeInput timing={undefined} on:update={handleTaskTimingFixedTimeInput} />
					</TabItem>
					<TabItem class="w-full" activeClasses={tabItemStyle}>
						<span class="text-xs sm:text-sm" slot="title">{timingOptions[2].name}</span>
						<p class="text-sm text-gray-500 dark:text-gray-400 text-center">
							A <b>timeless</b> task has no timing options.
						</p>
					</TabItem>
				</Tabs>
			</BoxedContainer>

			<BoxedContainer class="space-y-3">
				<TaskPlayerRequirementInput playerRequirement="0" on:update={handleTaskPlayerRequirementInput} />
			</BoxedContainer>

			<div class="flex space-x-3">
				<Button type="submit" color="blue">
					<Icon data={mdiArchivePlus} class="mr-2 -ml-1" />Create Task
				</Button>
				<Button type="button" on:click={navigateBack} color="alternative">
					<Icon data={mdiArrowULeftTop} class="mr-2 -ml-1" />Cancel
				</Button>
			</div>
		</form>
	{:else}
		<Warning message={`You are missing the following permissions, to view this page: ${Permission.createSchedulerTask}`} type={WarningType.Permission} />
	{/if}
</section>
