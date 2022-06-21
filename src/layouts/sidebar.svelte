<script lang="ts">
    import { get } from "svelte/store";
    import { auth, selectedServer } from "$lib/store.js";
    import { logout } from "$lib/common.js";
    import ReloadSvg from "../components/svgs/ReloadSvg.svelte";

    interface Server {
        guid: string;
        name: string;
    }

    let servers: Server[];
    let loadingServers: boolean;
    let loadingMessage: string = "";

    loadServers();

    async function loadServers() {
        loadingServers = true;
        const request = new Request(`https://localhost:2096/api/v1/servers`, {
            //const request = new Request(`/api/v1/servers`, {
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

                if (data.any) {
                    loadingMessage = "No Servers";
                }
            })
            .catch((error) => {
                if (error.status === 403) {
                    logout();
                }
            });
        loadingServers = false;
    }

    function reloadServers() {
        if (!loadingServers) {
            loadServers();
        }
    }

    function loadMainDashboard() {
        selectedServer.set({
            guid: "",
            name: "",
        });
    }

    function setSelectedServer(guid: string, name: string) {
        selectedServer.set({
            guid: guid,
            name: name,
        });
    }
</script>

<section id="sidebar" class="flex flex-col h-screen overflow-y-auto w-64 p-4 bg-zinc-900 text-white">
    <div class="flex justify-between mb-10 pr-3 sm:px-2">
        <button on:click={loadMainDashboard}>
            <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2134 2134" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2">
                <path d="M770.279 1681.329l-352.14-616.921 352.14-616.911h704.28l352.14 616.911-352.14 616.921h-704.28z" fill="#1f2e35" fill-rule="nonzero" />
                <g transform="matrix(4.3501 0 0 4.3501 -19.0235 -48.5561)">
                    <clipPath id="A">
                        <path
                            d="M248.557 499C227.84 499 45.461 390.228 38.113 377.5c-9.221-15.971-7.618-229.806 0-243C48.362 116.748 227.84 13.001 248.557 13.001c23.778 0 198.65 101.074 210.443 121.5 12.659 21.927 9.549 226.46 0 242.999C449.509 393.938 267.961 499 248.557 499z"
                        />
                    </clipPath>
                    <g clip-path="url(#A)" fill-rule="nonzero">
                        <path d="M248.557 500.149l85.54-134.09H163.02" fill="#266b59" />
                        <path d="M551.4 471.049l-302.843 29.1 149.67-271.715" fill="#7ca740" />
                        <path d="M248.557 499l-296.124-35.82 157.25-228.302" fill="#0a3b3a" />
                        <path d="M195.683 116.49l-219.971 23.838L-9.701 456.7l205.384-340.21z" fill="#0c6f50" />
                        <path d="M38.112 134.65L212.145-37.97l122.952 172.62" fill="#95c83d" />
                        <path d="M652.44 30.301L459 377.5 248.557 12.001" fill="#abd037" />
                    </g>
                </g>
            </svg>
        </button>
    </div>
    <h3 class="text-xs uppercase text-slate-500 font-semibold pl-3">
        <span class="text-center w-6">Pages</span>
    </h3>
    <ul class="mt-3">
        <li class="px-3 py-2 rounded-sm mb-0.5 last:mb-0">
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
        </li>

        <li class="px-3 py-2 rounded-sm mb-0.5 last:mb-0 false">
            <div class="flex items-center justify-between">
                <div class="flex items-center">
                    <svg class="shrink-0 h-6 w-6" viewBox="0 0 24 24">
                        <path class="fill-current text-slate-400 false" d="M13 15l11-7L11.504.136a1 1 0 00-1.019.007L0 7l13 8z" />
                        <path class="fill-current text-slate-700 false" d="M13 15L0 7v9c0 .355.189.685.496.864L13 24v-9z" />
                        <path class="fill-current text-slate-600 false" d="M13 15.047V24l10.573-7.181A.999.999 0 0024 16V8l-11 7.047z" />
                    </svg>
                    <span class="text-sm font-medium ml-3 cursor-default">Servers</span>
                </div>
                <div class="flex shrink-0 ml-2">
                    <button on:click={reloadServers} disabled={loadingServers} class="disabled:text-slate-700 text-slate-400">
                        <ReloadSvg />
                    </button>
                </div>
            </div>

            <ul class="pl-9 mt-1 truncate">
                {#each servers || [] as { guid, name }}
                    <li class="mb-1 last:mb-0">
                        <button on:click={() => setSelectedServer(guid, name)} class=" text-slate-400 hover:text-slate-200">
                            <span class="text-sm font-medium">{name}</span>
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
</section>
