<script lang="ts">
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { mdiCheck, mdiClose, mdiRefresh, mdiWebhook } from '@mdi/js';
	import { deleteWebhook, getWebhooks } from '$lib/code/api';
	import Icon from '$lib/components/elements/icon.svelte';
	import { navigateToPage } from '$lib/code/routing';
	import { Page } from '../../../types';
	import Spinner from '$lib/components/elements/spinner.svelte';
	import { selectedServerId } from '$lib/code/global';
	import Breadcrumb from '$lib/components/navigation/breadcrumb.svelte';
	import Button from '$lib/components/elements/button.svelte';
	import PageTitleBanner from '$lib/components/page/pageTitleBanner.svelte';
	import type { IWebhook } from '$lib/code/webhook';

	let webhooks: IWebhook[] = [];
	let isLoading = true;

	onMount(async () => {
		load();
	});

	function load() {
		const serverId = get(selectedServerId);
		if (!serverId) {
			isLoading = false;
			return;
		}

		getWebhooks(
			(data: IWebhook[]) => {
				webhooks = data;
			},
			(wasSuccess: boolean) => {
				isLoading = false;
			}
		);
	}

	function handleRefreshButton() {
		isLoading = true;
		webhooks = [];
		load();
	}

	function handleEditWebhook(webhookId: string) {
		navigateToPage(Page.WebhooksEdit, webhookId);
	}

	function handleDeleteWebhook(webhookId: string) {
		let allowedToDelete = confirm(`Are you sure you want to delete this webhook?`);
		if (!allowedToDelete) {
			return;
		}

		deleteWebhook(webhookId, (wasSuccess: boolean) => {
			if (wasSuccess) {
				confirm(`Webhook was successfully deleted.`);
				handleRefreshButton();
			} else {
				confirm(`Failed to delete webhook.`);
			}
		});
	}
</script>

<svelte:head>
	<title>MCSS Remote Panel | Webhooks Overview</title>
</svelte:head>

<section class="h-[calc(100vh-56px)] overflow-auto p-6 dark:bg-gray-900 dark:text-white">
	<Breadcrumb
		icon={mdiWebhook}
		items={[
			{ name: 'Webhooks', page: Page.Webhooks, isClickable: true },
			{ name: 'Overview', page: Page.Empty, isClickable: false }
		]}
	/>

	<div class="relative overflow-x-auto">
		<PageTitleBanner title="Webhook Overview" caption="Overview of all webhook integrations.">
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
				<Button icon={mdiWebhook} text={'Create Webhook'} on:click={() => navigateToPage(Page.WebhooksCreate)} reactive={true} />
			</div>
		</PageTitleBanner>

		<div class="relative overflow-x-auto rounded-lg border dark:border-gray-800">
			<table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
				<!-- this colgroup HACK auto fills the first column to max width -->
				<colgroup>
					<col class="w-full" />
				</colgroup>
				<thead class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
					<tr>
						<th scope="col" class="px-6 py-3">Name</th>
						<th scope="col" class="px-6 py-3">Enabled</th>
						<th scope="col" class="px-6 py-3">Last Modified</th>
						<th scope="col" class="px-6 py-3">Created</th>
						<th scope="col" class="px-6 py-3">Action</th>
					</tr>
				</thead>

				<tbody>
					{#each webhooks as webhook}
						<tr class="bg-white dark:bg-gray-800">
							<td class="px-6 py-4 font-medium text-gray-800 whitespace-nowrap dark:text-white">{webhook.name}</td>
							<td class="px-6 py-4">
								<Icon data={webhook.enabled ? mdiCheck : mdiClose} class="{webhook.enabled ? 'text-green-400' : 'text-red-400'} " />
							</td>
							<td class="px-6 py-4">{new Date(webhook.lastModifiedAt).toLocaleString(navigator.language)}</td>
							<td class="px-6 py-4">{new Date(webhook.createdAt).toLocaleString(navigator.language)}</td>

							<td class="flex px-6 py-4 space-x-3">
								<form on:submit|preventDefault={() => handleEditWebhook(webhook.webhookId)}>
									<button type="submit" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</button>
								</form>

								<form on:submit|preventDefault={() => handleDeleteWebhook(webhook.webhookId)}>
									<button type="submit" class="font-medium text-red-600 dark:text-red-500 hover:underline">Delete</button>
								</form>
							</td>
						</tr>
					{:else}
						<tr class="bg-white dark:bg-gray-800">
							{#if isLoading}
								<td class="px-6 py-4 text-center" colspan="7"><Spinner /></td>
							{:else}
								<td class="px-6 py-4 text-center" colspan="7">No Webhooks were found.</td>
							{/if}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</section>
