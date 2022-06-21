<script lang="ts">
    import { logout, clickOutside } from "$lib/common.js";
    import ArrowDownSvg from "../components/svgs/ArrowDownSvg.svelte";

    export let username: string;

    let dropdownVisible: boolean = false;

    function toggleDropdown() {
        dropdownVisible = !dropdownVisible;
    }
    
    function handleClickOutside() {
        dropdownVisible = false;
    }
</script>

<header class="sticky top-0 bg-zinc-900 text-white z-50">
    <div class="px-4 sm:px-6">
        <div class="flex justify-end h-16">
            <div class="relative inline-flex" use:clickOutside on:click_outside={handleClickOutside} >
                <button on:click={toggleDropdown} aria-controls="dropdown" aria-expanded={dropdownVisible} class="inline-flex justify-center items-center">
                    <div class="flex items-center truncate text-zinc-200">
                        <span class="ml-2 text-sm font-medium capitalize truncate"> {username}</span>
                        <ArrowDownSvg />
                    </div>
                </button>

                {#if dropdownVisible}
                    <div class="absolute top-full right-0 min-w-44 py-1.5 -mt-2 rounded shadow-lg overflow-hidden bg-white ">
                        <div class="pt-0.5 pb-2 px-3 mb-1 border-b border-slate-200">
                            <div class="font-medium capitalize text-slate-800">{username}</div>
                            <div class="text-xs italic text-slate-500">Administrator</div>
                        </div>
                        <ul>
                            <li>
                                <button on:click={logout} class="flex w-full py-1 px-3 font-medium text-sm capitalize text-red-500 hover:bg-gray-100">log out</button>
                            </li>
                        </ul>
                    </div>
                {/if}
            </div>
        </div>
    </div>
</header>
