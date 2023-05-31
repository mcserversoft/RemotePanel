export enum Url {
    Contribute = "https://mcserversoft.com/donate",
    Website = "https://mcserversoft.com",
    Documentation = "https://mcserversoft.com/documentation",
    DocumentationPanel = "https://docs.mcserversoft.com/webpanel/getting-started",
    DocumentationAdminApi = "https://docs.mcserversoft.com/API/admin"
}

export function getUrl(url: Url) {
    return url.toString();
}
