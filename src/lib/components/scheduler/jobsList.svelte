<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { isLoadingServers } from '$lib/code/global';
	import { mdiArrowULeftTop, mdiClose, mdiContentSave, mdiDelete, mdiPlus, mdiPencil, mdiChevronDoubleDown, mdiChevronDoubleUp, mdiTimerPlus, mdiChevronDownBoxOutline, mdiChevronRight, mdiChevronDown } from '@mdi/js';
	import { Button, ButtonGroup, Dropdown, DropdownItem, Label, Modal, Select } from 'flowbite-svelte';
	import Icon from '../elements/icon.svelte';
	import Spinner from '../elements/spinner.svelte';
	import { BackupJobTask, CommandJobTask, ServerActionJobTask, type JobTask, jobOptions, EmptyJobTask, SchedulerServerAction, DelayJobTask, CmdJobTask, PowerShellJobTask } from '$lib/code/scheduler';
	import TaskJobServerActionInput from './taskJobServerActionInput.svelte';
	import TaskJobCommandsInput from './taskJobCommandsInput.svelte';
	import TaskJobBackupInput from './taskJobBackupInput.svelte';
	import TaskDelayInput from './taskDelayInput.svelte';
	import { Guid } from 'guid-ts';
	import TaskJobCmdInput from './taskJobCmdInput.svelte';
	import TaskJobPowerShellInput from './taskJobPowerShellInput.svelte';

	export let jobs: Array<JobTask> = [];

	let areModalButtonsDisabled: boolean = true;
	let showCreateJobModal: boolean = false;
	let jobToCreateOrEdit: JobTask = new EmptyJobTask();
	let isCreatingJob: boolean = true;

	let jobOption: number;

	let taskJobServerActionInput: ServerActionJobTask = new ServerActionJobTask(undefined!, true, 0, undefined!);
	let taskJobCommandsInput: CommandJobTask = new CommandJobTask(undefined!, true, 0, []);
	let taskJobBackupInput: BackupJobTask = new BackupJobTask(undefined!, true, 0, '');
	let taskJobDelayInput: DelayJobTask = new DelayJobTask(undefined!, true, 0, 0);
	let taskJobCmdCommandInput: CmdJobTask = new CmdJobTask(undefined!, true, 0, '', true);
	let taskJobPowerShellCommandInput: PowerShellJobTask = new PowerShellJobTask(undefined!, true, 0, '', true);

	const dispatch = createEventDispatcher();

	function handleInputChange() {
		dispatch('update', jobs);
	}

	function loadModalData(isCreate: boolean) {
		if (isCreate) {
			taskJobServerActionInput = new ServerActionJobTask(undefined!, true, 0, undefined!);
			taskJobCommandsInput = new CommandJobTask(undefined!, true, 0, []);
			taskJobBackupInput = new BackupJobTask(undefined!, true, 0, '');
			taskJobDelayInput = new DelayJobTask(undefined!, true, 0, 0);
			taskJobCmdCommandInput = new CmdJobTask(undefined!, true, 0, '', true);
			taskJobPowerShellCommandInput = new PowerShellJobTask(undefined!, true, 0, '', true);
		} else {
			jobOption = -1;
			if (jobToCreateOrEdit instanceof ServerActionJobTask) {
				taskJobServerActionInput = jobToCreateOrEdit;
			} else if (jobToCreateOrEdit instanceof CommandJobTask) {
				taskJobCommandsInput = jobToCreateOrEdit;
			} else if (jobToCreateOrEdit instanceof BackupJobTask) {
				taskJobBackupInput = jobToCreateOrEdit;
			} else if (jobToCreateOrEdit instanceof DelayJobTask) {
				taskJobDelayInput = jobToCreateOrEdit;
			} else if (jobToCreateOrEdit instanceof CmdJobTask) {
				taskJobCmdCommandInput = jobToCreateOrEdit;
			} else if (jobToCreateOrEdit instanceof PowerShellJobTask) {
				taskJobPowerShellCommandInput = jobToCreateOrEdit;
			}
		}
	}

	function handleClearItems() {
		jobs = [];
		areModalButtonsDisabled = false;
		handleInputChange();
	}

	function handleSaveEditJob() {
		jobs = jobs.map((job) => {
			if (job.jobId === jobToCreateOrEdit.jobId) {
				return jobToCreateOrEdit;
			}
			return job;
		});

		showCreateJobModal = false;
		handleInputChange();
	}

	function handleSaveAddJob() {
		if (jobToCreateOrEdit instanceof ServerActionJobTask) {
			jobs.push(new ServerActionJobTask(jobToCreateOrEdit.jobId, jobToCreateOrEdit.enabled, jobs.length, jobToCreateOrEdit.action));
		} else if (jobToCreateOrEdit instanceof CommandJobTask) {
			jobs.push(new CommandJobTask(jobToCreateOrEdit.jobId, jobToCreateOrEdit.enabled, jobs.length, jobToCreateOrEdit.commands));
		} else if (jobToCreateOrEdit instanceof BackupJobTask) {
			jobs.push(new BackupJobTask(jobToCreateOrEdit.jobId, jobToCreateOrEdit.enabled, jobs.length, jobToCreateOrEdit.backupIdentifier));
		} else if (jobToCreateOrEdit instanceof DelayJobTask) {
			jobs.push(new DelayJobTask(jobToCreateOrEdit.jobId, jobToCreateOrEdit.enabled, jobs.length, jobToCreateOrEdit.delay));
		} else if (jobToCreateOrEdit instanceof CmdJobTask) {
			jobs.push(new CmdJobTask(jobToCreateOrEdit.jobId, jobToCreateOrEdit.enabled, jobs.length, jobToCreateOrEdit.command, jobToCreateOrEdit.hideWindow));
		} else if (jobToCreateOrEdit instanceof PowerShellJobTask) {
			jobs.push(new PowerShellJobTask(jobToCreateOrEdit.jobId, jobToCreateOrEdit.enabled, jobs.length, jobToCreateOrEdit.shellCommand, jobToCreateOrEdit.hideWindow));
		}

		showCreateJobModal = false;
		handleInputChange();
	}

	function handleMoveJobDown(task: JobTask) {
		const index = jobs.indexOf(task);
		if (index < jobs.length - 1) {
			jobs[index].order = index + 1;
			jobs[index + 1].order = index;
			const temp = jobs[index];
			jobs[index] = jobs[index + 1];
			jobs[index + 1] = temp;
		}
		handleInputChange();
	}

	function handleMoveJobUp(task: JobTask) {
		const index = jobs.indexOf(task);
		if (index > 0) {
			jobs[index].order = index - 1;
			jobs[index - 1].order = index;
			const temp = jobs[index];
			jobs[index] = jobs[index - 1];
			jobs[index - 1] = temp;
		}
		handleInputChange();
	}

	function handleRemoveJob(task: JobTask) {
		jobs = jobs.filter((job) => job !== task);
		handleInputChange();
	}

	function handleEditJob(task: JobTask) {
		jobToCreateOrEdit = task;
		handleShowCreateJobModal(false);
	}

	function handleDiscard() {
		showCreateJobModal = false;
	}

	function handleShowCreateJobModal(isCreate: boolean) {
		loadModalData(isCreate);
		isCreatingJob = isCreate;
		showCreateJobModal = true;
	}

	function handleTaskJobServerActionInput(event: any) {
		jobToCreateOrEdit = new ServerActionJobTask(event.detail.id, event.detail.enabled, event.detail.order, event.detail.action);
		areModalButtonsDisabled = false;
	}

	function handleTaskJobCommandsInput(event: any) {
		jobToCreateOrEdit = new CommandJobTask(event.detail.id, event.detail.enabled, event.detail.order, event.detail.commands);
		areModalButtonsDisabled = false;
	}

	function handleTaskJobBackupInput(event: any) {
		jobToCreateOrEdit = new BackupJobTask(event.detail.id, event.detail.enabled, event.detail.order, event.detail.backupIdentifier);
		areModalButtonsDisabled = false;
	}

	function handleDelayTaskInput(event: any) {
		jobToCreateOrEdit = new DelayJobTask(event.detail.id, event.detail.enabled, event.detail.order, event.detail.delay);
		areModalButtonsDisabled = event.detail.delay > 0 && event.detail.delay <= 600 ? false : true;
	}

	function handleTaskJobCmdInput(event: any) {
		jobToCreateOrEdit = new CmdJobTask(event.detail.id, event.detail.enabled, event.detail.order, event.detail.command, event.detail.hideWindow);
		areModalButtonsDisabled = false;
	}
	function handleTaskJobPowerShellInput(event: any) {
		jobToCreateOrEdit = new PowerShellJobTask(event.detail.id, event.detail.enabled, event.detail.order, event.detail.shellCommand, event.detail.hideWindow);
		areModalButtonsDisabled = false;
	}
