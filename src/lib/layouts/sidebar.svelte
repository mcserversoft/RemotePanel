<script lang="ts">
    import { onDestroy } from "svelte";
    import { get } from "svelte/store";
    import { browser } from "$app/environment";
    import { auth, baseUrl, isOffline, selectedServer } from "$lib/store.js";
    import { logout, getGreeting, getFriendlyStatusName, getStatusColor } from "$lib/common.js";
    import ReloadSvg from "$lib/svgs/ReloadSvg.svelte";
    import DoubleCheveronDown from "$lib/svgs/DoubleCheveronDown.svelte";

    interface Server {
        guid: string;
        name: string;
        status: number;
    }

    enum Filter {
        None,
        Minimal,
        Status,
    }

    let servers: Server[];
    let loadingServers: boolean;
    let loadingMessage: string = "";
    let username: string = get(auth).username;
    let hideMenu: boolean;
    let popupMenu: boolean;

    if (browser) {
        const updateServerStatus = setInterval(() => {
            loadServers(Filter.Minimal);
        }, 10000);

        onDestroy(() => clearInterval(updateServerStatus));
    }

    hideMobileView();
    loadServers();

    // on mobile when there are no servers, show the menu
    //    if ($selectedServer.guid === "") {
    if (get(selectedServer).guid === "") {
        toggleMobileView();
    }

    async function loadServers(filter: Filter = Filter.None) {
        loadingServers = true;
        const request = new Request(`${get(baseUrl)}/api/v1/servers?filter=${filter}`, {
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
                servers = data;

                // update current server
                let foundSelectedServer = servers.find((s) => s.guid == $selectedServer.guid);
                if (foundSelectedServer) {
                    $selectedServer.name = foundSelectedServer.name;
                    $selectedServer.status = foundSelectedServer.status;
                }

                if (!data.any) {
                    loadingMessage = "No Servers";
                }
            })
            .catch((error) => {
                if (error.status === 401) {
                    logout();
                } else if (!error.status) {
                    $isOffline = true;
                }
                loadingMessage = "Failed to fetch servers";
            })
			.finally(() => {
				loadingServers = false;
			});
    }

    function reloadServers() {
        if (!loadingServers) {
            loadServers();
        }
    }

    function setSelectedServer(guid: string, name: string, status: number) {
        // incase a server is clicked on mobile
        hideMobileView();

        selectedServer.set({
            guid: guid,
            name: name,
            status: status,
        });
    }

    function toggleMobileView() {
        hideMenu = !hideMenu;
        popupMenu = !popupMenu;
    }
    function hideMobileView() {
        hideMenu = true;
        popupMenu = false;
    }
</script>

<section class="h-max md:w-96 w-max max-w-full overflow-hidden bg-zinc-900 text-white">
    <div on:click={toggleMobileView} class="flex md:hidden justify-center h-10 w-screen md:w-16 ">
        <DoubleCheveronDown className={popupMenu ? "rotate-180" : ""} />
    </div>

    <div class:hidden={hideMenu} class="md:pt-4 md:flex flex-col pt-5 h-screen overflow-y-auto md:w-64 w-screen md:px-4 sm:px-28 px-8 z-50 bg-inherit">
        <h3 class="text-xs uppercase text-slate-500 font-semibold pl-3">
            <span class="text-center w-6">{getGreeting()}, {username} 👋</span>
        </h3>
        <ul class="mt-3">
            <!-- TODO dashboard -->
            <!-- <li class="px-3 py-2 rounded-sm mb-0.5 last:mb-0">
            <button on:click={loadMainDashboard} class=" text-slate-200 hover:text-white" href="/">
                <div class="flex items-center">
                    <svg class="shrink-0 h-6 w-6" viewBox="0 0 24 24">
                        <path class="fill-current text-slate-500" d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0z" />
                        <path class="fill-current text-slate-600 " d="M12 3c-4.963 0-9 4.037-9 9s4.037 9 9 9 9-4.037 9-9-4.037-9-9-9z" />
                        <path class="fill-current text-slate-400 " d="M12 15c-1.654 0-3-1.346-3-3 0-.462.113-.894.3-1.285L6 6l4.714 3.301A2.973 2.973 0 0112 9c1.654 0 3 1.346 3 3s-1.346 3-3 3z" />
                    </svg>
                    <span class="text-sm font-medium ml-3">Dashboard</span>
                </div>
            </button>
        </li> -->

            <li class="px-3 py-2 rounded-sm mb-0.5 last:mb-0">
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <svg class="shrink-0 h-6 w-6" viewBox="0 0 24 24">
                            <path class="fill-current text-slate-400" d="M13 15l11-7L11.504.136a1 1 0 00-1.019.007L0 7l13 8z" />
                            <path class="fill-current text-slate-700" d="M13 15L0 7v9c0 .355.189.685.496.864L13 24v-9z" />
                            <path class="fill-current text-slate-600" d="M13 15.047V24l10.573-7.181A.999.999 0 0024 16V8l-11 7.047z" />
                        </svg>
                        <span class="text-sm font-medium ml-3 cursor-default">Servers</span>
                    </div>
                    <div class="flex shrink-0 ml-2">
                        <button on:click={reloadServers} disabled={loadingServers} class="disabled:text-slate-700 text-slate-400">
                            <ReloadSvg className={loadingServers ? "animate-spin" : ""} />
                        </button>
                    </div>
                </div>

                <ul class="pl-9 mt-1 truncate">
                    {#each servers || [] as { guid, name, status }}
                        <li class="mb-1 last:mb-0">
                            <button on:click={() => setSelectedServer(guid, name, status)} class=" text-slate-400 hover:text-slate-200">
                                <span class="inline-flex rounded-full h-2 w-2 {getStatusColor(status)}" title={getFriendlyStatusName(status)} /> <span class="text-sm font-medium">{name}</span>
                            </button>
                        </li>
                    {:else}
                        <li class="mb-1 last:mb-0">
                            <span class="text-sm font-medium italic text-slate-400">{loadingMessage}</span>
                        </li>
                    {/each}
                </ul>
            </li>
        </ul>
    </div>
</section>
