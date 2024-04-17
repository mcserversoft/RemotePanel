<script lang="ts">
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { mdiArrowULeftTop, mdiContentSave, mdiWebhook } from '@mdi/js';
	import Icon from '$lib/components/elements/icon.svelte';
	import PageTitleBanner from '$lib/components/page/pageTitleBanner.svelte';
	import Breadcrumb from '$lib/components/navigation/breadcrumb.svelte';
	import { Page, navigateToPage, selectedPageProps } from '$lib/code/routing';
	import Toggle from '$lib/components/elements/toggle.svelte';
	import { Button, Label, Select } from 'flowbite-svelte';
	import BoxedContainer from '$lib/components/elements/boxedContainer.svelte';
	import Input from '$lib/components/elements/input.svelte';
	import { editWebhooks as editWebhook, getWebhookDetails } from '$lib/code/api';
	import Warning from '$lib/components/elements/warning.svelte';
	import { messageFormats, type IEditWebhook, type IWebhook, convertRawHeaderInput, convertToRawHeaderInput, isRawHeaderInputValid } from '$lib/code/webhook';
	import HttpHeaderSelector from '$lib/components/webhooks/httpHeaderSelector.svelte';
	import TriggerSelector from '$lib/components/webhooks/triggerSelector.svelte';

	let webhookId: string;
	let name: string = '';
	let url: string = '';
	let messageFormat: number;
	let enabled: boolean = false;
	let headersRawInput: string;
	let optionalHeaders: any = [];
	let webhookTriggers: string[] = [];

	let originalName: string = '';
	let showError: boolean;
	let errorMessage: string;
	let areButtonsDisabled: boolean = true;
	let isCollapsed: boolean = true;

	onMount(async () => {
		load();
	});

	function load() {
		webhookId = get(selectedPageProps) ?? '';
		getWebhook(webhookId);
	}

	function getWebhook(webhookId: string) {
		getWebhookDetails(webhookId, (wasSuccess: boolean, webhook: IWebhook) => {
			if (!wasSuccess) {
				showError = true;
				errorMessage = 'Unable to load this page, does the webhook exist?';
			} else {
				name = webhook.name;
				url = webhook.url;
				enabled = webhook.enabled;
				messageFormat = webhook.messageFormat;
				webhookTriggers = webhook.webhookTriggers;
				optionalHeaders = webhook.optionalHeaders;
				headersRawInput = convertToRawHeaderInput(optionalHeaders);

				isCollapsed = optionalHeaders.values?.length <= 0 ?? false;
			}
		});
	}

	function updateWebhook() {
		if (!isRawHeaderInputValid(headersRawInput)) {
			confirm(`The provided format of the headers are invalid, please check the format and try again.`);
			return;
		}

		let updatedWebhook: IEditWebhook = {
			name: name,
			url: url,
			enabled: enabled,
			messageFormat: messageFormat,
			webhookTriggers: webhookTriggers,
			optionalHeaders: convertRawHeaderInput(headersRawInput)
		};

		editWebhook(webhookId, updatedWebhook, (wasSuccess: boolean) => {
			if (wasSuccess) {
				confirm(`Webhook: '${updatedWebhook.name}' was successfully edited.`);
				navigateBack();
			} else {
				showError = true;
				errorMessage = `Failed to save changes for webhook: '${updatedWebhook.name}'.`;
			}
		});
	}

	function handleInputChange() {
		areButtonsDisabled = false;
	}

	function navigateBack() {
		navigateToPage(Page.Webhooks);
	}
</script>

<svelte:head>
	<title>MCSS Remote Panel | Edit Webhook</title>
</svelte:head>

<section class="h-[calc(100vh-56px)] overflow-auto p-6 dark:bg-gray-900 dark:text-white">
	<Breadcrumb
		icon={mdiWebhook}
		items={[
			{ name: 'Webhooks', page: Page.Webhooks, isClickable: true },
			{ name: 'Edit', page: Page.Empty, isClickable: false }
		]}
	/>

	<PageTitleBanner title="Edit Webhook" caption="You are modifying webhook: '{originalName}'." />

	{#if showError}
		<Warning message={errorMessage} />
	{/if}

	<form on:submit|preventDefault={updateWebhook} class="space-y-3">
		<BoxedContainer class="space-y-3">
			<Input bind:value={name} on:input={handleInputChange} label={'Name'} type={'text'} placeholder={'Webhook name'} required={true} />
			<Input bind:value={url} on:input={handleInputChange} label={'URL'} type={'url'} required={true} />

			<Label>
				Message Format
				<Select bind:value={messageFormat} on:change={handleInputChange} items={messageFormats} class="mt-2" />
			</Label>
		</BoxedContainer>

		<BoxedContainer class="space-y-3">
			<HttpHeaderSelector bind:headersRawInput {isCollapsed} on:update={handleInputChange} />
		</BoxedContainer>

		<BoxedContainer>
			<TriggerSelector bind:selectedTriggers={webhookTriggers} on:update={handleInputChange} />
		</BoxedContainer>

		<BoxedContainer class="space-y-4">
			<div>
				<Toggle bind:value={enabled} on:toggle={handleInputChange} label={'Enabled'} />
				<p class=" text-sm text-gray-500 dark:text-gray-400">You can choose to temporarily enable/disable webhooks.</p>
			</div>
		</BoxedContainer>

		<div class="flex space-x-3">
			<Button type="submit" disabled={areButtonsDisabled} color="blue">
				<Icon data={mdiContentSave} class="mr-2 -ml-1" />Save Webhook
			</Button>
			<Button type="button" disabled={areButtonsDisabled} on:click={navigateBack} color="alternative">
				<Icon data={mdiArrowULeftTop} class="mr-2 -ml-1" />Cancel
			</Button>
		</div>
	</form>
</section>
