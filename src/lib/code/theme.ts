import { get } from 'svelte/store';
import { settings } from './storage';
import { PanelTheme } from './panel';

export function getPanelTheme(): PanelTheme {
    const useSystemTheme = get(settings).panelTheme == PanelTheme.System;
    if (useSystemTheme) {
        return getThemeFromSystem();
    }

    return get(settings).panelTheme ?? PanelTheme.Light;
}

export function setPanelTheme(theme: PanelTheme) {
    settings.update(s => { s.panelTheme = theme; return s })
}

export function togglePanelTheme() {
    const currentTheme = getPanelTheme();
    setPanelTheme(currentTheme == PanelTheme.Dark ? PanelTheme.Light : PanelTheme.Dark);
}

function getThemeFromSystem(): PanelTheme {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? PanelTheme.Dark : PanelTheme.Light;
}