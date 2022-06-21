<script lang="ts">
    import { get } from "svelte/store";
    import { browser } from "$app/env";
    import { auth, selectedServer } from "$lib/store.js";
    import { logout } from "$lib/common.js";

    let serverConsole: string[] = [];
    let consoleInput: string;
    let textarea: HTMLTextAreaElement;

    if (browser) {
        selectedServer.subscribe((newSelectedServer) => {
            loadConsole(newSelectedServer.guid);
        });
    }

    async function loadConsole(guid: string) {
        clearConsole();

        const request = new Request(`https://localhost:2096/api/v1/servers/${guid}/console?amountOfLines=50&reversed=false`, {
            //const request = new Request(`/api/v1/servers/${get(selectedServerGuid)}/console?amountOfLines=50&reversed=false`, {
            method: `GET`,
            headers: {
                apiKey: get(auth).apiKey,
            },
        });

        await fetch(request)
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                }
                return Promise.reject(response);
            })
            .then((data) => {
                console.log(data);

                serverConsole = data.join("\r\n");
                scrollToBottom();
            })
            .catch((error) => {
                if (error.status === 403) {
                    logout();
                }
            });
    }

    async function sendCommand() {
        if (!consoleInput) {
            return;
        }

        const request = new Request(`https://localhost:2096/api/v1/servers/${get(selectedServer).guid}/execute/command`, {
            //const request = new Request(`/api/v1/servers/${get(get(selectedServer).guid)}/execute/command`, {
            //const request = new Request(`/auth`, {
            method: `POST`,
            headers: {
                apiKey: get(auth).apiKey,
            },
            body: JSON.stringify({ command: consoleInput }),
        });

        await fetch(request)
            .then((response) => {
                if (response.status == 200) {
                    consoleInput = "";
                }
                return Promise.reject(response);
            })
            .catch((error) => {
                if (error.status === 403) {
                    logout();
                }
            });
    }

    function scrollToBottom() {
        //TODO fix

        console.log(textarea.scrollTop);
        console.log(textarea.scrollHeight);

        textarea.scrollTop = textarea.scrollHeight;
        // textarea.scrollIntoView();

        console.log(textarea.scrollTop);

        //  $("#serverConsole").scrollTop($("#serverConsole")[0].scrollHeight);
    }

    function clearConsole() {
        serverConsole = [];
    }
</script>

<div class="col-span-full xl:col-span-6 shadow-lg rounded-md bg-zinc-700">
    <div class="px-5 py-4">
        <h2 class="font-semibold text-gray-300">Console</h2>
    </div>

    <textarea bind:this={textarea} readonly class="w-full h-60 px-5 outline-none text-sm bg-inherit">{serverConsole}</textarea>

    <form on:submit|preventDefault={sendCommand}>
        <input bind:value={consoleInput} type="text" placeholder="Enter command e.g. /say hello" class="w-full px-5 pt-1 pb-3 outline-none bg-inherit" />
    </form>
</div>
