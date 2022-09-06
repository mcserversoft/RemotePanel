import { writable } from 'svelte-local-storage-store'

// used for testing purposes
export const baseUrl = writable('baseUrl', '')

export const isOffline = writable('offline', false)

export const auth = writable('user', {
    apiKey: '',
    username: ''
})

export const selectedServer = writable('server', {
    guid: '',
    name: '',
    status: 0
})

export const settings = writable('settings', {
    autoScrollConsole: true,
    amountOfConsoleLines: 50,
    reverseConsoleLines: false,
    showDiscordPopup: true
})
