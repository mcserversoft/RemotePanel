import { writable } from 'svelte-local-storage-store'

export const settings = writable('settings', {
    serversRefreshRate: 5,
    consoleRefreshRate: 5,
    autoScrollConsole: true,
    amountOfConsoleLines: 50,
    reverseConsoleLines: false,
})

