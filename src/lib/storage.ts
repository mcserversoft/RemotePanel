import { writable } from 'svelte-local-storage-store'

export const settings = writable('settings', {
    autoScrollConsole: true,
    amountOfConsoleLines: 50,
    reverseConsoleLines: false,
})

