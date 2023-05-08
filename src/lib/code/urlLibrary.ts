export enum Url {
    Contribute = "https://mcserversoft.com/donate",
    Website = "https://mcserversoft.com",
    Documentation = "https://mcserversoft.com/documentation",
    Support = "TODO"
}

export function getUrl(url: Url) {
    return url.toString();
}
