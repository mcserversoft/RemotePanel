import { selectedPage } from '$lib/storage';

export enum Page {
    Servers,
    Dashboard,
}

export function navigateToPage(pageName: Page) {
    selectedPage.set({
        pageName: pageName,
    });
}
