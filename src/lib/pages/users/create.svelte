<script lang="ts">
	import { mdiAccountMultiple, mdiAccountPlus, mdiCheck, mdiClose } from '@mdi/js';
	import { fetchPanelUsers } from '$lib/code/api';
	import Icon from '$lib/components/icon.svelte';
	import { navigateToPage } from '$lib/code/routing';
	import Spinner from '$lib/components/spinner.svelte';
	import PageTitleBanner from '$lib/components/page/pageTitleBanner.svelte';
	import { Toggle } from 'flowbite-svelte';
	import Breadcrumb from '$lib/components/breadcrumb.svelte';
	import { Page, type BreadcrumbItem } from '../../../types';

	// @ts-ignore
	const version: string = __VERSION__;

	let isLoading = true;
</script>

<svelte:head>
	<title>MCSS Remote Panel | Users Overview</title>
</svelte:head>

<section class="min-h-screen dark:bg-gray-900 dark:text-white">
	<div class="relative overflow-x-auto shadow-md">
		<Breadcrumb
			icon={mdiAccountMultiple}
			items={[
				{ name: 'Users', page: Page.Users, isClickable: true },
				{ name: 'Create', page: Page.Empty, isClickable: false }
			]}
		/>

		<PageTitleBanner title="Add User" caption="Create a new user for the remote web panel." />

		<form class="space-y-6">
			<div class="">
				<label for="username" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
				<input
					type="username"
					id="username"
					class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
					placeholder="name@flowbite.com"
					required
				/>
			</div>
			<div class="">
				<label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
				<input
					type="password"
					id="password"
					class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
					required
				/>
			</div>

			<div class="space-y-3">
				<Toggle>Assign admin rights</Toggle>
				<p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Give this user management permission (does not override server access & perms).</p>
				<!--TODO make URL library-->
				<a href="https://docs.mcserversoft.com/API/admin" target="_blank" rel="noopener noreferrer" />
			</div>

			<div class="space-y-3">
				<Toggle checked={true}>Enabled</Toggle>
				<p class="mt-2 text-sm text-gray-500 dark:text-gray-400">You can choose to temporarily enable/disable this user account.</p>
			</div>

			<button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
		</form>
	</div>
</section>
