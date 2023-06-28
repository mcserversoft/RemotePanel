<script lang="ts">
	import { mdiAccountMultiple, mdiEye, mdiRefreshCircle } from '@mdi/js';
	import Icon from '$lib/components/elements/icon.svelte';
	import PageTitleBanner from '$lib/components/page/pageTitleBanner.svelte';
	import Breadcrumb from '$lib/components/navigation/breadcrumb.svelte';
	import { Page, type ICustomServerPermission, type NewPanelUser } from '../../../types';
	import { Url, getUrl } from '$lib/code/urlLibrary';
	import { getRandomPassword } from '$lib/code/shared';
	import ServerPermSelector from '$lib/components/server/serverPermSelector.svelte';
	import { createPanelUser } from '$lib/code/api';
	import { navigateToPage } from '$lib/code/routing';

	let customServerPermissions: Record<string, Partial<ICustomServerPermission>>;
	let isCustomServerSelected: boolean;

	let username: string;
	let password: string;
	let isAdmin: boolean = false;
	let isEnabled: boolean = true;

	let showPassword: boolean = false;
	$: type = showPassword ? 'text' : 'password';

	function generateRandomPassword() {
		password = getRandomPassword();
	}

	function toggleViewPassword() {
		showPassword = !showPassword;
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
		<div class="">
			<label for="username" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
			<input
				bind:value={username}
				type="username"
				id="username"
				class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
				placeholder="Username"
				required
			/>
		</div>

		<div class="flex flex-col">
			<label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
			<div class="flex">
				<div class="relative w-full">
					<input
						bind:value={password}
						id="password"
						name="password"
						{...{ type }}
						class="border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
						placeholder="••••••••••••••••••"
						required
					/>
					<form on:submit|preventDefault={toggleViewPassword}>
						<button type="submit" class="text-gray-300 absolute right-2.5 bottom-2.5">
							<Icon data={mdiEye} />
						</button>
					</form>
				</div>

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
			<label class="relative inline-flex items-center cursor-pointer">
				<input bind:checked={isAdmin} type="checkbox" value="" class="sr-only peer" />
				<div
					class="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
				/>
				<span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Assign admin rights</span>
			</label>

			<p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
				Grant this user
				<a href={getUrl(Url.DocumentationAdminApi)} target="_blank" rel="noopener noreferrer" class="font-medium text-blue-600 dark:text-blue-500 hover:underline"> management permissions</a>. (does not override server access & perms).
			</p>
		</div>

		<div class="space-y-2">
			<!--TODO make this into custom toggle, I don't like the flowbite toggle control-->
			<label class="relative inline-flex items-center cursor-pointer">
				<input bind:checked={isEnabled} type="checkbox" value="" class="sr-only peer" />
				<div
					class="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
				/>
				<span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Enabled</span>
			</label>

			<p class=" text-sm text-gray-500 dark:text-gray-400">You can choose to temporarily enable/disable this user account.</p>
		</div>

		<div class="flex space-x-3">
			<button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add User</button>

			<form on:submit|preventDefault={navigateBack}>
				<button type="submit" class="text-white bg-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
					Cancel
				</button>
			</form>
		</div>
	</form>
</section>
