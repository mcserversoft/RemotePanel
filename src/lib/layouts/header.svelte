<script lang="ts">
    import { logout, clickOutside } from "$lib/common.js";
    import ArrowDownSvg from "$lib/svgs/ArrowDownSvg.svelte";

    export let username: string;

    let dropdownVisible: boolean = false;

    function toggleDropdown() {
        dropdownVisible = !dropdownVisible;
    }

    function handleClickOutside() {
        dropdownVisible = false;
    }
</script>

<header class="top-0 px-5 z-50 bg-zinc-900 text-white">
    <div class="flex justify-between h-16 place-items-center first-letter:px-4">
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

        <div class="relative inline-flex " use:clickOutside on:click_outside={handleClickOutside}>
            <button on:click={toggleDropdown} aria-controls="dropdown" aria-expanded={dropdownVisible}>
                <div class="flex items-center truncate text-zinc-200">
                    <span class="ml-2 text-sm font-medium capitalize truncate"> {username}</span>
                    <ArrowDownSvg />
                </div>
            </button>

            {#if dropdownVisible}
                <div class="absolute top-full right-0 min-w-44 py-1.5 mt-2 rounded shadow-lg overflow-hidden z-50 bg-zinc-800">
                    <div class="pt-0.5 pb-2 px-3 mb-1 border-b border-zinc-400">
                        <div class="font-medium capitalize text-zinc-100">{username}</div>
                        <div class="text-xs italic text-zinc-400">Administrator</div>
                    </div>
                    <ul>
                        <li>
                            <button on:click={logout} class="flex w-full py-1 px-3 font-medium text-sm capitalize text-red-500 hover:bg-zinc-700">log out</button>
                        </li>
                    </ul>
                </div>
            {/if}
        </div>
    </div>
</header>
