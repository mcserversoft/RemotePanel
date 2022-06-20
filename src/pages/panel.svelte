<script type="ts">
    import { get } from "svelte/store";
    import { auth, showDiscordPopup, selectedServer } from "$lib/store.js";
    import Header from "../layouts/header.svelte";
    import Sidebar from "../layouts/sidebar.svelte";
    import Console from "../layouts/console.svelte";
    import ActionDropdown from "../components/ActionDropdown.svelte";
    import CloseSvg from "../components/svgs/CloseSvg.svelte";

    let username = get(auth).username;

    function hideDiscordPopup() {
        showDiscordPopup.update((s) => false);
    }
</script>

<svelte:head>
    <title>MCSS Remote Panel | Panel</title>
    <!-- <meta name="description" content="Svelte demo app" /> -->
</svelte:head>

<div class="flex h-screen overflow-hidden bg-zinc-800">
    <Sidebar />

    <div class=" flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header {username} />

        <div class="sm:px-6 px-8 mt-8 w-full max-w-9xl mx-auto text-gray-300">
            <div class="p-4 sm:p-6 rounded-md mb-8 shadow-lg bg-zinc-700">
                <h1 class="text-2xl md:text-3xl font-bold mb-1 capitalize">Good Afternoon, {username} 👋</h1>
                <p>Here is what's happening with your servers today</p>
            </div>

            {#if $selectedServer.guid}
                <div class="flex my-8">
                    <div class="grow">
                        <h2 class="leading-relaxed align-middle text-xl truncate">{$selectedServer.name}</h2>
                    </div>

                    <ActionDropdown />
                </div>

                <Console />
            {/if}
        </div>

        {#if $showDiscordPopup}
            <div class="fixed bottom-0 right-0 w-full md:bottom-8 md:right-12 md:w-auto z-60">
                <div class="bg-zinc-500 text-slate-50 text-sm p-3 md:rounded shadow-lg flex justify-between">
                    <div>👉 <a class="hover:underline" href="https://mcserversoft.com/discord" target="_blank" rel="noreferrer">Show your support and join our Discord server!</a></div>
                    <button on:click={hideDiscordPopup} class="text-slate-50 hover:text-slate-400 ml-5">
                        <span class="sr-only">Close</span>
                        <CloseSvg />
                    </button>
                </div>
            </div>
        {/if}
    </div>
</div>
