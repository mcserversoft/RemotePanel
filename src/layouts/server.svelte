<script lang="ts">
    import { onDestroy } from "svelte";
    import { get } from "svelte/store";
    import { browser } from "$app/env";
    import { auth, isOffline, selectedServer } from "$lib/store.js";
    import { logout, getFriendlyStatusName, getStatusColor } from "$lib/common.js";
    import Console from "../layouts/console.svelte";
    import ActionDropdown from "../components/actionDropdown.svelte";

    interface Server {
        guid: string;
        status: number;
    }

    enum Filter {
        None,
        Minimal,
        Status,
    }

    let server: Server = {
        guid: "",
        status: 0,
    };

    if (browser) {
        const unsubscribe = selectedServer.subscribe((newSelectedServer) => {
            loadServer(newSelectedServer.guid);
        });

        onDestroy(unsubscribe);
    }

    async function loadServer(guid: string, filter: Filter = Filter.None) {
        const request = new Request(`/api/v1/servers/${guid}?filter=${filter}`, {
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
                server = data;
                console.log(server);
            })
            .catch((error) => {
                if (error.status === 403) {
                    logout();
                } else if (!error.status) {
                    $isOffline = true;
                }
            });
    }
</script>

<div class="flex mb-8">
    <div class="grow">
        <h2 class="leading-relaxed align-middle text-xl max-w-lg truncate"><span class="inline-flex rounded-full h-3 w-3  {getStatusColor($selectedServer.status)}" title={getFriendlyStatusName($selectedServer.status)} /> {$selectedServer.name}</h2>
    </div>

    <ActionDropdown statusName={getFriendlyStatusName($selectedServer.status)} />
</div>

<Console />
