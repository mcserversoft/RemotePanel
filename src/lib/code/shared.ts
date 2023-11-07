import { mdiArchiveSync, mdiCircleOutline, mdiCheckCircle, mdiHelpCircle, mdiCloseCircle } from "@mdi/js";
import { BackupStatus } from "../../types";

export function getFriendlyStatusName(status: number = 0) {
    if (status === 0) {
        return "Offline";
    } else if (status === 1) {
        return "Online";
    } else if (status === 2) {
        return "Restarting";
    } else if (status === 3) {
        return "Starting";
    } else if (status === 4) {
        return "Stopping";
    } else {
        return "";
    }
}

export function getStatusBgColor(status: number = 0) {
    if (status === 0) {
        return "bg-red-500 ";
    } else if (status === 1) {
        return "bg-green-500";
    } else if (status === 2) {
        return "bg-orange-500";
    } else if (status === 3) {
        return "bg-green-500 ";
    } else if (status === 4) {
        return "bg-red-500";
    } else {
        return "bg-gray-500";
    }
}

export function getStatusTextColor(status: number = 0) {
    if (status === 0) {
        return "text-red-500";
    } else if (status === 1) {
        return "text-green-500";
    } else if (status === 2) {
        return "text-orange-500";
    } else if (status === 3) {
        return "text-green-500";
    } else if (status === 4) {
        return "text-red-500";
    } else {
        return "text-gray-500";
    }
}

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

export function getGreeting() {
    var currentHour = new Date().getHours();

    if (currentHour < 12) {
        return "morning";
    } else if (currentHour >= 5 && currentHour < 18) {
        return "afternoon";
    } else if (currentHour >= 18 && currentHour <= 22) {
        return "evening";
    } else {
        return "hi";
    }
}

export function getShortDateSince(unixTimestamp: number) {
    //e.g. convert 1659359233 into August 2022
    const date = new Date(unixTimestamp * 1000);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long' };
    return date.toLocaleString(undefined, options);
}

export function calculateUptime(startUnixTimestamp: number): string {
    if (startUnixTimestamp <= 0) {
        return 'offline';
    }

    let diff = Date.now() - Number(new Date(startUnixTimestamp * 1000));

    let days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= days * (1000 * 60 * 60 * 24);

    let hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * (1000 * 60 * 60);

    let minutes = Math.floor(diff / (1000 * 60));
    diff -= minutes * (1000 * 60);

    if (days > 0) {
        return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
        return `${hours}h ${minutes}m`;
    } else {
        let seconds = Math.floor(diff / 1000);
        return `${minutes}m ${seconds}s`;
    }
}

// SOURCE https://svelte.dev/repl/0ace7a508bd843b798ae599940a91783?version=3.16.7
export function clickOutside(node: any): any {

    const handleClick = (event: any) => {
        if (node && !node.contains(event.target) && !event.defaultPrevented) {
            node.dispatchEvent(
                new CustomEvent('click_outside', node)
            )
        }
    }

    document.addEventListener('click', handleClick, true);

    return {
        destroy() {
            document.removeEventListener('click', handleClick, true);
        }
    }
}

export function openInNewTab(url: string) {
    window.open(url, "_blank", "noopener noreferrer")
}

export function getRandomPassword() {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-={}[]|:;"<>,.?/';
    let length = getNumberBetween(25, 35);
    let password = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }

    return password;
}

function getNumberBetween(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
}