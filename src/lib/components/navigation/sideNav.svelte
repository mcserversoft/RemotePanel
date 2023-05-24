<script lang="ts">
	import { togglePanelTheme } from '$lib/code/theme';
	import Logo from '$lib/svgs/Logo.svelte';
	import CurrentThemeIcon from '../core/currentThemeIcon.svelte';
	import UserDropdown from './userDropdown.svelte';
	import { navigateToPage } from '$lib/code/routing';
	import NavDropdown from './navDropdown.svelte';
	import { Page } from '../../../types';
	import NavItem from './navItem.svelte';
	import { Url, getUrl } from '$lib/code/urlLibrary';
	import { openInNewTab } from '$lib/code/shared';
	import Icon from '../elements/icon.svelte';
	import { mdiAccountMultiple, mdiArchive, mdiCalendarClock, mdiCardsHeart, mdiKeyChainVariant, mdiLayers, mdiLifebuoy, mdiNotebook, mdiPoll } from '@mdi/js';

	let isOpen = false;
	let wasOpenBeforeAutoClose = true;
	let screenWidth: any;

	$: if (screenWidth > 767) {
		// open menu on big screens
		isOpen = true;
	} else {
		// toggle on smaller screens (depending on it's previous state)
		if (wasOpenBeforeAutoClose) {
			isOpen = false;
		}
	}

	function toggle() {
		wasOpenBeforeAutoClose = isOpen;
		isOpen = !isOpen;
	}
</script>

<svelte:window bind:innerWidth={screenWidth} />

<nav class="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
	<div class="px-3 py-3 lg:px-5 lg:pl-3">
		<div class="flex items-center justify-between">
			<div class="flex items-center justify-start">
				<button type="button" on:click={toggle} class="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
					<span class="sr-only">Open sidebar</span>
					<svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
						<path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z" />
					</svg>
				</button>
				<a href="/" class="flex ml-2 md:mr-24">
					<Logo className="h-8 mr-2" />
					<span class="self-center text-xl font-semibold md:text-2xl whitespace-nowrap dark:text-white">MCSS Remote Panel</span>
				</a>
			</div>
			<div class="flex items-center justify-start">
				<UserDropdown>
					<span class="sr-only">Open user menu</span>
					<img class="w-8 h-8 rounded-full" src="http://127.0.0.1:5173/fire_avatar.png" alt="user photo" />
				</UserDropdown>
			</div>
		</div>
	</div>
</nav>

{#if isOpen}
	<aside id="logo-sidebar" class="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform bg-white border-r border-gray-200 md:translate-x-0 dark:bg-gray-800 dark:border-gray-700" aria-label="Sidebar">
		<div class="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
			<ul class="space-y-2 font-medium">
				<!-- <button on:click={() => navigateToPage(Page.Servers)} class="flex items-center w-full p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
						<svg aria-hidden="true" class="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
							<path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
						</svg>
						<span class="ml-3">Servers</span>
					</button> -->
				<NavItem on:click={() => navigateToPage(Page.Servers)} name="Servers">
					<Icon data={mdiLayers} size={6} class={'text-gray-500 dark:text-gray-400'} />
				</NavItem>
			</ul>

			<ul class="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">
				<NavItem on:click={() => navigateToPage(Page.Dashboard)} name="Dashboard">
					<Icon data={mdiPoll} size={6} class={'text-gray-500 dark:text-gray-400'} />
				</NavItem>
				<NavDropdown
					name="Backups"
					items={[
						{
							name: 'Overview',
							page: Page.Backups
						},
						{
							name: 'History',
							page: Page.Empty
						},
						{
							name: 'Settings',
							page: Page.Empty
						}
					]}
				>
					<Icon data={mdiArchive} size={6} class={'text-gray-500 dark:text-gray-400'} />
				</NavDropdown>

				<NavDropdown
					name="Scheduler"
					items={[
						{
							name: 'Overview',
							page: Page.Empty
						},
						{
							name: 'History',
							page: Page.Empty
						}
					]}
				>
					<Icon data={mdiCalendarClock} size={6} class={'text-gray-500 dark:text-gray-400'} />
				</NavDropdown>

				<!-- <NavDropdown
					name="Users"
					items={[
						{
							name: 'Overview',
							page: Page.UsersOverview
						},
						{
							name: 'Add User',
							page: Page.UsersCreate
						}
					]}
				>
					<Icon data={mdiAccountMultiple} size={6} class={'text-gray-500 dark:text-gray-400'} />
				</NavDropdown> -->

				<NavItem on:click={() => navigateToPage(Page.Users)} name="Users">
					<Icon data={mdiAccountMultiple} size={6} class={'text-gray-500 dark:text-gray-400'} />
				</NavItem>

				<NavItem name="API Keys">
					<Icon data={mdiKeyChainVariant} size={6} class={'text-gray-500 dark:text-gray-400'} />
				</NavItem>

				<!-- <li>
					<a href="#" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
						<svg aria-hidden="true" class="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"
							><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg
						>
						<span class="flex-1 ml-3 whitespace-nowrap">Pro</span>
						<span class="inline-flex items-center justify-center px-2 ml-3 text-sm font-medium text-gray-800 bg-gray-200 rounded-full dark:bg-gray-700 dark:text-gray-300">Pro</span>
					</a>
				</li>
				<li>
					<a href="#" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
						<svg aria-hidden="true" class="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"
							><path d="M8.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L11 7.586V3a1 1 0 10-2 0v4.586l-.293-.293z" /><path d="M3 5a2 2 0 012-2h1a1 1 0 010 2H5v7h2l1 2h4l1-2h2V5h-1a1 1 0 110-2h1a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" /></svg
						>
						<span class="flex-1 ml-3 whitespace-nowrap">Inbox</span>
						<span class="inline-flex items-center justify-center w-3 h-3 p-3 ml-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">3</span>
					</a>
				</li> -->
			</ul>

			<ul class="absolute bottom-0 left-0 w-full p-3 space-y-2 font-medium border-t border-gray-200 text-gray-500 dark:text-gray-400 dark:border-gray-700">
				<NavItem on:click={() => openInNewTab(getUrl(Url.Contribute))} name="Contribute" isExternal={true}>
					<Icon data={mdiCardsHeart} size={6} />
				</NavItem>

				<NavItem on:click={() => openInNewTab(getUrl(Url.DocumentationPanel))} name="Documentation" isExternal={true}>
					<Icon data={mdiNotebook} size={6} class={''} />
				</NavItem>

				<NavItem on:click={() => openInNewTab(getUrl(Url.Support))} name="Help" isExternal={true}>
					<Icon data={mdiLifebuoy} size={6} />
				</NavItem>

				<NavItem on:click={togglePanelTheme} name="Switch Theme">
					<CurrentThemeIcon class="text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white dark:text-gray-400" />
				</NavItem>
				<li>
					<p class="mt-3 text-sm text-center text-gray-500 dark:text-gray-500">Panel v6.0.0.0</p>
				</li>
			</ul>
		</div>
	</aside>
{/if}
