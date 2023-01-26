<script lang="ts">
	import { auth, logout } from '$lib/code/auth';
	import { Page, navigateToPage } from '$lib/code/routing';
	import { clickOutside } from '$lib/code/shared';
	import ArrowDownSvg from '$lib/svgs/ArrowDownSvg.svelte';
	import Logo from '$lib/svgs/Logo.svelte';

	let dropdownVisible: boolean = false;

	function toggleDropdown() {
		dropdownVisible = !dropdownVisible;
	}

	function handleClickOutside() {
		dropdownVisible = false;
	}

	function navigateClick(page: Page) {
		dropdownVisible = false;
		navigateToPage(page);
	}
</script>

<header class="navbar sticky top-0 z-50 bg-custom-gray shadow-sm">
	<div class="flex-1">
		<Logo width="32" height="32" />
		<p class="font-semibold text-xl px-3">MCSS Remote Panel</p>
	</div>
	<div class="flex-none gap-2">
		<div class="relative inline-flex mr-6" use:clickOutside on:click_outside={handleClickOutside}>
			<button on:click={toggleDropdown} aria-controls="dropdown" aria-expanded={dropdownVisible}>
				<div class="flex items-center truncate text-zinc-200">
					<span class="ml-2 text-sm font-medium capitalize truncate"> {$auth.username}</span>
					<ArrowDownSvg />
				</div>
			</button>

			{#if dropdownVisible}
				<div class="absolute top-full right-0 min-w-44 py-1.5 mt-2 rounded shadow-lg overflow-hidden z-50 bg-custom-gray-lightest">
					<ul>
						<li>
							<div class="pt-0.5 pb-2 px-3 mb-1 border-b border-zinc-500">
								<div class="font-medium capitalize text-zinc-100">{$auth.username}</div>
								<div class="text-xs italic text-zinc-400">Administrator</div>
							</div>
						</li>
						<li>
							<button on:click={() => navigateClick(Page.Settings)} class="flex w-full py-1 px-3 font-medium text-sm hover:bg-zinc-600">Settings</button>
						</li>
						<li class="py-1 border-b border-zinc-500">
							<button on:click={() => navigateClick(Page.About)} class="flex w-full py-1 px-3 font-medium text-sm hover:bg-zinc-600">About</button>
						</li>
						<li class="pt-1">
							<button on:click={logout} class="flex w-full py-1 px-3 font-medium text-sm capitalize text-red-500 hover:bg-zinc-600">log out</button>
						</li>
					</ul>
				</div>
			{/if}
		</div>
	</div>
</header>
