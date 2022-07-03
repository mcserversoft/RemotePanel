<script lang="ts">
    import { get } from "svelte/store";
    import { auth, selectedServer } from "$lib/store.js";
    import { logout, clickOutside } from "$lib/common.js";
    import ArrowDownSvg from "./svgs/ArrowDownSvg.svelte";

    export let statusName: string;

    let actions: string[] = ["start", "stop", "restart", "kill"];
    let dropdownVisible: boolean = false;

    function toggleDropdown() {
        dropdownVisible = !dropdownVisible;
    }

    function handleClickOutside() {
        dropdownVisible = false;
    }

    async function sendAction(action: number) {
        console.log(action);
        dropdownVisible = false;

        if (get(selectedServer).guid === null) {
            return;
        }

        const request = new Request(`https://192.168.1.100:2096/api/v1/servers/${get(selectedServer).guid}/execute/action`, {
            method: `POST`,
            headers: {
                apiKey: get(auth).apiKey,
            },
            body: JSON.stringify({ action: action }),
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
            })
            .catch((error) => {
                if (error.status === 403) {
                    logout();
                }
            });
    }
</script>

<div class="relative inline-flex" use:clickOutside on:click_outside={handleClickOutside}>
    <button on:click={toggleDropdown} aria-controls="dropdown" aria-expanded={dropdownVisible} class="inline-flex justify-center items-center group p-2 rounded bg-blue-600 hover:bg-blue-700">
        <div class="flex items-center truncate text-zinc-200">
            <span class="truncate ml-2 text-xs font-medium uppercase">{statusName}</span>
            <ArrowDownSvg />
        </div>
    </button>

    {#if dropdownVisible}
        <div id="dropdown" class="absolute top-full right-0 min-w-44 py-1.5 -mt-2 rounded shadow-lg overflow-hidden bg-white ">
            <ul>
                {#each actions as action, index}
                    <li>
                        <!-- ++ because in the API 0 means invalid, so we start from 1 -->
                        <button on:click={() => sendAction(++index)} class="flex w-full py-1 px-3 font-medium text-sm capitalize text-gray-700 hover:bg-gray-100">{action}</button>
                    </li>
                {/each}
            </ul>
        </div>
    {/if}
</div>
