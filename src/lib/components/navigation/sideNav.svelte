<script lang="ts">
	import { togglePanelTheme } from '$lib/code/theme';
	import Logo from '$lib/components/elements/logo.svelte';
	import CurrentThemeIcon from '../core/currentThemeIcon.svelte';
	import UserDropdown from './userDropdown.svelte';
	import { selectedPage, navigateToPage } from '$lib/code/routing';
	import { Page } from '../../../types';
	import NavItem from './navItem.svelte';
	import { Url, getURLToCurrentUserAvatar, getUrl } from '$lib/code/urlLibrary';
	import { openInNewTab } from '$lib/code/shared';
	import Icon from '../elements/icon.svelte';
	import { mdiAccountMultiple, mdiArchive, mdiCalendarClock, mdiCardText, mdiCardsHeart, mdiKeyChainVariant, mdiLayers, mdiNotebook, mdiPoll, mdiText, mdiTextBox } from '@mdi/js';
	import { get } from 'svelte/store';
	import { auth } from '$lib/code/auth';
	import NavDropdown from './navDropdown.svelte';

	// @ts-ignore
	const version: string = __VERSION__;

	let isOpen = false;
	let wasOpenBeforeAutoClose = true;
	let screenWidth: any;
	const mobileScreenWidthBreakpoint = 767;

	// run on screenWidth update
	$: if (screenWidth > mobileScreenWidthBreakpoint) {
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

	function handleNavigationRequest(page: Page) {
		navigateToPage(page);

		if (screenWidth < mobileScreenWidthBreakpoint) {
			isOpen = false;
		}
	}
</script>

<svelte:window bind:innerWidth={screenWidth} />

<nav class="fixed top-0 z-50 w-full bg-gray-50 border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
	<div class="px-3 py-3 lg:px-5 lg:pl-3">
		<div class="flex items-center justify-between">
			<div class="flex items-center justify-start">
				<button type="button" on:click={toggle} class="inline-flex items-center p-2 text-sm rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
					<span class="sr-only">Open sidebar</span>
					<svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
						<path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z" />
					</svg>
				</button>
				<div class="flex ml-2 md:mr-24 select-none">
					<Logo className="h-8 mr-2" />
					<span class="self-center text-xl font-semibold md:text-2xl whitespace-nowrap">MCSS Remote Panel</span>
				</div>
			</div>
			<div class="flex items-center justify-start">
				<UserDropdown>
					<span class="sr-only">Open user menu</span>
					<img class="w-8 h-8 rounded-full" src={getURLToCurrentUserAvatar()} alt="user avatar" />
				</UserDropdown>
			</div>
		</div>
	</div>
</nav>

{#if isOpen}
	<aside id="logo-sidebar" class="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform bg-gray-50 border-r border-gray-200 md:translate-x-0 dark:bg-gray-800 dark:border-gray-700" aria-label="Sidebar">
		<div class="h-full px-3 pb-4 overflow-y-auto">
			<ul class="space-y-2 font-medium">
				<NavItem on:click={() => handleNavigationRequest(Page.Servers)} name="Servers" isActive={$selectedPage == Page.Servers || $selectedPage == Page.ServerEdit}>
					<Icon data={mdiLayers} size={6} class={'text-gray-500 dark:text-gray-400'} />
				</NavItem>
			</ul>

			<ul class="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">
				<NavItem on:click={() => handleNavigationRequest(Page.Dashboard)} name="Dashboard" isActive={$selectedPage == Page.Dashboard}>
					<Icon data={mdiPoll} size={6} class={'text-gray-500 dark:text-gray-400'} />
				</NavItem>

				<NavItem on:click={() => handleNavigationRequest(Page.Console)} name="Console" isActive={$selectedPage == Page.Console}>
					<Icon data={mdiText} size={6} class={'text-gray-500 dark:text-gray-400'} />
				</NavItem>

				<NavDropdown
					name="Backups"
					items={[
						{
							name: 'Overview',
							page: Page.Backups,
							isActive: $selectedPage == Page.Backups || $selectedPage == Page.BackupsCreate || $selectedPage == Page.BackupsEdit,
							hasPermission: true
						},
						{
							name: 'History',
							page: Page.BackupHistory,
							isActive: $selectedPage == Page.BackupHistory,
							hasPermission: true
						},
						{
							name: 'Settings',
							page: Page.BackupSettings,
							isActive: $selectedPage == Page.BackupSettings,
							hasPermission: get(auth).showAdminFeatures
						}
					]}
				>
					<Icon data={mdiArchive} size={6} class={'text-gray-500 dark:text-gray-400'} />
				</NavDropdown>

				<NavItem on:click={() => handleNavigationRequest(Page.Scheduler)} name="Scheduler" isActive={$selectedPage == Page.Scheduler || $selectedPage == Page.SchedulerTaskCreate || $selectedPage == Page.SchedulerTaskEdit}>
					<Icon data={mdiCalendarClock} size={6} class={'text-gray-500 dark:text-gray-400'} />
				</NavItem>
				<!-- <NavDropdown
					name="Scheduler"
					items={[
						{
							name: 'Overview',
							page: Page.Scheduler,
							isActive: false,
							hasPermission: true
						},
						{
							name: 'History',
							page: Page.SchedulerHistory,
							isActive: false,
							hasPermission: true
						}
					]}
				>
					<Icon data={mdiCalendarClock} size={6} class={'text-gray-500 dark:text-gray-400'} />
				</NavDropdown> -->
			</ul>

			<ul class="absolute bottom-0 left-0 w-full p-3 space-y-2 font-medium border-t border-gray-200 text-gray-500 dark:text-gray-400 dark:border-gray-700">
				{#if get(auth).showAdminFeatures}
					<!-- <NavItem name="API Keys"> -->
					<NavItem on:click={() => handleNavigationRequest(Page.ApiKeysOverview)} name="API Keys" isActive={$selectedPage == Page.ApiKeysOverview || $selectedPage == Page.ApiKeysCreate}>
						<Icon data={mdiKeyChainVariant} size={6} class={'text-gray-500 dark:text-gray-400'} />
					</NavItem>

					<NavItem on:click={() => handleNavigationRequest(Page.Users)} name="Users" isActive={$selectedPage == Page.Users || $selectedPage == Page.UsersCreate || $selectedPage == Page.UsersEdit}>
						<Icon data={mdiAccountMultiple} size={6} class={'text-gray-500 dark:text-gray-400'} />
					</NavItem>
				{/if}

				<NavItem on:click={togglePanelTheme} name="Switch Theme">
					<CurrentThemeIcon class="text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white dark:text-gray-400" />
				</NavItem>

				<NavItem on:click={() => openInNewTab(getUrl(Url.Contribute))} name="Contribute" isExternal={true}>
					<Icon data={mdiCardsHeart} size={6} />
				</NavItem>

				<NavItem on:click={() => openInNewTab(getUrl(Url.DocumentationPanel))} name="Documentation" isExternal={true}>
					<Icon data={mdiNotebook} size={6} class={''} />
				</NavItem>
				<li>
					<p class="mt-3 text-sm text-center text-gray-500 dark:text-gray-500">Panel v{version}</p>
				</li>
			</ul>
		</div>
	</aside>
{/if}
