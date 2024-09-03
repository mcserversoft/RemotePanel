import { mdiCheck, mdiClose, mdiMinus } from "@mdi/js";
import { Guid } from 'guid-ts';


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

// not the same as ServerAction, this starts from 0
export enum SchedulerServerAction {
    Stop = 0,
    Start = 1,
    Kill = 2,
    Restart = 3
}

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
    jobs: JobTask[];
}

export interface INewSchedulerTask {
    name: string;
    enabled: boolean;
    playerRequirement: number;
    timing: TaskTiming;
    jobs: JobTask[];
}

export interface IEditSchedulerTask extends INewSchedulerTask { }

/* Job */
export interface JobTask {
    jobId: Guid;
    enabled: boolean;
    order: number;
}

export class CommandJobTask implements JobTask {
    jobId: Guid;
    enabled: boolean;
    order: number;
    commands: string[];

    constructor(id: Guid, enabled: boolean, order: number, commands: string[]) {
        this.jobId = id;
        this.enabled = enabled;
        this.order = order;
        this.commands = commands;
    }
}

export class BackupJobTask implements JobTask {
    jobId: Guid;
    enabled: boolean;
    order: number;
    backupIdentifier: string;

    constructor(id: Guid, enabled: boolean, order: number, backupIdentifier: string) {
        this.jobId = id;
        this.enabled = enabled;
        this.order = order;
        this.backupIdentifier = backupIdentifier;
    }
}

export class ServerActionJobTask implements JobTask {
    jobId: Guid;
    enabled: boolean;
    order: number;
    action: number;

    constructor(id: Guid, enabled: boolean, order: number, action: number) {
        this.jobId = id;
        this.enabled = enabled;
        this.order = order;
        this.action = action;
    }
}

export class DelayJobTask implements JobTask {
    jobId: Guid;
    enabled: boolean;
    order: number;
    delay: number;

    constructor(id: Guid, enabled: boolean, order: number, delay: number) {
        this.jobId = id;
        this.enabled = enabled;
        this.order = order;
        this.delay = delay;
    }
}

export class EmptyJobTask implements JobTask {
    jobId: Guid;
    enabled: boolean;
    order: number;

    constructor() {
        this.jobId = Guid.empty();
        this.enabled = false;
        this.order = undefined!;
    }
    // constructor(id: string, enabled: boolean, order: number) {
    //     this.id = id;
    //     this.enabled = enabled;
    //     this.order = order;
    // }
}

export enum Job {
    empty = "Empty Job",
    backup = "Backup",
    commands = "Command",
    serverAction = "Server Action",
    delay = "Delay",
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
    } else if (job instanceof DelayJobTask) {
        return Job.delay;
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


/* API */
export interface ICreateSchedulerTaskRequest {
    name: string;
    enabled: boolean;
    playerRequirement: number
    timing: object
    jobs: object[]
}

export interface IUpdateSchedulerTaskRequest extends ICreateSchedulerTaskRequest { }

export function translateRawSchedulerResponse(data: any): ISchedulerTask {
    let task: ISchedulerTask = {
        taskId: data.taskId,
        enabled: data.enabled,
        name: data.name,
        playerRequirement: data.playerRequirement,
        timing: new TimelessTaskTiming(),
        jobs: new Array()
    }

    if ('interval' in data.timing) {
        task.timing = new IntervalTaskTiming(data.timing.repeat, data.timing.interval);
    } else if ('time' in data.timing) {
        task.timing = new FixedTimeTaskTiming(data.timing.repeat, data.timing.time);
    } else {
        task.timing = new TimelessTaskTiming();
    }


    for (let job of data.jobs) {
        if ('commands' in job) {
            task.jobs.push(new CommandJobTask(job.guid, job.enabled, job.order, job.commands as string[]));
        } else if ('backupIdentifier' in job) {
            task.jobs.push(new BackupJobTask(job.guid, job.enabled, job.order, job.backupIdentifier as string));
        } else if ('action' in job) {
            task.jobs.push(new ServerActionJobTask(job.guid, job.enabled, job.order, job.action as number));
        } else if ('delay' in job) {
            task.jobs.push(new DelayJobTask(job.guid, job.enabled, job.order, job.delay as number));
        } else {
            task.jobs.push(new EmptyJobTask());
        }
    }

    return task;
}

/* Helper Methods */
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