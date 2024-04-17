<script lang="ts">
	import { mdiArrowULeftTop, mdiWebhook } from '@mdi/js';
	import Icon from '$lib/components/elements/icon.svelte';
	import PageTitleBanner from '$lib/components/page/pageTitleBanner.svelte';
	import Breadcrumb from '$lib/components/navigation/breadcrumb.svelte';
	import { createWebhook } from '$lib/code/api';
	import { Page, navigateToPage } from '$lib/code/routing';
	import Input from '$lib/components/elements/input.svelte';
	import Toggle from '$lib/components/elements/toggle.svelte';
	import { Button, Label, Select } from 'flowbite-svelte';
	import BoxedContainer from '$lib/components/elements/boxedContainer.svelte';
	import { messageFormats, type INewWebhook, getCustomTriggers, convertRawHeaderInput, isRawHeaderInputValid } from '$lib/code/webhook';
	import HttpHeaderSelector from '$lib/components/webhooks/httpHeaderSelector.svelte';
	import TriggerSelector from '$lib/components/webhooks/triggerSelector.svelte';

	let name: string = '';
	let url: string = '';
	let messageFormat: number = 0;
	let headersRawInput: string = '';
	let triggers: string[] = getCustomTriggers();
	let enabled: boolean = true;

	function createNewWebhook() {
		if (!isRawHeaderInputValid(headersRawInput)) {
			confirm(`The provided format of the headers are invalid, please check the format and try again.`);
			return;
		}

		let newWebhook: INewWebhook = {
			name: name,
			url: url,
			enabled: enabled,
			messageFormat: messageFormat,
			webhookTriggers: triggers,
			optionalHeaders: convertRawHeaderInput(headersRawInput)
		};
		createWebhook(newWebhook, (wasSuccess: boolean) => {
			if (wasSuccess) {
				confirm(`Webhook: '${newWebhook.name}' was successfully created.`);
				navigateBack();
			} else {
				confirm(`Failed to create webhook: '${newWebhook.name}'.`);
			}
		});
	}

	function navigateBack() {
		navigateToPage(Page.Webhooks);
	}
</script>

<svelte:head>
	<title>MCSS Remote Panel | Create Webhook</title>
</svelte:head>

<section class="h-[calc(100vh-56px)] overflow-auto p-6 dark:bg-gray-900 dark:text-white">
	<Breadcrumb
		icon={mdiWebhook}
		items={[
			{ name: 'Webhooks', page: Page.Webhooks, isClickable: true },
			{ name: 'Create', page: Page.Empty, isClickable: false }
		]}
	/>

	<PageTitleBanner title="Create Webhook" caption="Create a brand new webhook that will provide other applications with real-time information, delivering data immediately as it happens." />

	<form on:submit|preventDefault={createNewWebhook}>
		<BoxedContainer class="space-y-3">
			<Input bind:value={name} label={'Name'} type={'text'} placeholder={'Webhook name'} required={true} />
			<Input bind:value={url} label={'URL'} type={'url'} required={true} />

			<Label>
				Message Format
				<Select bind:value={messageFormat} items={messageFormats} class="mt-2" />
			</Label>
		</BoxedContainer>

		<BoxedContainer class="space-y-3">
			<HttpHeaderSelector bind:headersRawInput />
		</BoxedContainer>

		<BoxedContainer>
			<TriggerSelector bind:selectedTriggers={triggers} />
		</BoxedContainer>

		<BoxedContainer class="space-y-4">
			<div>
				<Toggle bind:value={enabled} label={'Enabled'} />
				<p class=" text-sm text-gray-500 dark:text-gray-400">You can choose to temporarily enable/disable webhooks.</p>
			</div>
		</BoxedContainer>

		<div class="flex space-x-3">
			<Button type="submit" color="blue">
				<Icon data={mdiWebhook} class="mr-2 -ml-1" />Create Webhook
			</Button>
			<Button type="button" on:click={navigateBack} color="alternative">
				<Icon data={mdiArrowULeftTop} class="mr-2 -ml-1" />Cancel
			</Button>
		</div>
	</form>
</section>
