<script lang="ts">
	import { mdiAccountMultiple, mdiAccountPlus, mdiCheck, mdiClose } from '@mdi/js';
	import { fetchPanelUsers } from '$lib/code/api';
	import Icon from '$lib/components/elements/icon.svelte';
	import { navigateToPage } from '$lib/code/routing';
	import Spinner from '$lib/components/elements/spinner.svelte';
	import PageTitleBanner from '$lib/components/page/pageTitleBanner.svelte';
	import { Toggle } from 'flowbite-svelte';
	import Breadcrumb from '$lib/components/navigation/breadcrumb.svelte';
	import { Page, type BreadcrumbItem } from '../../../types';
	import { Url, getUrl } from '$lib/code/urlLibrary';

	let isLoading = true;

	function generateRandomPassword() {
		console.log('TODO generateRandomPassword');
	}

	function createUser() {
		console.log('TODO create user');
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
				type="username"
				id="username"
				class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
				placeholder="Username"
				required
			/>
		</div>
		<div class="">
			<label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
			<div class="relative">
				<input
					type="password"
					id="password"
					class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
					placeholder="••••••••••••••••••"
					required
				/>
				<form on:submit|preventDefault={generateRandomPassword}>
					<button type="submit" class="absolute right-[5px] top-[5px] px-3 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
						Generate Password
					</button>
				</form>
			</div>
		</div>

		<!--TODO add server access & perms -->

		<div class="space-y-3">
			<Toggle>Assign admin rights</Toggle>
			<p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
				Grant this user
				<a href={getUrl(Url.DocumentationAdminApi)} target="_blank" rel="noopener noreferrer" class="font-medium text-blue-600 dark:text-blue-500 hover:underline"> management permissions</a>. (does not override server access & perms).
			</p>
		</div>

		<div class="space-y-3">
			<Toggle checked={true}>Enabled</Toggle>
			<p class="mt-2 text-sm text-gray-500 dark:text-gray-400">You can choose to temporarily enable/disable this user account.</p>
		</div>

		<button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"> Add User </button>
	</form>
</section>
