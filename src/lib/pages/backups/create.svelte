<script lang="ts">
	import { mdiAccountPlus, mdiCheck, mdiClose } from '@mdi/js';
	import { fetchPanelUsers } from '$lib/code/api';
	import Icon from '$lib/components/elements/icon.svelte';
	import { navigateToPage } from '$lib/code/routing';
	import { Page } from '../../../types';
	import Spinner from '$lib/components/elements/spinner.svelte';
	import PageTitleBanner from '$lib/components/page/pageTitleBanner.svelte';
	import { Toggle } from 'flowbite-svelte';
	import Breadcrumb from '$lib/components/navigation/breadcrumb.svelte';

	let isLoading = true;

	function createBackup() {
		console.log('create backup');
	}
</script>

<svelte:head>
	<title>MCSS Remote Panel | Backups Overview</title>
</svelte:head>

<!-- <section class="pt-1 min-h-screen dark:bg-gray-900 dark:text-white"> -->
<section class="min-h-screen dark:bg-gray-900 dark:text-white">
	<div class="relative overflow-x-auto shadow-md">
		<div class="mt-9">
			<Breadcrumb />
		</div>

		<PageTitleBanner title="Add User" caption="Create a new user for the remote web panel." />

		<form on:submit|preventDefault={createBackup} class="space-y-6">
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
				<Toggle checked={true}>Enabled</Toggle>
				<p class="mt-2 text-sm text-gray-500 dark:text-gray-400">You can choose to temporarily enable/disable this user account.</p>
			</div>

			<button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"> Submitss </button>
		</form>
	</div>
</section>
