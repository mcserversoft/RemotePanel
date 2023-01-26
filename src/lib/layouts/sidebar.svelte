<script lang="ts">
	import { Sidebar, SidebarGroup, SidebarItem, Toolbar, ToolbarButton, ToolbarGroup } from 'flowbite-svelte';
	import Logo from '$lib/svgs/Logo.svelte';
	import { Page, navigateToPage } from '$lib/code/routing';
	import Icon from '$lib/components/icon.svelte';
	import { mdiArrowExpandLeft, mdiArrowExpandRight, mdiInformationOutline, mdiCog, mdiBrightness5, mdiBrightness2, mdiThemeLightDark } from '@mdi/js';
	import ToolBarThemeSwitcher from '$lib/components/toolBarThemeSwitcher.svelte';
	import ToolBarSizeSwitcher from '$lib/components/toolBarSizeSwitcher.svelte';
	import { settings } from '$lib/code/storage';
	import { get } from 'svelte/store';

	let collapseSidebar = get(settings).collapseSidebar;
	let canCollapse = true;

	// call checkIfAllowedToResize on update
	$: $settings.collapseSidebar, checkIfAllowedToResize();

	function checkIfAllowedToResize() {
		if (canCollapse) {
			console.log('gogo');
			collapseSidebar = get(settings).collapseSidebar;
		}
	}
</script>

<!-- <aside class=" z-50 {toggle ? 'w-16' : 'w-64'}  bg-gray-50 dark:bg-gray-800" aria-label="Sidebar"> -->
<aside class="{collapseSidebar ? 'w-16' : 'w-64'} bg-gray-50 dark:bg-gray-800">
	<!-- <div class="flex flex-col px-3 py-4 min-h-screen overflow-y-auto rounded "> -->
	<div class="flex flex-col px-3 py-4 min-h-screen overflow-y-auto rounded ">
		<!-- <NavHamburger on:click={test} /> -->

		<div on:click={() => navigateToPage(Page.Dashboard)} on:keydown={() => navigateToPage(Page.Dashboard)} class="flex items-center mb-8 pl-2.5 cursor-pointer">
			<Logo width="32" height="32" class="min-h-[32px] min-w-[32px] mr-3" />
			<span class="{collapseSidebar ? 'hidden' : ''} self-center text-xl font-semibold whitespace-nowrap dark:text-white">MCSS Remote Panel</span>
		</div>

		<ul class="flex-grow space-y-2">
			<li>
				<a href="/" on:click={() => navigateToPage(Page.Dashboard)} class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
					<svg aria-hidden="true" class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
						<path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
						<path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
					</svg>
					<span class="ml-3 {collapseSidebar ? 'hidden ' : ''}">Dashboard</span>
				</a>
			</li>
			<li>
				<a href="#" class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
					<svg aria-hidden="true" class="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"
						><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg
					>
					<span class="{collapseSidebar ? 'hidden' : ''} flex-1 ml-3 whitespace-nowrap">Kanban</span>
					<span class="{collapseSidebar ? 'hidden' : ''} inline-flex items-center justify-center px-2 ml-3 text-sm font-medium text-gray-800 bg-gray-200 rounded-full dark:bg-gray-700 dark:text-gray-300">Pro</span>
				</a>
			</li>
			<li>
				<a href="#" class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
					<svg aria-hidden="true" class="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"
						><path d="M8.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L11 7.586V3a1 1 0 10-2 0v4.586l-.293-.293z" /><path d="M3 5a2 2 0 012-2h1a1 1 0 010 2H5v7h2l1 2h4l1-2h2V5h-1a1 1 0 110-2h1a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" /></svg
					>
					<span class="{collapseSidebar ? 'hidden' : ''} flex-1 ml-3 whitespace-nowrap">Servers</span>
					<span class="{collapseSidebar ? 'hidden' : ''} inline-flex items-center justify-center w-3 h-3 p-3 ml-3 text-sm font-medium text-blue-600 bg-blue-200 rounded-full dark:bg-blue-900 dark:text-blue-200">3</span>
				</a>
			</li>
			<li>
				<a href="#" class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
					<svg aria-hidden="true" class="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"
						><path fill-rule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clip-rule="evenodd" /></svg
					>
					<span class="{collapseSidebar ? 'hidden' : ''} flex-1 ml-3 whitespace-nowrap">Products</span>
				</a>
			</li>
			<li>
				<a href="#" class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
					<svg aria-hidden="true" class="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"
						><path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd" /></svg
					>
					<span class="{collapseSidebar ? 'hidden' : ''} flex-1 ml-3 whitespace-nowrap">Sign In</span>
				</a>
			</li>
			<li>
				<a href="/" on:click={() => navigateToPage(Page.Settings)} class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
					<Icon data={mdiCog} class="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
					<span class="{collapseSidebar ? 'hidden' : ''} flex-1 ml-3 whitespace-nowrap">Settings</span>
				</a>
			</li>
		</ul>

		<div class="flex {collapseSidebar ? 'flex-col space-y-1' : 'flex-row space-x-3'} justify-center items-center">
			<ToolBarThemeSwitcher />
			<ToolbarButton on:click={() => navigateToPage(Page.About)}>
				<Icon data={mdiInformationOutline} size={5} />
			</ToolbarButton>
			<ToolBarSizeSwitcher />
		</div>
		<!-- <div id="dropdown-cta" class="p-4 mt-6 rounded-lg bg-blue-50 dark:bg-blue-900" role="alert">
			<div class="flex items-center mb-3">
				<span class="bg-orange-100 text-orange-800 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-orange-200 dark:text-orange-900">New Panel v6 🎉</span>
				<button type="button" class="ml-auto -mx-1.5 -my-1.5 bg-blue-50 text-blue-900 rounded-lg focus:ring-2 focus:ring-blue-400 p-1 hover:bg-blue-200 inline-flex h-6 w-6 dark:bg-blue-900 dark:text-blue-400 dark:hover:bg-blue-800" data-collapse-toggle="dropdown-cta" aria-label="Close">
					<span class="sr-only">Close</span>
					<svg aria-hidden="true" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"
						><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg
					>
				</button>
			</div>
			<p class="mb-3 text-sm text-blue-900 dark:text-blue-400">Preview the new Flowbite dashboard navigation! You can turn the new navigation off for a limited time in your profile.</p>
			<a class="text-sm text-blue-900 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300" href="#">Turn new navigation off</a>
		</div> -->
	</div>
