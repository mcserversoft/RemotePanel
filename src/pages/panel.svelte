<script type="ts">
    import { get } from "svelte/store";
    import { auth } from "$lib/store.js";
    import Header from "../layouts/header.svelte";
    import Sidebar from "../layouts/sidebar.svelte";
    import Console from "../layouts/console.svelte";

    let username = get(auth).username;
</script>

<svelte:head>
    <title>MCSS Remote Panel | Panel</title>
    <!-- <meta name="description" content="Svelte demo app" /> -->
</svelte:head>

<div class="flex h-screen overflow-hidden bg-zinc-800">
    <Sidebar />

    <div class=" flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header {username} />

        <div class="sm:px-6 px-8 py-8 w-full max-w-9xl mx-auto text-gray-300">
            <div class="p-4 sm:p-6 rounded-md mb-8 shadow-lg bg-zinc-700">
                <h1 class="text-2xl md:text-3xl font-bold mb-1 capitalize">Good Afternoon, {username} 👋</h1>
                <p>Here is what's happening with your servers today</p>
            </div>

            <h2 class="pb-3 text-xl">test</h2>
            <Console />
        </div>

        <div class="fixed bottom-0 right-0 w-full md:bottom-8 md:right-12 md:w-auto z-60">
            <div class="bg-zinc-500 text-slate-50 text-sm p-3 md:rounded shadow-lg flex justify-between">
                <div>👉 <a class="hover:underline" href="https://mcserversoft.com/discord" target="_blank" rel="noreferrer">Show your support and join our Discord server!</a></div>
                <button class="text-slate-50 hover:text-slate-400 ml-5">
                    <span class="sr-only">Close</span>
                    <svg class="w-4 h-4 shrink-0 fill-current" viewBox="0 0 16 16">
                        <path d="M12.72 3.293a1 1 0 00-1.415 0L8.012 6.586 4.72 3.293a1 1 0 00-1.414 1.414L6.598 8l-3.293 3.293a1 1 0 101.414 1.414l3.293-3.293 3.293 3.293a1 1 0 001.414-1.414L9.426 8l3.293-3.293a1 1 0 000-1.414z" />
                    </svg>
                </button>
            </div>
        </div>
    </div>
</div>
