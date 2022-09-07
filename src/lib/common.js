import { auth } from "$lib/storage";

export function logout() {
    auth.set({
        apiKey: '',
        username: '',
    });
}

export function getFriendlyStatusName(status) {
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

export function getStatusBgColor(status) {
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

export function getStatusTextColor(status) {
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

// SOURCE https://svelte.dev/repl/0ace7a508bd843b798ae599940a91783?version=3.16.7
export function clickOutside(node) {

    const handleClick = event => {
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