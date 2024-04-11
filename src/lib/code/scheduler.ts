import { mdiCheck, mdiClose, mdiMinus } from "@mdi/js";

export const jobOptions = [
    { value: 0, name: 'Server Action' },
    { value: 1, name: 'Run Commands' },
    { value: 2, name: 'Start Backup' }
];

export const timingOptions = [
    { value: 0, name: 'Interval' },
    { value: 1, name: 'Time' },
    { value: 2, name: 'Timeless' }
];

export interface ISchedulerDetails {
    tasks: number;
    interval: number;
    fixedTime: number;
    timeless: number;
}

export interface ISchedulerTask {
    taskId: string;
    name: string;
    enabled: boolean;
    playerRequirement: number;
    timing: TaskTiming;
    job: JobTask;
}

export interface INewSchedulerTask {
    name: string;
    enabled: boolean;
    playerRequirement: number;
    timing: TaskTiming;
    job: JobTask;
}

export interface IEditSchedulerTask extends INewSchedulerTask { }

export function getTaskEnabledIcon(task: ISchedulerTask): string {
    if (task == undefined) {
        return mdiClose;
    }

    if (task.timing instanceof TimelessTaskTiming) {
        return mdiMinus;
    }

    return task.enabled ? mdiCheck : mdiClose;
}

export function getTaskEnabledIconColor(task: ISchedulerTask): string {
    if (task == undefined) {
        return '';
    }

    if (task.timing instanceof TimelessTaskTiming) {
        return '';
    }

    return task.enabled ? 'text-green-400' : 'text-red-400';
}

/* API */
export function translateRawSchedulerResponse(data: any): ISchedulerTask {
    let task: ISchedulerTask = {
        taskId: data.taskId,
        enabled: data.enabled,
        name: data.name,
        playerRequirement: data.playerRequirement,
        timing: new TimelessTaskTiming(),
        job: new EmptyJobTask()
    }

    if ('interval' in data.timing) {
        task.timing = new IntervalTaskTiming(data.timing.repeat, data.timing.interval);
    } else if ('time' in data.timing) {
        task.timing = new FixedTimeTaskTiming(data.timing.repeat, data.timing.time);
    } else {
        task.timing = new TimelessTaskTiming();
    }

    if ('commands' in data.job) {
        task.job = new CommandJobTask(data.job.commands as string[]);
    } else if ('backupIdentifier' in data.job) {
        task.job = new BackupJobTask(data.job.backupIdentifier as string);
    } else if ('action' in data.job) {
        task.job = new ServerActionJobTask(data.job.action as number);
    } else {
        task.job = new EmptyJobTask();
    }

    return task;
}

/* Job */
export interface JobTask { }

export class CommandJobTask implements JobTask {
    commands: string[];

    constructor(commands: string[]) {
        this.commands = commands;
    }
}

export class BackupJobTask implements JobTask {
    BackupIdentifier: string;

    constructor(BackupIdentifier: string) {
        this.BackupIdentifier = BackupIdentifier;
    }
}

export class ServerActionJobTask implements JobTask {
    action: number;

    constructor(action: number) {
        this.action = action;
    }
}

export class EmptyJobTask implements JobTask { }

export enum Job {
    empty = "Empty Job",
    backup = "Backup",
    commands = "Command",
    serverAction = "Server Action",
}

export function getTaskJob(job: JobTask): Job {
    if (job == undefined) {
        return Job.empty;
    }

    if (job instanceof BackupJobTask) {
        return Job.backup;
    } else if (job instanceof CommandJobTask) {
        return Job.commands;
    } else if (job instanceof ServerActionJobTask) {
        return Job.serverAction;
    }

    return Job.empty;
}

/* Timing */
export interface TaskTiming { }

export class FixedTimeTaskTiming implements TaskTiming {
    repeat: boolean;
    time: string;

    constructor(repeat: boolean, time: string) {
        this.repeat = repeat;
        this.time = time;
    }
}

export class IntervalTaskTiming implements TaskTiming {
    repeat: boolean;
    interval: number;

    constructor(repeat: boolean, interval: number) {
        this.repeat = repeat;
        this.interval = interval;
    }
}

export class TimelessTaskTiming implements TaskTiming { }

export enum Timing {
    timeless = "Timeless",
    fixedTime = "Fixed Time",
    interval = "Interval",
}

export function getTaskTiming(timing: TaskTiming): Timing {
    if (timing == undefined) {
        return Timing.timeless;
    }

    if (timing instanceof FixedTimeTaskTiming) {
        return Timing.fixedTime;
    } else if (timing instanceof IntervalTaskTiming) {
        return Timing.interval;
    }

    return Timing.timeless;
}
