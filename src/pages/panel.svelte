<script type="ts">
    import { get } from "svelte/store";
    import { auth, settings, selectedServer } from "$lib/store.js";
    import Header from "../layouts/header.svelte";
    import Sidebar from "../layouts/sidebar.svelte";
    import Dashboard from "../layouts/dashboard.svelte";
    import CloseSvg from "../components/svgs/CloseSvg.svelte";
    import Server from "../layouts/server.svelte";

    let username = get(auth).username;

    function hideDiscordPopup() {
        $settings.showDiscordPopup = false;
    }
</script>

<svelte:head>
    <title>MCSS Remote Panel | Panel</title>
    <meta name="description" content="Remote Panel for MC Server Soft" />
</svelte:head>

<div class="bg-zinc-800">
    <Header {username} />

    <div class="flex flex-col md:flex-row">
        <Sidebar />

        <div class="md:px-8 sm:px-6 px-4 mt-8 w-full max-w-9xl mx-auto h-screen text-gray-300">
            {#if $selectedServer.guid}
                <Server />
            {:else}
                <!-- TODO dashboard -->
                <!-- <Dashboard {username} /> -->
            {/if}
        </div>

        {#if $settings.showDiscordPopup}
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
