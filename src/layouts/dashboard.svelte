<script lang="ts">
    import { get } from "svelte/store";
    import { browser } from "$app/env";
    import { auth, selectedServer } from "$lib/store.js";
    import { logout } from "$lib/common.js";

    let serverConsole: string[] = [];
    let textarea: HTMLTextAreaElement;

    export let username: string;

    // if (browser) {
    //     selectedServer.subscribe((newSelectedServer) => {
    //         loadConsole(newSelectedServer.guid);
    //     });
    // }

    // async function loadConsole(guid:string) {
    //      const request = new Request(`https://localhost:2096/api/v1/servers/${guid}/console?amountOfLines=50&reversed=false`, {
    //     //const request = new Request(`/api/v1/servers/${get(selectedServerGuid)}/console?amountOfLines=50&reversed=false`, {
    //         method: `GET`,
    //         headers: {
    //             apiKey: get(auth).apiKey,
    //         },
    //     });

    //     await fetch(request)
    //         .then((response) => {
    //             if (response.status === 200) {
    //                 return response.json();
    //             }
    //             return Promise.reject(response);
    //         })
    //         .then((data) => {
    //             console.log(data);

    //             serverConsole = data.join("\r\n");
    //             scrollToBottom();
    //         })
    //         .catch((error) => {
    //             if (error.status === 403) {
    //                 logout();
    //             }
    //         });
    // }
</script>

<div class="p-6 mb-8 rounded-md shadow-lg bg-zinc-700">
    <h1 class="text-2xl md:text-3xl font-bold mb-1 capitalize">Good Afternoon, {username} 👋</h1>
    <p>Here is what's happening with your servers today</p>
</div>
