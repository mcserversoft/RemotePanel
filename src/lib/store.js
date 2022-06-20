import { writable } from 'svelte-local-storage-store'

export const auth = writable('user', {
    apiKey: '',
    username: '',
})


export const selectedServer = writable('server', {
    guid: '',
    name: '',
})

// export const selectedServerGuid = writable('selectedServerGuid', '');
// export const selectedServerName = writable('selectedServerName', '');
export const showDiscordPopup = writable('showDiscordPopup', true);