</script>

<div class="flex space-x-2 items-center">
	<span class="grow text-sm font-medium">
		<p class="">Jobs</p>
		<p class="text-gray-400">Jobs are executed one at a time and in order.</p>
	</span>

	<form on:submit|preventDefault={() => handleShowCreateJobModal(true)}>
		<ButtonGroup>
			<Button color="blue" type="submit" on:click={() => ((jobOption = 0), (jobToCreateOrEdit = new EmptyJobTask()))}>
				<Icon data={mdiPlus} class="-mx-2 m-0.5" />
				<span class="hidden lg:block ml-3">Add Job</span>
			</Button>
			<Button color="blue" class={'!bg-blue-700'}>
				<Icon data={mdiChevronDown} class={'-mr-2'} />
			</Button>
			<Dropdown>
				<DropdownItem type="submit" on:click={() => ((jobOption = 0), (jobToCreateOrEdit = new EmptyJobTask()))}>+ {jobOptions[0].name}</DropdownItem>
				<DropdownItem type="submit" on:click={() => ((jobOption = 1), (jobToCreateOrEdit = new EmptyJobTask()))}>+ {jobOptions[1].name}</DropdownItem>
				<DropdownItem type="submit" on:click={() => ((jobOption = 2), (jobToCreateOrEdit = new EmptyJobTask()))}>+ {jobOptions[2].name}</DropdownItem>
				<DropdownItem type="submit" on:click={() => ((jobOption = 3), (jobToCreateOrEdit = new EmptyJobTask()))}>+ {jobOptions[3].name}</DropdownItem>
				<DropdownItem type="submit" on:click={() => ((jobOption = 4), (jobToCreateOrEdit = new EmptyJobTask()))}>+ {jobOptions[4].name}</DropdownItem>
			</Dropdown>
		</ButtonGroup>
	</form>
	<form on:submit|preventDefault={() => handleShowCreateJobModal(true)}>
		<Button type="submit" on:click={() => (jobToCreateOrEdit = new DelayJobTask(Guid.empty(), true, 0, 0))} color="blue">
			<Icon data={mdiTimerPlus} class="-mx-2" />
			<span class="hidden lg:block ml-3">Add Delay</span>
		</Button>
	</form>
	<form on:submit|preventDefault={() => handleClearItems()}>
		<Button type="submit" color="red">
			<Icon data={mdiDelete} class="-mx-2" />
			<span class="hidden lg:block ml-3">Delete all</span>
		</Button>
	</form>
