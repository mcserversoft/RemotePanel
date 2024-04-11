export interface Stats {
    cpu: number;
    memory: Memory;
    playersOnline: number;
    playerLimit: number;
    startDateUnix: number;
    startDate: string;
    uptime: string;
}

export interface Memory {
    current: number;
    max: number;
    free: number;
}

/* Helper Methods */
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