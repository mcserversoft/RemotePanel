<script lang="ts">
    import { onDestroy } from "svelte";
    import { get } from "svelte/store";
    import { browser } from "$app/env";
    import { auth, selectedServer } from "$lib/store.js";
    import { logout } from "$lib/common.js";
    import ReloadSvg from "../components/svgs/ReloadSvg.svelte";

    let loadingConsole: boolean;
    let serverConsole: string[] = [];
    let consoleInput: string;
    let textarea: HTMLTextAreaElement;

    if (browser) {
        const unsubscribe = selectedServer.subscribe((newSelectedServer) => {
            reloadConsole();
        });

        const updateConsole = setInterval(() => {
            updateConsoleIfNeeded();
        }, 5000);

        onDestroy(unsubscribe);
        onDestroy(() => clearInterval(updateConsole));
    }

    async function reloadConsole() {
        if (!$selectedServer.guid) {
            return;
        }

        clearConsole();
        loadingConsole = true;

        const request = new Request(`https://192.168.1.100:2096/api/v1/servers/${$selectedServer.guid}/console?amountOfLines=50&reversed=false`, {
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
                serverConsole = data.join("\r\n");
                scrollToBottom();
            })
            .catch((error) => {
                if (error.status === 403) {
                    logout();
                }
            });
        loadingConsole = false;
    }

    async function updateConsoleIfNeeded() {
        if (!$selectedServer.guid) {
            return;
        }

        loadingConsole = true;

        let lines = textarea.value.split("\n");
        let length: number = lines.length - 1;

        let secondLastLine: string = encodeURIComponent(lines[length - 1]);
        let lastLine: string = encodeURIComponent(lines[length]);

        const request = new Request(`https://192.168.1.100:2096/api/v1/servers/${$selectedServer.guid}/console/outdated?secondLastLine=${secondLastLine}&reversed=${lastLine}`, {
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

                if (data) {
                    reloadConsole();
                }
                scrollToBottom();
            })
            .catch((error) => {
                if (error.status === 403) {
                    logout();
                }
            });
        loadingConsole = false;
    }

    async function sendCommand() {
        if (!consoleInput) {
            return;
        }

        const request = new Request(`https://192.168.1.100:2096/api/v1/servers/${get(selectedServer).guid}/execute/command`, {
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
    <div class="flex px-5 py-4">
        <h2 class="font-semibold text-gray-300">Console</h2>
        <div class="inline-flex ml-2 ">
            <button on:click={reloadConsole} disabled={loadingConsole} class="disabled:text-zinc-800 text-slate-400">
                <ReloadSvg className={loadingConsole ? "animate-spin" : ""} />
            </button>
        </div>
    </div>

    <textarea bind:this={textarea} readonly class="w-full h-96 md:px-5 px-2 outline-none md:text-sm text-xs bg-inherit">{serverConsole}</textarea>

    <form on:submit|preventDefault={sendCommand}>
        <input bind:value={consoleInput} type="text" placeholder="Enter command e.g. /say hello" class="w-full px-5 pt-1 pb-3 outline-none bg-inherit" />
    </form>
</div>