</div>

<div class="rounded-xl px-3 py-2 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
	<ul>
		{#each jobs.sort((j) => j.order) || [] as job}
			<li class="flex items-center p-1 rounded hover:bg-gray-100 hover:dark:bg-gray-700 text-gray-800 dark:text-white">
				{#if job instanceof ServerActionJobTask}
					<span class="grow"> {SchedulerServerAction[job.action]} server</span>
				{:else if job instanceof CommandJobTask}
					<span class="grow">Run {job.commands.length} command{job.commands.length > 1 ? 's' : ''}: <span class="italic text-gray-400">{job.commands.join(' - ')}</span></span>
				{:else if job instanceof BackupJobTask}
					<span class="grow">Start backup</span>
				{:else if job instanceof DelayJobTask}
					<span class="grow">Delay {job.delay} seconds</span>
				{:else if job instanceof CmdJobTask}
					<span class="grow">Run a CMD command</span>
				{:else if job instanceof PowerShellJobTask}
					<span class="grow">Run a PowerShell command</span>
				{:else}
					<span class="grow">Unknown Job</span>
				{/if}

				<form on:submit|preventDefault={() => handleMoveJobDown(job)} class={jobs.length <= 1 ? 'hidden' : 'block'}>
					<button type="submit" class="pt-1" aria-label="Move job down"><Icon data={mdiChevronDoubleDown} size={5} class={'text-yellow-500'} /></button>
				</form>
				<form on:submit|preventDefault={() => handleMoveJobUp(job)} class={jobs.length <= 1 ? 'hidden' : 'block'}>
					<button type="submit" class="pt-1 mr-6" aria-label="Move job up"><Icon data={mdiChevronDoubleUp} size={5} class={'text-yellow-500'} /></button>
				</form>
				<form on:submit|preventDefault={() => handleEditJob(job)}>
					<button type="submit" class="pt-1 mr-2" aria-label="Edit job"><Icon data={mdiPencil} size={5} class={'text-blue-500'} /></button>
				</form>
				<form on:submit|preventDefault={() => handleRemoveJob(job)}>
					<button type="submit" class="pt-1" aria-label="Remove job"><Icon data={mdiClose} size={5} class={'text-red-500'} /></button>
				</form>
			</li>
		{:else}
			<li>
				{#if $isLoadingServers}
					<p class="text-center"><Spinner /></p>
				{:else}
					<p class="text-center">No Jobs added yet.</p>
				{/if}
			</li>
		{/each}
	</ul>
</div>

<Modal bind:open={showCreateJobModal} title="{jobOption < 0 ? 'Edit' : 'Add'} a {jobToCreateOrEdit instanceof DelayJobTask ? 'Delay' : 'Job'}" class="overflow-hidden my-0 sm:my-20">
	{#if jobToCreateOrEdit instanceof DelayJobTask}
		<TaskDelayInput job={taskJobDelayInput} on:update={handleDelayTaskInput} />
	{:else}
		{#if jobOption != -1}
			<Label>
				Job
				<Select items={jobOptions} bind:value={jobOption} required={true} class="mt-2" placeholder={jobOptions[0].name} />
			</Label>
		{/if}

		{#key jobOption}
			{#if jobOption == 0 || jobToCreateOrEdit instanceof ServerActionJobTask}
				<TaskJobServerActionInput job={taskJobServerActionInput} on:update={handleTaskJobServerActionInput} />
			{:else if jobOption == 1 || jobToCreateOrEdit instanceof CommandJobTask}
				<TaskJobCommandsInput job={taskJobCommandsInput} on:update={handleTaskJobCommandsInput} />
			{:else if jobOption == 2 || jobToCreateOrEdit instanceof BackupJobTask}
				<TaskJobBackupInput job={taskJobBackupInput} on:update={handleTaskJobBackupInput} />
			{:else if jobOption == 3 || jobToCreateOrEdit instanceof CmdJobTask}
				<TaskJobCmdInput job={taskJobCmdCommandInput} on:update={handleTaskJobCmdInput} />
			{:else if jobOption == 4 || jobToCreateOrEdit instanceof PowerShellJobTask}
				<TaskJobPowerShellInput job={taskJobPowerShellCommandInput} on:update={handleTaskJobPowerShellInput} />
			{/if}
		{/key}
	{/if}

	<svelte:fragment slot="footer">
		<div class="flex justify-end space-x-1 w-full">
			<Button disabled={areModalButtonsDisabled} on:click={handleDiscard} color="alternative">
				<Icon data={mdiArrowULeftTop} class="mr-2 -ml-1" /> Discard
			</Button>
			<Button disabled={areModalButtonsDisabled} on:click={isCreatingJob ? handleSaveAddJob : handleSaveEditJob} color="blue">
				<Icon data={mdiContentSave} class="mr-2 -ml-1" /> Save
			</Button>
		</div>
	</svelte:fragment>
</Modal>
