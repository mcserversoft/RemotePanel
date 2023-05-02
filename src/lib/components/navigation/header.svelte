<!--<script lang="ts">
	import { auth, logout } from '$lib/code/auth';
	import { navigateToPage } from '$lib/code/routing';
	import { clickOutside } from '$lib/code/shared';
	import ArrowDownSvg from '$lib/svgs/ArrowDownSvg.svelte';
	import Logo from '$lib/svgs/Logo.svelte';
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Avatar, Dropdown, DropdownItem, DropdownHeader, DropdownDivider } from 'flowbite-svelte';
	import type { Page } from '../../../types';

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

 <Navbar let:hidden let:toggle>
	<NavBrand href="/">
		<img src="https://flowbite.com/docs/images/logo.svg" class="mr-3 h-6 sm:h-9" alt="Flowbite Logo" />
		<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Flowbite</span>
	</NavBrand>
	<div class="flex items-center md:order-2">
		<Avatar id="avatar-menu" src="/images/profile-picture-3.webp" />
		<NavHamburger on:click={toggle} class1="w-full md:flex md:w-auto md:order-1" />
	</div>
	<Dropdown placement="bottom" triggeredBy="#avatar-menu">
		<DropdownHeader>
			<span class="block text-sm"> Bonnie Green </span>
			<span class="block truncate text-sm font-medium"> name@flowbite.com </span>
		</DropdownHeader>
		<DropdownItem>Dashboard</DropdownItem>
		<DropdownItem>Settings</DropdownItem>
		<DropdownItem>Earnings</DropdownItem>
		<DropdownDivider />
		<DropdownItem>Sign out</DropdownItem>
	</Dropdown>
</Navbar>

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
</header> -->
