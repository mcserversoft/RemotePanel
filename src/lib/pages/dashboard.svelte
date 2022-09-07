<script type="ts">
	import { get } from 'svelte/store';
	import VisibilityChange from 'svelte-visibility-change';
	import { visibilityChange } from 'svelte-visibility-change';
	import { auth, settings, selectedServer } from '$lib/storage';
	import Header from '$lib/components/header.svelte';
	import Sidebar from '$lib/components/sidebar.svelte';
	import Server from '$lib/components/server.svelte';
	import Console from '$lib/components/console.svelte';
	import CloseSvg from '$lib/svgs/CloseSvg.svelte';

	let username = get(auth).username;
	let sidebarVisible: boolean;

	function hideDiscordPopup() {
		$settings.showDiscordPopup = false;
	}
</script>

<svelte:head>
	<title>MCSS Remote Panel | Panel</title>
	<meta name="description" content="Remote Panel for MC Server Soft" />
</svelte:head>

<!-- <div class="pt-3 px-6"> -->
<div class="">

	<div class="flex flex-col lg:flex-row">
		<div class="flex-none hidden lg:block">
			<Sidebar />
		</div>
		<div class="flex-grow p-6">
			<!-- <div class="md:px-8 sm:px-6 px-4 mt-8 w-full max-w-9xl mx-auto h-screen text-gray-300"> -->
			<div class="mb-20">
				{#if $selectedServer.guid}
					<Server />
					<Console />
				{/if}
			</div>
		</div>

		<!-- {#if $settings.showDiscordPopup}
            <div class="fixed bottom-0 right-0 w-full md:bottom-8 md:right-12 md:w-auto z-60">
                <div class="bg-zinc-500 text-slate-50 text-sm p-3 md:rounded shadow-lg flex justify-between">
                    <div>👉 <a class="hover:underline" href="https://mcserversoft.com/discord" target="_blank" rel="noreferrer">Show your support and join our Discord server!</a></div>
                    <button on:click={hideDiscordPopup} class="text-slate-50 hover:text-slate-400 ml-5">
                        <span class="sr-only">Close</span>
                        <CloseSvg />
                    </button>
                </div>
            </div>
        {/if} -->
	</div>
</div>
