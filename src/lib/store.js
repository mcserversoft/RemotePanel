import { writable } from 'svelte-local-storage-store'

export const auth = writable('user', {
  apiKey: '',
  username: '',
})
