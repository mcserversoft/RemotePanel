<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { Button } from 'flowbite-svelte';
	import { Page, WarningType } from '../../../types';
	import { mdiArrowULeftTop, mdiClipboardTextMultiple, mdiKeyChainVariant } from '@mdi/js';
	import { navigateToPage, selectedPageProps } from '$lib/code/routing';
	import Icon from '$lib/components/elements/icon.svelte';
	import PageTitleBanner from '$lib/components/page/pageTitleBanner.svelte';
	import Breadcrumb from '$lib/components/navigation/breadcrumb.svelte';
	import Input from '$lib/components/elements/input.svelte';
	import BoxedContainer from '$lib/components/elements/boxedContainer.svelte';
	import Warning from '$lib/components/elements/warning.svelte';

	let plainApiKey: string;

	onMount(async () => {
		load();
	});

	onDestroy(() => {
		selectedPageProps.set(null);
	});

	function load() {
		plainApiKey = get(selectedPageProps) ?? '';
	}

	function copyApiKey() {
		navigator.clipboard.writeText(plainApiKey);
	}

	function navigateBack() {
		navigateToPage(Page.ApiKeysOverview);
	}
</script>

<svelte:head>
	<title>MCSS Remote Panel | View API Key</title>
</svelte:head>

<section class="h-[calc(100vh-56px)] overflow-auto p-6 dark:bg-gray-900 dark:text-white">
	<Breadcrumb
		icon={mdiKeyChainVariant}
		items={[
			{ name: 'API Keys', page: Page.ApiKeysOverview, isClickable: true },
			{ name: 'Create', page: Page.ApiKeysCreate, isClickable: true },
			{ name: 'View Key', page: Page.Empty, isClickable: false }
		]}
	/>

	<PageTitleBanner title="Add API Key" caption="Create a new API Key for accessing the Remote API." />
	<Warning type={WarningType.Success}>Your API Key has been successfully created! Please ensure to copy and securely store it as it will only be visible once.</Warning>

	<form on:submit|preventDefault={copyApiKey} class="space-y-3">
		<BoxedContainer class="space-y-3">
			<div class="flex relative">
				<div class="relative w-full">
					<Input bind:value={plainApiKey} label={'API Key'} placeholder="Unable to load key." readonly={true} class="mr-12" />
				</div>

				<div class="absolute bottom-0 right-0">
					<form on:submit|preventDefault={copyApiKey}>
						<button type="submit" class="p-2.5 ml-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 focus:ring-2 focus:ring-blue-700 dark:focus:ring-blue-500">
							<Icon data={mdiClipboardTextMultiple} size={5} /> <span class="sr-only">Copy to clipboard</span>
						</button>
					</form>
				</div>
			</div>
			<p class="mt-3 text-sm empty:hidden text-gray-500 dark:text-gray-400">Remember to keep your API Key secure at all times to prevent unauthorized access!</p>
		</BoxedContainer>

		<div class="flex space-x-3">
			<Button type="button" on:click={navigateBack} color="alternative">
				<Icon data={mdiArrowULeftTop} class="mr-2 -ml-1" />Return to Overview
			</Button>
		</div>
	</form>
</section>
