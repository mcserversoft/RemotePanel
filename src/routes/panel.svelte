<script lang="ts" context="module">
    export const prerender = true;
</script>

<script type="ts">
    import { get } from "svelte/store";
    import { browser } from "$app/env";
    import { Router } from "$lib/Router.js";
    import { auth } from "$lib/store.js";
    import Header from "../layouts/header.svelte";
    import Sidebar from "../layouts/sidebar.svelte";

    let username = get(auth).username;

    if (browser) {
        console.log("browser");

        auth.subscribe((value) => {
            console.log("sub");

            if (!value.apiKey) {
                Router.redirectToLogin();
            }
        });
    }


</script>

<div class="flex h-screen overflow-hidden bg-zinc-800">
    <div>
        <Sidebar />
    </div>

    <div class=" flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header {username} />

        <main>
            <div class="px-4 sm:px-6 px-8 py-8 w-full max-w-9xl mx-auto">
                <div class=" bg-indigo-200 p-4 sm:p-6 rounded-sm overflow-hidden mb-8">
                    <div class="absolute right-0 top-0 -mt-4 mr-16 pointer-events-none hidden" aria-hidden="true">
                        <svg width="319" height="198" xmlns:xlink="http://www.w3.org/1999/xlink"
                            ><defs
                                ><path id="welcome-a" d="M64 0l64 128-64-20-64 20z" /><path id="welcome-e" d="M40 0l40 80-40-12.5L0 80z" /><path id="welcome-g" d="M40 0l40 80-40-12.5L0 80z" /><linearGradient
                                    x1="50%"
                                    y1="0%"
                                    x2="50%"
                                    y2="100%"
                                    id="welcome-b"><stop stop-color="#A5B4FC" offset="0%" /><stop stop-color="#818CF8" offset="100%" /></linearGradient
                                ><linearGradient x1="50%" y1="24.537%" x2="50%" y2="100%" id="welcome-c"><stop stop-color="#4338CA" offset="0%" /><stop stop-color="#6366F1" stop-opacity="0" offset="100%" /></linearGradient></defs
                            ><g fill="none" fill-rule="evenodd"
                                ><g transform="rotate(64 36.592 105.604)"
                                    ><mask id="welcome-d" fill="#fff"><use xlink:href="#welcome-a" /></mask><use fill="url(#welcome-b)" xlink:href="#welcome-a" /><path fill="url(#welcome-c)" mask="url(#welcome-d)" d="M64-24h80v152H64z" /></g
                                ><g transform="rotate(-51 91.324 -105.372)"
                                    ><mask id="welcome-f" fill="#fff"><use xlink:href="#welcome-e" /></mask><use fill="url(#welcome-b)" xlink:href="#welcome-e" /><path fill="url(#welcome-c)" mask="url(#welcome-f)" d="M40.333-15.147h50v95h-50z" /></g
                                ><g transform="rotate(44 61.546 392.623)"
                                    ><mask id="welcome-h" fill="#fff"><use xlink:href="#welcome-g" /></mask><use fill="url(#welcome-b)" xlink:href="#welcome-g" /><path fill="url(#welcome-c)" mask="url(#welcome-h)" d="M40.333-15.147h50v95h-50z" /></g
                                ></g
                            ></svg
                        >
                    </div>
                    <div>
                        <h1 class="text-2xl md:text-3xl text-slate-800 font-bold mb-1 capitalize">Good afternoon, {get(auth).username} 👋</h1>
                        <p>Here is what’s happening with your servers today</p>
                    </div>
                </div>


            </div>
        </main>
        <div class="fixed bottom-0 right-0 w-full md:bottom-8 md:right-12 md:w-auto z-60">
            <div class="bg-slate-800 text-slate-50 text-sm p-3 md:rounded shadow-lg flex justify-between">
                <div>👉 <a class="hover:underline" href="https://mcserversoft.com/discord" target="_blank" rel="noreferrer">Show your support and join our Discord server!</a></div>
                <button class="text-slate-500 hover:text-slate-400 ml-5"
                    ><span class="sr-only">Close</span><svg class="w-4 h-4 shrink-0 fill-current" viewBox="0 0 16 16"
                        ><path d="M12.72 3.293a1 1 0 00-1.415 0L8.012 6.586 4.72 3.293a1 1 0 00-1.414 1.414L6.598 8l-3.293 3.293a1 1 0 101.414 1.414l3.293-3.293 3.293 3.293a1 1 0 001.414-1.414L9.426 8l3.293-3.293a1 1 0 000-1.414z" /></svg
                    ></button
                >
            </div>
        </div>
    </div>
</div>
