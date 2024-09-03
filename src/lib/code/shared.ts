export function getShortDateSince(unixTimestamp: number) {
    //e.g. convert 1659359233 into August 2022
    const date = new Date(unixTimestamp * 1000);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long' };
    return date.toLocaleString(undefined, options);
}

// SOURCE https://svelte.dev/repl/0ace7a508bd843b798ae599940a91783?version=3.16.7
export function clickOutside(node: any): any {

    const handleClick = (event: any) => {
        if (node && !node.contains(event.target) && !event.defaultPrevented) {
            node.dispatchEvent(
                new CustomEvent('click_outside', node)
            )
        }
    }

    document.addEventListener('click', handleClick, true);

    return {
        destroy() {
            document.removeEventListener('click', handleClick, true);
        }
    }
}

export function getRandomPassword() {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-={}[]|:;"<>,.?/';
    let length = getNumberBetween(25, 35);
    let password = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }

    return password;
}

function getNumberBetween(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
}

export function doesContainsInvalidWindowsExplorerCharacters(input: string) {
    /*
     https://stackoverflow.com/questions/1976007/what-characters-are-forbidden-in-windows-and-linux-directory-names
    < (less than)
    > (greater than)
    : (colon - sometimes works, but is actually NTFS Alternate Data Streams)
    " (double quote)
    / (forward slash)
    \ (backslash)
    | (vertical bar or pipe)
    ? (question mark)
    * (asterisk)

    files/folders:
    CON, PRN, AUX, NUL 
    COM1, COM2, COM3, COM4, COM5, COM6, COM7, COM8, COM9
    LPT1, LPT2, LPT3, LPT4, LPT5, LPT6, LPT7, LPT8, LPT9

    we allow / \ for folder nesting
    */
    const specialCharsRegex = /[<>:"|?*]/;
    const reservedNamesRegex = /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i;

    return specialCharsRegex.test(input) || reservedNamesRegex.test(input);
}