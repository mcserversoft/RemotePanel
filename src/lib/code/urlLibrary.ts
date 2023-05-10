export enum Url {
    Contribute = "https://mcserversoft.com/donate",
    Website = "https://mcserversoft.com",
    Documentation = "https://mcserversoft.com/documentation",
    DocumentationAdminApi = "https://docs.mcserversoft.com/API/admin",
    Support = "TODO",
}

export function getUrl(url: Url) {
    return url.toString();
}
