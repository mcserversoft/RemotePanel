<script lang="ts">
	import Icon from '$lib/components/elements/icon.svelte';
	import { auth } from '$lib/code/auth';
	import Toggle from '$lib/components/elements/toggle.svelte';
	import { Button } from 'flowbite-svelte';
	import { mdiContentSave, mdiArrowULeftTop, mdiPencil, mdiRefreshCircle } from '@mdi/js';
	import type { IEditAccountSettings } from '../../types';
	import PeekableInput from '$lib/components/elements/peekableInput.svelte';
	import { getRandomPassword } from '$lib/code/shared';
	import NewIndicator from '$lib/components/elements/newIndicator.svelte';

	let password: string = '';
	let newPassword: string = '';
	let newPasswordConfirm: string = '';

	let isFlaggedForDeletion: boolean = false;
	let isPasswordRequired: boolean = false;
	let areButtonsDisabled: boolean = true;

	$: {
		isPasswordRequired = !(password == '' && newPassword == '' && newPasswordConfirm == '') && !isFlaggedForDeletion;
	}

	function handleInputChange() {
		if (isFlaggedForDeletion) {
			areButtonsDisabled = isEmpty(password);
			return;
		}

		areButtonsDisabled = isEmpty(password) || isEmpty(newPassword) || isEmpty(newPasswordConfirm) || newPassword != newPasswordConfirm;
	}

	function isEmpty(value: string) {
		return value == null || value.length === 0;
	}

	function handleFormReset() {
		password = '';
		newPassword = '';
		newPasswordConfirm = '';
		isFlaggedForDeletion = false;
		areButtonsDisabled = true;
	}

	function handleUpdateUser() {
		// we don't need this incase filled in
		if (isFlaggedForDeletion) {
			newPassword = '';
			newPasswordConfirm = '';
		}

		let updatedAccount: IEditAccountSettings = {
			currentPassword: password,
			newPassword: newPassword,
			newPasswordRepeat: newPasswordConfirm,
			deleteAccount: isFlaggedForDeletion
		};

		console.log(updatedAccount);

	}

	function generateRandomPassword() {
		newPassword = newPasswordConfirm = getRandomPassword();
		handleInputChange();
	}
</script>

<svelte:head>
	<title>MCSS Remote Panel | Account</title>
</svelte:head>

<section class="h-[calc(100vh-56px)] overflow-auto p-6 dark:bg-gray-900 dark:text-white py-12">
	<div class="text-center">
		<h1 class="text-3xl font-bold pb-1">Account Settings</h1>
		<p class="italic">View or adjust your avatar and other account-related details. <NewIndicator /></p>
	</div>

	<form on:submit|preventDefault={handleUpdateUser} class="max-w-3xl mx-auto my-6">
		<div class="mb-6">
			<div class="rounded-xl my-4 p-6 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
				<div class="flex items-center space-x-4">
					<div class="relative">
						<img class="w-16 h-16 rounded-full" src="fire_avatar.png" alt="" />
						<Icon class="-bottom-1 left-10 absolute w-4 h-4 p-1 bg-blue-600 border-2 border-white dark:border-gray-800 rounded-full" data={mdiPencil} size={8} />
					</div>
					<div class="font-medium dark:text-white">
						<div>{$auth.username}</div>
						<!-- <div class="text-sm text-gray-500 dark:text-gray-400">Joined in August 2014</div> -->
						<div class="text-sm text-gray-500 dark:text-gray-400">Joined in August 2014</div>
					</div>
				</div>
			</div>

			<div class="rounded-xl my-4 p-6 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
				<PeekableInput bind:value={password} on:input={handleInputChange} label={'Current Password'} placeholder={'••••••••••••••••••'} required={isPasswordRequired} class="" />

				{#key isFlaggedForDeletion}
					{#if !isFlaggedForDeletion}
						<div class="flex relative mt-6 mb-6">
							<PeekableInput bind:value={newPassword} on:input={handleInputChange} label={'Password'} placeholder={'••••••••••••••••••'} required={isPasswordRequired} class=" mr-12" />
							<div class="absolute bottom-0 right-0">
								<form on:submit|preventDefault={generateRandomPassword}>
									<button type="submit" class="p-2.5 ml-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 focus:ring-2 focus:ring-blue-700 dark:focus:ring-blue-500">
										<Icon data={mdiRefreshCircle} size={5} /> <span class="sr-only">Generate Password</span>
									</button>
								</form>
							</div>
						</div>

						<PeekableInput bind:value={newPasswordConfirm} on:input={handleInputChange} label={'Confirm password'} placeholder={'••••••••••••••••••'} required={isPasswordRequired} />
					{/if}
				{/key}
			</div>

			<div class="rounded-xl my-4 p-6 dark:bg-gray-900 border border-red-200 dark:border-red-700">
				<Toggle bind:value={isFlaggedForDeletion} on:toggle={handleInputChange} label={'Delete Account'} color={'red'}>This will delete your account & settings. Servers and other data remain unaffected.</Toggle>
			</div>

			<Button type="submit" disabled={areButtonsDisabled} color={isFlaggedForDeletion ? 'red' : 'blue'}>
				<Icon data={mdiContentSave} class="mr-2 -ml-1" />
				{isFlaggedForDeletion ? 'Delete Account' : 'Save'}
			</Button>
			<Button type="button" disabled={areButtonsDisabled} on:click={handleFormReset} color="alternative">
				<Icon data={mdiArrowULeftTop} class="mr-2 -ml-1" /> Revert
			</Button>
		</div>
	</form>
</section>
