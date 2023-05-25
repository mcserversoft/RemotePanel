import { persisted } from 'svelte-local-storage-store'
import { PanelTheme } from '../../types';

export const settings = persisted('settings', {
    serversRefreshRate: 5,
    consoleRefreshRate: 5,
    autoScrollConsole: true,
    chatModeConsole: false,
    amountOfConsoleLines: 50,
    reverseConsoleLines: false,
    panelTheme: PanelTheme.Light,
    useSystemTheme: false,
    debugging: false,
})

