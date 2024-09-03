import { mdiArchiveSync, mdiCheckCircle, mdiCircleOutline, mdiCloseCircle, mdiHelpCircle } from "@mdi/js";

export interface Backup {
    backupId: string;
    name: string;
    destination: string;
    suspend: boolean;
    deleteOldBackups: boolean;
    compression: BackupCompression;
    lastStatus: BackupStatus;
    fileBlacklist: string[];
    folderBlacklist: string[];
    completedAt: Date;
}

export interface IBackupStats {
    scheduled: number;
    completed: number;
    canceled: number;
    failed: number;
}

export interface IBackupDetails {
    backupId: string;
    name: string;
    destination: string;
    suspend: boolean;
    deleteOldBackups: boolean;
    compression: BackupCompression;
    lastStatus: BackupStatus;
    completedAt: Date;
    fileBlacklist: string[];
    folderBlacklist: string[];
}

export interface INewBackup {
    name: string;
    destination: string;
    suspend: boolean;
    deleteOldBackups: boolean;
    compression: BackupCompression;
    runBackupAfterCreation: boolean;
    fileBlacklist: string[];
    folderBlacklist: string[];
}

export interface IEditBackup extends Omit<INewBackup, 'runBackupAfterCreation'> { }

export interface BackupHistory {
    destination: string;
    lastRun: Date;
    logMessage: string;
    name: string;
    status: BackupStatus;
}

export enum BackupCompression {
    High,
    Low,
    None
}

export enum BackupStatus {
    NeverRun,
    InProgress,
    Completed,
    Failed,
    Canceled
}

export class BackupFilterListDetails {
    fileBlacklist: string[] = [];
    folderBlacklist: string[] = [];

    init(fileBlacklist: string[], folderBlacklist: string[]) {
        this.fileBlacklist = fileBlacklist;
        this.folderBlacklist = folderBlacklist;
    }

    update(fileBlacklist: string[], folderBlacklist: string[]) {
        this.fileBlacklist = fileBlacklist
        this.folderBlacklist = folderBlacklist
    }

    getCount() {
        let count = this.fileBlacklist?.length + this.folderBlacklist?.length;
        if (!count) {
            return 0;
        }

        return count;
    }
}

/* API */
export interface ICreateBackupRequest {
    name: string;
    destination: string;
    suspend: boolean;
    deleteOldBackups: boolean;
    compression: BackupCompression;
    runBackupAfterCreation: boolean;
    fileBlacklist: any;
    folderBlacklist: any;
}

/* Helper Methods */
export function getBackupStatusIcon(status: BackupStatus) {
    switch (status) {
        case BackupStatus.InProgress:
            return mdiArchiveSync;

        case BackupStatus.NeverRun:
            return mdiCircleOutline;

        case BackupStatus.Completed:
            return mdiCheckCircle;

        case BackupStatus.Failed:
        case BackupStatus.Canceled:
            return mdiCloseCircle;

        default:
            return mdiHelpCircle;
    }
}

export function getBackupStatusColor(status: BackupStatus) {
    switch (status) {
        // case BackupStatus.InProgress:
        // case BackupStatus.NeverRun:

        case BackupStatus.Completed:
            return 'text-green-400';

        case BackupStatus.Failed:
        case BackupStatus.Canceled:
            return 'text-red-400';

        default:
            return 'text-inherit';
    }
}

export function getBackupStatusName(status: BackupStatus) {
    return BackupStatus[status]
}