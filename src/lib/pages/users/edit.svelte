<script lang="ts">
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { mdiAccountMultiple, mdiAccountPlus, mdiArrowULeftTop, mdiRefreshCircle } from '@mdi/js';
	import Icon from '$lib/components/elements/icon.svelte';
	import PageTitleBanner from '$lib/components/page/pageTitleBanner.svelte';
	import Breadcrumb from '$lib/components/navigation/breadcrumb.svelte';
	import ServerPermSelector from '$lib/components/server/serverPermSelector.svelte';
	import { type IPanelUser, ServerAccessDetails, type IEditPanelUser } from '../../../types';
	import { getRandomPassword } from '$lib/code/shared';
	import { editPanelUser, getPanelUser } from '$lib/code/api';
	import { Page, navigateToPage, selectedPageProps } from '$lib/code/routing';
	import PeekableInput from '$lib/components/elements/peekableInput.svelte';
	import Toggle from '$lib/components/elements/toggle.svelte';
	import { Button } from 'flowbite-svelte';
	import BoxedContainer from '$lib/components/elements/boxedContainer.svelte';
	import { Url, getUrl } from '$lib/code/urlLibrary';
	import OpenInNewTab from '$lib/components/elements/openInNewTab.svelte';

	let userId: string;
	let username: string = '';
	let password: string = '';
	let passwordConfirm: string = '';
	let isAdmin: boolean = false;
	let isEnabled: boolean = true;
	let serverAccessDetails: ServerAccessDetails = new ServerAccessDetails();

	let isPasswordRequired: boolean = false;

	$: {
		isPasswordRequired = !(password == '' && passwordConfirm == '');
	}

	onMount(async () => {
		load();
	});

	function load() {
		userId = get(selectedPageProps) ?? '';
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
			}
		});
	}

	function updateUser() {
		let updatedUser: IEditPanelUser = {
			userId: userId,
			password: password,
			passwordRepeat: password,
			isAdmin: isAdmin,
			enabled: isEnabled,
			serverAccessDetails: serverAccessDetails
		};

		editPanelUser(updatedUser, (wasSuccess: boolean) => {
			if (wasSuccess) {
				confirm(`User '${username}' was successfully edited.`);
				navigateBack();
			} else {
				confirm(`Failed to edit user '${username}'.`);
			}
		});
	}

	function generateRandomPassword() {
		password = passwordConfirm = getRandomPassword();
	}

	function navigateBack() {
		navigateToPage(Page.Users);
	}
</script>

<svelte:head>
	<title>MCSS Remote Panel | Edit User</title>
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
		<BoxedContainer class="space-y-3">
			<div class="flex relative">
				<PeekableInput bind:value={password} label={'Password'} placeholder={'••••••••••••••••••'} required={isPasswordRequired} class="mr-12" />
				<div class="absolute bottom-0 right-0">
					<form on:submit|preventDefault={generateRandomPassword}>
						<button type="submit" class="p-2.5 ml-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 focus:ring-2 focus:ring-blue-700 dark:focus:ring-blue-500">
							<Icon data={mdiRefreshCircle} size={5} /> <span class="sr-only">Generate Password</span>
						</button>
					</form>
				</div>
			</div>

			<div class="flex relative">
				<PeekableInput bind:value={passwordConfirm} label={'Confirm password'} placeholder={'••••••••••••••••••'} required={isPasswordRequired} />
			</div>
		</BoxedContainer>

		<BoxedContainer>
			<ServerPermSelector {serverAccessDetails} />
		</BoxedContainer>

		<BoxedContainer>
			<Toggle bind:value={isAdmin} label={'Admin rights'}>
				Grant this user
				<OpenInNewTab url={getUrl(Url.DocumentationAdminApi)} text={'management permissions'} inline={true} /> (does not override server access & perms).
			</Toggle>

			<div class="pt-6">
				<Toggle bind:value={isEnabled} label={'Enabled'} />
				<p class=" text-sm text-gray-500 dark:text-gray-400">You can choose to temporarily enable/disable this user account.</p>
			</div>
		</BoxedContainer>

		<div class="flex space-x-3">
			<Button type="submit" color="blue">
				<Icon data={mdiAccountPlus} class="mr-2 -ml-1" />Save User
			</Button>
			<Button type="button" on:click={navigateBack} color="alternative">
				<Icon data={mdiArrowULeftTop} class="mr-2 -ml-1" />Cancel
			</Button>
		</div>
	</form>
</section>
