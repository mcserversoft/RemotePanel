<script lang="ts">
    import { auth } from "$lib/store.js";

    export let username: string;

    let showUserDropdown: boolean;

    function toggleAccountDropdown() {
        showUserDropdown = !showUserDropdown;
    }

    function logout() {
        auth.set({
            apiKey: "",
            username: "",
        });
    }
</script>

<header class="sticky top-0 bg-zinc-900 text-white">
    <div class="px-4 sm:px-6">
        <div class="flex  justify-end h-16">
            <div class="relative inline-flex">
                <button on:click={toggleAccountDropdown} class="inline-flex justify-center items-center group" aria-haspopup="true" aria-expanded="false">
                    <div class="flex items-center truncate text-zinc-200">
                        <span class="truncate ml-2 text-sm font-medium capitalize"> {username}</span>
                        <svg class="w-3 h-3 shrink-0 ml-1 fill-current text-zinc-300" viewBox="0 0 12 12">
                            <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                        </svg>
                    </div>
                </button>

                {#if showUserDropdown}
                    <div class="origin-top-right absolute top-full right-0 min-w-44 bg-white border border-slate-200 py-1.5 rounded shadow-lg overflow-hidden">
                        <div class="pt-0.5 pb-2 px-3 mb-1 border-b border-slate-200">
                            <div class="font-medium text-slate-800 capitalize">{username}</div>
                            <div class="text-xs text-slate-500 italic">Administrator</div>
                        </div>
                        <ul>
                            <li><button on:click={logout} class="font-medium text-sm text-indigo-500 hover:text-indigo-600 flex items-center py-1 px-3">Log Out</button></li>
                        </ul>
                    </div>
                {/if}
            </div>
        </div>
    </div>
</header>
