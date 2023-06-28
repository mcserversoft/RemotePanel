<script lang="ts">
	import { mdiAccountMultiple, mdiAccountPlus, mdiArrowULeftTop, mdiRefreshCircle } from '@mdi/js';
	import Icon from '$lib/components/elements/icon.svelte';
	import PageTitleBanner from '$lib/components/page/pageTitleBanner.svelte';
	import Breadcrumb from '$lib/components/navigation/breadcrumb.svelte';
	import ServerPermSelector from '$lib/components/server/serverPermSelector.svelte';
	import { Page, type ICustomServerPermission, type NewPanelUser } from '../../../types';
	import { Url, getUrl } from '$lib/code/urlLibrary';
	import { getRandomPassword } from '$lib/code/shared';
	import { createPanelUser } from '$lib/code/api';
	import { navigateToPage } from '$lib/code/routing';
	import Input from '$lib/components/elements/input.svelte';
	import PeekableInput from '$lib/components/elements/peekableInput.svelte';
	import Toggle from '$lib/components/elements/toggle.svelte';
	import { Button } from 'flowbite-svelte';

	let customServerPermissions: Record<string, Partial<ICustomServerPermission>>;
	let isCustomServerSelected: boolean;

	let username: string;
	let password: string;
	let isAdmin: boolean = false;
	let isEnabled: boolean = true;

	function generateRandomPassword() {
		password = getRandomPassword();
	}

	function createUser() {
		// TODO fix bug where perms are all false when only clicking on the server checkbox
		console.log('TODO create user');
		console.log(username);
		console.log(password);
		console.log(isAdmin);
		console.log(isEnabled);
		console.log(customServerPermissions);
		console.log(!isCustomServerSelected);

		let newUser: NewPanelUser = {
			username: username,
			password: password,
			passwordRepeat: password,
			isAdmin: isAdmin,
			enabled: isEnabled,
			hasAccessToAllServers: !isCustomServerSelected,
			customServerPermissions: customServerPermissions
		};

		createPanelUser(newUser, (wasSuccess: boolean) => {
			if (wasSuccess) {
				confirm(`User '${username}' was successfully created.`);
				navigateBack();
			} else {
				confirm(`Failed to create user '${username}'.`);
			}
		});
	}

	function navigateBack() {
		navigateToPage(Page.Users);
	}
</script>

<svelte:head>
	<title>MCSS Remote Panel | Users Overview</title>
</svelte:head>

<section class="min-h-screen dark:bg-gray-900 dark:text-white">
	<Breadcrumb
		icon={mdiAccountMultiple}
		items={[
			{ name: 'Users', page: Page.Users, isClickable: true },
			{ name: 'Create', page: Page.Empty, isClickable: false }
		]}
	/>

	<PageTitleBanner title="Add User" caption="Create a new user for the remote web panel." />

	<form on:submit|preventDefault={createUser} class="space-y-6">
		<Input bind:value={username} label={'Username'} type={'text'} placeholder={'Username'} required={true} />

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

		<div class="py-2">
			<ServerPermSelector bind:customServerPermissions bind:isCustomServerSelected />
		</div>

		<div class="space-y-2">
			<Toggle bind:value={isAdmin} label={'Assign admin rights'}>
				Grant this user
				<a href={getUrl(Url.DocumentationAdminApi)} target="_blank" rel="noopener noreferrer" class="font-medium text-blue-600 dark:text-blue-500 hover:underline"> management permissions</a>. (does not override server access & perms).
			</Toggle>
		</div>

		<div class="space-y-2">
			<Toggle bind:value={isEnabled} label={'Enabled'}>
				<p class=" text-sm text-gray-500 dark:text-gray-400">You can choose to temporarily enable/disable this user account.</p>
			</Toggle>
		</div>

		<div class="flex space-x-3">
			<Button type="submit">
				<Icon data={mdiAccountPlus} class="mr-2 -ml-1" />Create User
			</Button>
			<Button type="button" on:click={navigateBack} color="alternative">
				<Icon data={mdiArrowULeftTop} class="mr-2 -ml-1" />Cancel
			</Button>
		</div>
	</form>
</section>