</aside>

<!-- <script lang="ts">
	import { auth } from '$lib/code/auth';
	import { servers, selectedServerGuid, isLoadingServers } from '$lib/code/api';
	import { getGreeting, getFriendlyStatusName, getStatusBgColor } from '$lib/code/shared';

	function onServerClick(guid: string) {
		selectedServerGuid.set(guid);
	}
</script>

<section class="h-max w-max max-w-full overflow-hidden pr-6 bg-custom-gray-lighter text-white">
	<div class="flex-col h-screen overflow-y-auto bg-inherit w-64 pt-6 pl-6">
		<h3 class="text-xs uppercase text-slate-500 font-semibold pl-3">
			<span class="text-center w-6">{getGreeting()}, {$auth.username} 👋</span>
		</h3>

		<div class="mt-6 px-3">
			<div class="flex items-center justify-between">
				<div class="flex items-center">
					<svg class="shrink-0 h-6 w-6" viewBox="0 0 24 24">
						<path class="fill-current text-slate-400" d="M13 15l11-7L11.504.136a1 1 0 00-1.019.007L0 7l13 8z" />
						<path class="fill-current text-slate-700" d="M13 15L0 7v9c0 .355.189.685.496.864L13 24v-9z" />
						<path class="fill-current text-slate-600" d="M13 15.047V24l10.573-7.181A.999.999 0 0024 16V8l-11 7.047z" />
					</svg>
					<span class="text-sm font-medium ml-3 cursor-default">Servers</span>
				</div>
			</div>

			<ul class="pl-9 mt-1 truncate">
				{#each $servers || [] as { guid, name, status }}
					<li class="mb-1 last:mb-0">
						<button on:click={() => onServerClick(guid)} class=" text-slate-400 hover:text-slate-200">
							<span class="inline-flex rounded-full h-2 w-2 {getStatusBgColor(status)}" title={getFriendlyStatusName(status)} /> <span class="text-sm font-medium">{name}</span>
						</button>
					</li>
				{:else}
					<li class="mb-1 last:mb-0">
						<span class="text-sm font-medium italic text-slate-400">{$isLoadingServers ? 'Loading Servers.' : 'No Servers found.'}</span>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</section> -->
