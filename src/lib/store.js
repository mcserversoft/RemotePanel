import { writable } from 'svelte-local-storage-store'

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
