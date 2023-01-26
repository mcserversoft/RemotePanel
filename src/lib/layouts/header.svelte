<script lang="ts">
	import { auth, logout } from '$lib/code/auth';
	import { Page, navigateToPage } from '$lib/code/routing';
	import Dashboard from '$lib/pages/dashboard.svelte';
	import Logo from '$lib/svgs/Logo.svelte';
	import { Navbar, NavBrand, Avatar, Dropdown, DropdownItem, DropdownHeader, DropdownDivider } from 'flowbite-svelte';

	let dropdownOpen: boolean = false;

	function onNavigateClick(page: Page) {
		navigateToPage(page);
		dropdownOpen = false;
	}
</script>

<Navbar navClass=" px-2 sm:px-4 py-2.5 absolute w-full top-0 left-0 border-b dark:bg-gray-800">
	<div />
	<div class="flex items-center md:order-2">
		<Avatar id="avatar-menu" src="https://placeimg.com/80/80/people" />
	</div>
	<Dropdown bind:open={dropdownOpen} placement="bottom" triggeredBy="#avatar-menu">
		<DropdownHeader>
			<span class="block truncate text-sm font-medium">{$auth.username} </span>
		</DropdownHeader>
		<DropdownItem on:click={() => onNavigateClick(Page.Settings)}>Settings</DropdownItem>
		<DropdownItem on:click={() => onNavigateClick(Page.About)}>About</DropdownItem>
		<DropdownDivider />
		<DropdownItem on:click={logout} class="text-red-500">Sign out</DropdownItem>
	</Dropdown>
</Navbar>
