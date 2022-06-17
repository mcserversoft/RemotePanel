<script lang="ts">
    import { get } from "svelte/store";
    import { auth } from "$lib/store.js";
    import { selectedServerGuid } from "$lib/store.js";

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
                console.log(response);

                if (response.status === 200) {
                    return response.json();
                }
                throw new Error("Not properly authenticated");
            })
            .then((data) => {
                console.log(data);
                serverConsole = data.join("\r\n");
                //  scrollToBottom();
            })
            .catch((error) => {
                console.error(error);
            });
    }
</script>

<div class="col-span-full xl:col-span-6 shadow-lg rounded-md bg-zinc-700">
    <div class="px-5 py-4">
        <h2 class="font-semibold text-gray-300">Console</h2>
    </div>

    <textarea readonly class="w-full h-60 px-5 outline-none text-sm bg-inherit">{serverConsole}</textarea>
</div>

<div class="ui inverted segments">
    <div class="ui segment" />
    <div class="ui segment">
        <form action="#" onsubmit="sendCommand(); return false;">
            <div class="ui left icon fluid input">
                <input id="consoleInput" type="text" placeholder="Enter command e.g. /say hello" />
                <i class="terminal icon" />
            </div>
        </form>
    </div>
</div>
