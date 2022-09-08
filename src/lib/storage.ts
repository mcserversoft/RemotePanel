import { writable } from 'svelte-local-storage-store'

export const isOffline = writable('offline', false)

export const settings = writable('settings', {
    autoScrollConsole: true,
    amountOfConsoleLines: 50,
    reverseConsoleLines: false,
})

