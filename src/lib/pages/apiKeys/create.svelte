<script lang="ts">
	import { mdiArrowULeftTop, mdiKeyChainVariant, mdiKeyVariant } from '@mdi/js';
	import Icon from '$lib/components/elements/icon.svelte';
	import PageTitleBanner from '$lib/components/page/pageTitleBanner.svelte';
	import Breadcrumb from '$lib/components/navigation/breadcrumb.svelte';
	import ServerPermSelector from '$lib/components/server/serverPermSelector.svelte';
	import { Page, ServerAccessDetails, type INewApiKey } from '../../../types';
	import { Url, getUrl } from '$lib/code/urlLibrary';
	import { createApiKey } from '$lib/code/api';
	import { navigateToPage } from '$lib/code/routing';
	import Input from '$lib/components/elements/input.svelte';
	import Toggle from '$lib/components/elements/toggle.svelte';
	import { Button } from 'flowbite-svelte';
	import BoxedContainer from '$lib/components/elements/boxedContainer.svelte';
	import OpenInNewTab from '$lib/components/elements/openInNewTab.svelte';

	let name: string;
	let isAdmin: boolean = false;
	let hasAccessToAllServers: boolean = true;
	let serverAccessDetails: ServerAccessDetails = new ServerAccessDetails();

	function createKey() {
		let newApiKey: INewApiKey = {
			name: name,
			isAdmin: isAdmin,
			hasAccessToAllServers: hasAccessToAllServers,
			serverAccessDetails: serverAccessDetails
		};

		createApiKey(newApiKey, (wasSuccess: boolean, plainApiKey: string) => {
			if (wasSuccess) {
				navigateToPage(Page.ApiKeysCreated, plainApiKey);
			} else {
				confirm(`Failed to create API Key '${name}'.`);
			}
		});
	}

	function navigateBack() {
		navigateToPage(Page.ApiKeysOverview);
	}
</script>

<svelte:head>
	<title>MCSS Remote Panel | Add API Key</title>
</svelte:head>

<section class="h-[calc(100vh-56px)] overflow-auto p-6 dark:bg-gray-900 dark:text-white">
	<Breadcrumb
		icon={mdiKeyChainVariant}
		items={[
			{ name: 'API Keys', page: Page.ApiKeysOverview, isClickable: true },
			{ name: 'Create', page: Page.Empty, isClickable: false }
		]}
	/>

	<PageTitleBanner title="Add API Key" caption="Create a new API Key for accessing the Remote API." />

	<form on:submit|preventDefault={createKey} class="space-y-3">
		<BoxedContainer class="space-y-3">
			<Input bind:value={name} label={'Name'} type={'text'} placeholder={'discord-bot-key'} required={true}>A name helps to identify this key from other deployed keys.</Input>
		</BoxedContainer>

		<BoxedContainer>
			<ServerPermSelector {serverAccessDetails}>Set what servers & permissions this API Key will be able to use.</ServerPermSelector>
		</BoxedContainer>

		<BoxedContainer>
			<Toggle bind:value={isAdmin} label={'Assign admin rights'}>
				Grant this API Key
				<OpenInNewTab url={getUrl(Url.DocumentationAdminApi)} text={'management permissions'} inline={true} /> (does not override server access & perms).
			</Toggle>
		</BoxedContainer>

		<div class="flex space-x-3">
			<Button type="submit" color="blue">
				<Icon data={mdiKeyVariant} class="mr-2 -ml-1" />Create API Key
			</Button>
			<Button type="button" on:click={navigateBack} color="alternative">
				<Icon data={mdiArrowULeftTop} class="mr-2 -ml-1" />Cancel
			</Button>
		</div>
	</form>
</section>
