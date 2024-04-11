<script lang="ts">
	import { mdiCheck, mdiClose, mdiKeyChainVariant, mdiKeyVariant, mdiRefresh } from '@mdi/js';
	import { deleteApiKey, getApiKeys } from '$lib/code/api';
	import Icon from '$lib/components/elements/icon.svelte';
	import { navigateToPage } from '$lib/code/routing';
	import { Page, WarningType } from '../../../types';
	import Spinner from '$lib/components/elements/spinner.svelte';
	import PageTitleBanner from '$lib/components/page/pageTitleBanner.svelte';
	import { onMount } from 'svelte';
	import Button from '$lib/components/elements/button.svelte';
	import Warning from '$lib/components/elements/warning.svelte';
	import OpenInNewTab from '$lib/components/elements/openInNewTab.svelte';
	import { Url, getUrl } from '$lib/code/urlLibrary';
	import Breadcrumb from '$lib/components/navigation/breadcrumb.svelte';
	import type { IApiKey } from '$lib/code/apiKey';

	let apiKeys: IApiKey[] = [];
	let isLoading = true;

	onMount(async () => {
		load();
	});

	function load() {
		getApiKeys(
			(data: IApiKey[]) => {
				apiKeys = data;
			},
			(wasSuccess: boolean) => {
				isLoading = false;
			}
		);
	}

	function handleRefreshButton() {
		isLoading = true;
		apiKeys = [];
		load();
	}

	function handleDeleteApiKey(e: any) {
		const formData = Object.fromEntries(new FormData(e.target).entries());

		let allowedToDelete = confirm(`Are you sure you want to delete API Key '${formData.name}'?`);
		if (!allowedToDelete) {
			return;
		}

		deleteApiKey(formData.apiKeyId.toString(), (wasSuccess: boolean) => {
			if (wasSuccess) {
				confirm(`API Key '${formData.name}' was successfully deleted.`);
				handleRefreshButton();
			} else {
				confirm(`Failed to delete API Key '${formData.name}'.`);
			}
		});
	}
</script>

<svelte:head>
	<title>MCSS Remote Panel | API Keys</title>
</svelte:head>

<section class="h-[calc(100vh-56px)] overflow-auto p-6 dark:bg-gray-900 dark:text-white">
	<Breadcrumb
		icon={mdiKeyChainVariant}
		items={[
			{ name: 'API Keys', page: Page.ApiKeysOverview, isClickable: true },
			{ name: 'Overview', page: Page.Empty, isClickable: false }
		]}
	/>

	<div class="relative overflow-x-auto">
		<PageTitleBanner title="API Keys" caption="Manage API access with API Keys. These are used to authenticate against the the Remote API.">
			<div class="self-center">
				<button
					type="button"
					on:click={handleRefreshButton}
					class="px-3 py-1.5 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
				>
					<Icon data={mdiRefresh} size={5} class="" />
				</button>
			</div>
			<div class="self-center">
				<Button icon={mdiKeyVariant} text={'Create API Key'} on:click={() => navigateToPage(Page.ApiKeysCreate)} reactive={true} />
			</div>
		</PageTitleBanner>

		<Warning type={WarningType.Info}>Learn more about the features and functionality of the <OpenInNewTab url={getUrl(Url.DocumentationApi)} text={'MCSS API'} inline={true} />.</Warning>

		<div class="relative overflow-x-auto rounded-lg border dark:border-gray-800">
			<table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
				<thead class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
					<tr>
						<th scope="col" class="px-6 py-3">Name</th>
						<th scope="col" class="px-6 py-3">Admin</th>
						<th scope="col" class="px-6 py-3">Servers</th>
						<th scope="col" class="px-6 py-3">Created</th>
						<th scope="col" class="px-6 py-3">Action</th>
					</tr>
				</thead>
				<tbody>
					{#each apiKeys as apiKey}
						<tr class="bg-white dark:bg-gray-800">
							<td class="px-6 py-4 font-medium text-gray-800 whitespace-nowrap dark:text-white">{apiKey.name}</td>
							<td class="px-6 py-4">
								<Icon data={apiKey.isAdmin ? mdiCheck : mdiClose} class="{apiKey.isAdmin ? 'text-green-400' : 'text-red-400'} " />
							</td>
							<td class="px-6 py-4">
								<span class="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">{apiKey.serverAccessDetails?.hasAccessToAllServers ? 'All' : apiKey.serverAccessDetails?.getCustomServerCount()}</span>
							</td>
							<td class="px-6 py-4">{new Date(apiKey.createdAt).toLocaleString(navigator.language)}</td>
							<td class="flex px-6 py-4 space-x-3">
								<form on:submit|preventDefault={handleDeleteApiKey}>
									<input type="text" id="apiKeyId" name="apiKeyId" value={apiKey.apiKeyId} autocomplete="off" hidden />
									<input type="text" id="name" name="name" value={apiKey.name} autocomplete="off" hidden />
									<button type="submit" class="font-medium text-red-600 dark:text-red-500 hover:underline">Delete</button>
								</form>
							</td>
						</tr>
					{:else}
						<tr class="bg-white dark:bg-gray-800">
							{#if isLoading}
								<td class="px-6 py-4 text-center" colspan="7"><Spinner /></td>
							{:else}
								<td class="px-6 py-4 text-center" colspan="7">No API Keys were found.</td>
							{/if}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</section>
