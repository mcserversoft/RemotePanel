<script lang="ts">
	import { auth, logout } from '$lib/code/auth';
	import { Page, navigateToPage } from '$lib/code/routing';
	import { Navbar, Dropdown, DropdownItem, DropdownDivider } from 'flowbite-svelte';
	import { mdiMenuDown } from '@mdi/js';
	import Icon from '$lib/components/icon.svelte';

	let dropdownOpen: boolean = false;

	function onNavigateClick(page: Page) {
		navigateToPage(page);
		dropdownOpen = false;
	}
</script>

<Navbar navClass=" px-2 sm:px-4 py-2.5 absolute w-full top-0 left-0 border-b dark:bg-gray-800">
	<div />
	<div class="flex items-center md:order-2 min-h-[45px]">
		<button class="flex font-semibold cursor-pointer border-transparent focus:border-transparent focus:ring-0" id="dropdown-toggle">
			{$auth.username}
			<Icon data={mdiMenuDown} />
		</button>
	</div>
	<Dropdown bind:open={dropdownOpen} placement="bottom" triggeredBy="#dropdown-toggle">
		<DropdownItem on:click={() => onNavigateClick(Page.Settings)}>Settings</DropdownItem>
		<DropdownItem on:click={() => onNavigateClick(Page.About)}>About</DropdownItem>
		<DropdownDivider />
		<DropdownItem on:click={logout} class="text-red-500">Sign out</DropdownItem>
	</Dropdown>
</Navbar>
