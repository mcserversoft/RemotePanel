import type { Url } from "./urlLibrary";

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

export function getGreeting() {
    var currentHour = new Date().getHours();

    if (currentHour < 12) {
        return "good morning";
    } else if (currentHour >= 5 && currentHour < 18) {
        return "good afternoon";
    } else if (currentHour >= 18 && currentHour <= 22) {
        return "good evening";
    } else {
        return "hi";
    }
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