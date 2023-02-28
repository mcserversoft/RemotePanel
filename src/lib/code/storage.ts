import { persisted } from 'svelte-local-storage-store'

export const settings = persisted('settings', {
    serversRefreshRate: 5,
    consoleRefreshRate: 5,
    autoScrollConsole: true,
    amountOfConsoleLines: 50,
    reverseConsoleLines: false,
})

