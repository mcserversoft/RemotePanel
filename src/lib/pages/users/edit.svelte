<script lang="ts">
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { mdiAccountMultiple, mdiAccountPlus, mdiArrowULeftTop, mdiRefreshCircle } from '@mdi/js';
	import Icon from '$lib/components/elements/icon.svelte';
	import PageTitleBanner from '$lib/components/page/pageTitleBanner.svelte';
	import Breadcrumb from '$lib/components/navigation/breadcrumb.svelte';
	import ServerPermSelector from '$lib/components/server/serverPermSelector.svelte';
	import { Page, type IPanelUser, ServerAccessDetails, type INewPanelUser } from '../../../types';
	import { getRandomPassword } from '$lib/code/shared';
	import { getPanelUser } from '$lib/code/api';
	import { navigateToPage, selectedPageProps } from '$lib/code/routing';
	import PeekableInput from '$lib/components/elements/peekableInput.svelte';
	import Toggle from '$lib/components/elements/toggle.svelte';
	import { Button } from 'flowbite-svelte';

	let username: string;
	let password: string;
	let passwordConfirm: string;
	let isAdmin: boolean = false;
	let isEnabled: boolean = true;
	let isCustomServerSelected: boolean = false;
	let serverAccessDetails: ServerAccessDetails = new ServerAccessDetails();

	onMount(async () => {
		load();
	});

	function load() {
		let userId = get(selectedPageProps) ?? '';
		getUser(userId);
	}

	function getUser(userId: string) {
		getPanelUser(userId, (wasSuccess: boolean, user: IPanelUser) => {
			if (!wasSuccess) {
				confirm(`Unable to load this page, does the user exist?`);
				navigateBack();
			} else {
				username = user.username;
				isAdmin = user.isAdmin;
				isEnabled = user.enabled;
				serverAccessDetails = user.serverAccessDetails;
				isCustomServerSelected = !user.serverAccessDetails.hasAccessToAllServers;
			}
		});
	}

	function updateUser() {
		//TODO updateUser
	}

	function generateRandomPassword() {
		password = passwordConfirm = getRandomPassword();
	}

	function navigateBack() {
		navigateToPage(Page.Users);
	}
</script>

<svelte:head>
	<title>MCSS Remote Panel | Users Overview</title>
</svelte:head>

<section class="h-[calc(100vh-56px)] overflow-auto p-6 dark:bg-gray-900 dark:text-white">
	<Breadcrumb
		icon={mdiAccountMultiple}
		items={[
			{ name: 'Users', page: Page.Users, isClickable: true },
			{ name: 'Edit', page: Page.Empty, isClickable: false }
		]}
	/>

	<PageTitleBanner title="Edit User" caption="You are modifying user: '{username}'." />

	<form on:submit|preventDefault={updateUser} class="space-y-3">
		<div class="flex relative">
			<PeekableInput bind:value={password} label={'Password'} placeholder={'••••••••••••••••••'} required={true} class="mr-12" />
			<div class="absolute bottom-0 right-0">
				<form on:submit|preventDefault={generateRandomPassword}>
					<button type="submit" class="p-2.5 ml-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 focus:ring-2 focus:ring-blue-700 dark:focus:ring-blue-500">
						<Icon data={mdiRefreshCircle} size={5} /> <span class="sr-only">Generate Password</span>
					</button>
				</form>
			</div>
		</div>

		<div class="flex relative">
			<PeekableInput bind:value={passwordConfirm} label={'Confirm password'} placeholder={'••••••••••••••••••'} required={true} />
		</div>

		<div class="py-6">
			<ServerPermSelector {isCustomServerSelected} {serverAccessDetails} />
		</div>

		<div class="flex space-x-2 pb-6">
			<Toggle bind:value={isEnabled} label={'Enabled'} />
			<Toggle bind:value={isAdmin} label={'Admin rights'} />
		</div>

		<div class="flex space-x-3">
			<Button type="submit">
				<Icon data={mdiAccountPlus} class="mr-2 -ml-1" />Save User
			</Button>
			<Button type="button" on:click={navigateBack} color="alternative">
				<Icon data={mdiArrowULeftTop} class="mr-2 -ml-1" />Cancel
			</Button>
		</div>
	</form>
</section>
