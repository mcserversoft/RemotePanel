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

/* Job */

export interface JobTask { }

export class CommandJobTask implements JobTask {
    commands: string[];

    constructor(commands: string[]) {
        this.commands = commands;
    }
}

export class BackupJobTask implements JobTask {
    backupId: string;

    constructor(backupId: string) {
        this.backupId = backupId;
    }
}

export class ServerActionJobTask implements JobTask {
    serverAction: string;

    constructor(serverAction: string) {
        this.serverAction = serverAction;
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
