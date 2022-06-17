<script type="ts">
    import { get } from "svelte/store";
    import { auth } from "$lib/store.js";
    import Header from "../layouts/header.svelte";
    import Sidebar from "../layouts/sidebar.svelte";

    let username = get(auth).username;
</script>

<svelte:head>
    <title>MCSS Remote Panel | Panel</title>
    <!-- <meta name="description" content="Svelte demo app" /> -->
</svelte:head>

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

                <div class="grid grid-cols-12 gap-6">
                    <div class="col-span-full xl:col-span-6 bg-white shadow-lg rounded-sm border border-slate-200">
                        <header class="px-5 py-4 border-b border-slate-100"><h2 class="font-semibold text-slate-800">Recent Activity</h2></header>
                        <div class="p-3">
                            <div>
                                <header class="text-xs uppercase text-slate-400 bg-slate-50 rounded-sm font-semibold p-2">Today</header>
                                <ul class="my-1">
                                    <li class="flex px-2">
                                        <div class="w-9 h-9 rounded-full shrink-0 bg-indigo-500 my-2 mr-3">
                                            <svg class="w-9 h-9 fill-current text-indigo-50" viewBox="0 0 36 36"
                                                ><path d="M18 10c-4.4 0-8 3.1-8 7s3.6 7 8 7h.6l5.4 2v-4.4c1.2-1.2 2-2.8 2-4.6 0-3.9-3.6-7-8-7zm4 10.8v2.3L18.9 22H18c-3.3 0-6-2.2-6-5s2.7-5 6-5 6 2.2 6 5c0 2.2-2 3.8-2 3.8z" /></svg
                                            >
                                        </div>
                                        <div class="grow flex items-center border-b border-slate-100 text-sm py-2">
                                            <div class="grow flex justify-between">
                                                <div class="self-center"><a class="font-medium text-slate-800 hover:text-slate-900" href="#0">Nick Mark</a> mentioned <a class="font-medium text-slate-800" href="#0">Sara Smith</a> in a new post</div>
                                                <div class="shrink-0 self-end ml-2"><a class="font-medium text-indigo-500 hover:text-indigo-600" href="#0">View<span class="hidden sm:inline"> -&gt;</span></a></div>
                                            </div>
                                        </div>
                                    </li>
                                    <li class="flex px-2">
                                        <div class="w-9 h-9 rounded-full shrink-0 bg-rose-500 my-2 mr-3">
                                            <svg class="w-9 h-9 fill-current text-rose-50" viewBox="0 0 36 36"><path d="M25 24H11a1 1 0 01-1-1v-5h2v4h12v-4h2v5a1 1 0 01-1 1zM14 13h8v2h-8z" /></svg>
                                        </div>
                                        <div class="grow flex items-center border-b border-slate-100 text-sm py-2">
                                            <div class="grow flex justify-between">
                                                <div class="self-center">The post <a class="font-medium text-slate-800" href="#0">Post Name</a> was removed by <a class="font-medium text-slate-800 hover:text-slate-900" href="#0">Nick Mark</a></div>
                                                <div class="shrink-0 self-end ml-2"><a class="font-medium text-indigo-500 hover:text-indigo-600" href="#0">View<span class="hidden sm:inline"> -&gt;</span></a></div>
                                            </div>
                                        </div>
                                    </li>
                                    <li class="flex px-2">
                                        <div class="w-9 h-9 rounded-full shrink-0 bg-green-500 my-2 mr-3">
                                            <svg class="w-9 h-9 fill-current text-green-50" viewBox="0 0 36 36"><path d="M15 13v-3l-5 4 5 4v-3h8a1 1 0 000-2h-8zM21 21h-8a1 1 0 000 2h8v3l5-4-5-4v3z" /></svg>
                                        </div>
                                        <div class="grow flex items-center text-sm py-2">
                                            <div class="grow flex justify-between">
                                                <div class="self-center"><a class="font-medium text-slate-800 hover:text-slate-900" href="#0">Patrick Sullivan</a> published a new <a class="font-medium text-slate-800" href="#0">post</a></div>
                                                <div class="shrink-0 self-end ml-2"><a class="font-medium text-indigo-500 hover:text-indigo-600" href="#0">View<span class="hidden sm:inline"> -&gt;</span></a></div>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <header class="text-xs uppercase text-slate-400 bg-slate-50 rounded-sm font-semibold p-2">Yesterday</header>
                                <ul class="my-1">
                                    <li class="flex px-2">
                                        <div class="w-9 h-9 rounded-full shrink-0 bg-sky-500 my-2 mr-3">
                                            <svg class="w-9 h-9 fill-current text-sky-50" viewBox="0 0 36 36"
                                                ><path
                                                    d="M23 11v2.085c-2.841.401-4.41 2.462-5.8 4.315-1.449 1.932-2.7 3.6-5.2 3.6h-1v2h1c3.5 0 5.253-2.338 6.8-4.4 1.449-1.932 2.7-3.6 5.2-3.6h3l-4-4zM15.406 16.455c.066-.087.125-.162.194-.254.314-.419.656-.872 1.033-1.33C15.475 13.802 14.038 13 12 13h-1v2h1c1.471 0 2.505.586 3.406 1.455zM24 21c-1.471 0-2.505-.586-3.406-1.455-.066.087-.125.162-.194.254-.316.422-.656.873-1.028 1.328.959.878 2.108 1.573 3.628 1.788V25l4-4h-3z"
                                                /></svg
                                            >
                                        </div>
                                        <div class="grow flex items-center border-b border-slate-100 text-sm py-2">
                                            <div class="grow flex justify-between">
                                                <div class="self-center"><a class="font-medium text-slate-800 hover:text-slate-900" href="#0">240+</a> users have subscribed to <a class="font-medium text-slate-800" href="#0">Newsletter #1</a></div>
                                                <div class="shrink-0 self-end ml-2"><a class="font-medium text-indigo-500 hover:text-indigo-600" href="#0">View<span class="hidden sm:inline"> -&gt;</span></a></div>
                                            </div>
                                        </div>
                                    </li>
                                    <li class="flex px-2">
                                        <div class="w-9 h-9 rounded-full shrink-0 bg-indigo-500 my-2 mr-3">
                                            <svg class="w-9 h-9 fill-current text-indigo-50" viewBox="0 0 36 36"
                                                ><path d="M18 10c-4.4 0-8 3.1-8 7s3.6 7 8 7h.6l5.4 2v-4.4c1.2-1.2 2-2.8 2-4.6 0-3.9-3.6-7-8-7zm4 10.8v2.3L18.9 22H18c-3.3 0-6-2.2-6-5s2.7-5 6-5 6 2.2 6 5c0 2.2-2 3.8-2 3.8z" /></svg
                                            >
                                        </div>
                                        <div class="grow flex items-center text-sm py-2">
                                            <div class="grow flex justify-between">
                                                <div class="self-center">The post <a class="font-medium text-slate-800" href="#0">Post Name</a> was suspended by <a class="font-medium text-slate-800 hover:text-slate-900" href="#0">Nick Mark</a></div>
                                                <div class="shrink-0 self-end ml-2"><a class="font-medium text-indigo-500 hover:text-indigo-600" href="#0">View<span class="hidden sm:inline"> -&gt;</span></a></div>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
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
