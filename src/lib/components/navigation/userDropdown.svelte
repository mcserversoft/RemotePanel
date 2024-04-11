<script lang="ts">
	import { clickOutside, getGreeting } from '$lib/code/shared';
	import { auth } from '$lib/code/auth';
	import { Page, navigateToPage } from '$lib/code/routing';
	import { logout } from '$lib/code/auth';

	let isOpen = false;

	function toggle() {
		isOpen = !isOpen;
	}

	function handleClickOutside() {
		isOpen = false;
	}

	function navigateClick(page: Page) {
		isOpen = false;
		navigateToPage(page);
	}
</script>

<div class="flex items-center" use:clickOutside on:click_outside={handleClickOutside}>
	<div class="relative inline-block text-left">
		<button on:click={toggle} type="button" class="inline-flex align-middle text-sm rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600" id="menu-button" aria-expanded="true" aria-haspopup="true">
			<slot />
		</button>

		{#if isOpen}
			<div class="absolute right-0 rounded-lg divide-y w-48 shadow-lg divide-gray-150 dark:divide-gray-500 bg-white dark:bg-gray-600">
				<div class="px-4 py-3 text-sm text-inherit dark:text-inherit">
					<div class="capitalize select-none">{getGreeting()}, <span class="normal-case font-semibold">{$auth.username}</span> 👋</div>
				</div>
				<ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownUserAvatarButton">
					<li>
						<button on:click={() => navigateClick(Page.Account)} class="px-4 0 py-2 w-full text-left hover:bg-gray-150 dark:hover:bg-gray-500 dark:hover:text-white">Account & Profile</button>
					</li>
					<li>
						<button on:click={() => navigateClick(Page.Settings)} class="px-4 py-2 w-full text-left hover:bg-gray-150 dark:hover:bg-gray-500 dark:hover:text-white">Settings</button>
					</li>
					<li>
						<button on:click={() => navigateClick(Page.About)} class="px-4 py-2 w-full text-left hover:bg-gray-150 dark:hover:bg-gray-500 dark:hover:text-white">About</button>
					</li>
				</ul>
				<div class="py-2">
					<button on:click={logout} class=" px-4 py-2 w-full text-left text-sm text-red-500 hover:bg-red-100 hover:dark:bg-red-500 dark:text-red-500 dark:hover:bg-gray-600 dark:hover:text-white">Sign Out</button>
				</div>
			</div>
		{/if}
	</div>
</div>
