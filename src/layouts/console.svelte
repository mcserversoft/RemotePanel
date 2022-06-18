<script lang="ts">
    import { get } from "svelte/store";
    import { auth } from "$lib/store.js";
    import { selectedServerGuid } from "$lib/store.js";
    import { logout } from "$lib/common.js";

    let serverConsole: string[] = [];

    loadConsole();

    async function loadConsole() {
        // clearConsole();

        const request = new Request(`https://localhost:2096/api/v1/servers/${get(selectedServerGuid)}/console?amountOfLines=50&reversed=false`, {
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
                //  scrollToBottom();
            })
            .catch((error) => {
                if (error.status === 403) {
                    logout();
                }
            });
    }

    async function sendCommand() {}
</script>

<div class="col-span-full xl:col-span-6 shadow-lg rounded-md bg-zinc-700">
    <div class="px-5 py-4">
        <h2 class="font-semibold text-gray-300">Console</h2>
    </div>

    <textarea readonly class="w-full h-60 px-5 outline-none text-sm bg-inherit">{serverConsole}</textarea>

    <form on:submit={sendCommand}>
        <input id="consoleInput" type="text" placeholder="Enter command e.g. /say hello" class="w-full px-5 pt-1 pb-3 outline-none bg-inherit" />
    </form>
</div>
