<script lang="ts">
	import Icon from '$lib/components/elements/icon.svelte';
	import { auth } from '$lib/code/auth';
	import Toggle from '$lib/components/elements/toggle.svelte';
	import { Button } from 'flowbite-svelte';
	import { mdiContentSave, mdiPencil, mdiRefreshCircle, mdiLoading, mdiClose } from '@mdi/js';
	import PeekableInput from '$lib/components/elements/peekableInput.svelte';
	import { getRandomPassword, getShortDateSince } from '$lib/code/shared';
	import NewIndicator from '$lib/components/elements/newIndicator.svelte';
	import { deleteUserAccount, editUserAccount, uploadUserAvatar } from '$lib/code/api';
	import AvatarPicker from '$lib/components/elements/avatarPicker.svelte';
	import { getURLToCurrentUserAvatar as getURLToCurrentUserAvatar } from '$lib/code/urlLibrary';
	import BoxedContainer from '$lib/components/elements/boxedContainer.svelte';
	import type { IDeleteUserAccount, IEditUserAccount } from '$lib/code/user';

	let password: string = '';
	let newPassword: string = '';
	let newPasswordConfirm: string = '';

	let showAvatarUpload: boolean = false;
	let isLoadingAvatar: boolean = false;
	let isFlaggedForDeletion: boolean = false;
	let isPasswordRequired: boolean = false;
	let areButtonsDisabled: boolean = true;

	$: {
		isPasswordRequired = !isFlaggedForDeletion;
	}

	function handleDeleteClick() {
		//HACK this event is raised by a click event, this happens before isFlaggedForDeletion is updated, that's why we're adding a delay here to let that update first
		setTimeout(() => {
			handleInputChange();
		}, 100);
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

	function handleUpdateAccount() {
		let updatedAccount: IEditUserAccount = {
			password: password,
			newPassword: newPassword,
			newPasswordRepeat: newPasswordConfirm
		};

		editUserAccount(updatedAccount, (wasSuccess: boolean) => {
			if (wasSuccess) {
				handleFormReset();
				confirm(`Successfully updated account settings.`);
			} else {
				confirm(`Failed to save account settings, see logs.`);
			}
		});
	}

	function handleDeleteAccount() {
		let toDeleteAccount: IDeleteUserAccount = {
			password: password,
			confirm: isFlaggedForDeletion
		};

		deleteUserAccount(toDeleteAccount, (wasSuccess: boolean) => {
			if (wasSuccess) {
				handleFormReset();
				confirm(`Your account was deleted.`);
			} else {
				confirm(`Failed to delete account, see logs.`);
			}
		});
	}

	function handleAvatarUploadToggle() {
		showAvatarUpload = !showAvatarUpload;
	}

	function avatarPickComplete(e: CustomEvent) {
		showAvatarUpload = false;
		isLoadingAvatar = true;

		let base64 = e.detail;

		uploadUserAvatar(base64, (wasSuccess: boolean) => {
			if (wasSuccess) {
				// timeout to show animation
				setTimeout(function () {
					isLoadingAvatar = false;
					location.reload();
				}, 1000);
			} else {
				isLoadingAvatar = false;
				confirm(`Failed to upload avatar, see logs.`);
			}
		});
	}
	function avatarPickCanceled() {
		showAvatarUpload = false;
	}

	function generateRandomPassword() {
		newPassword = newPasswordConfirm = getRandomPassword();
		handleInputChange();
	}
</script>

<svelte:head>
	<title>MCSS Remote Panel | Account</title>
</svelte:head>

<section class="h-[calc(100vh-56px)] overflow-auto p-6 dark:bg-gray-900 py-12">
	<div class="text-center">
		<h1 class="text-3xl font-bold pb-1">Account Settings</h1>
		<p class="italic">View or adjust your avatar and other account-related details. <NewIndicator /></p>
	</div>

	<form on:submit|preventDefault={isFlaggedForDeletion ? handleDeleteAccount : handleUpdateAccount} class="max-w-3xl mx-auto my-6">
		<div class="mb-6">
			<BoxedContainer>
				<div class="flex items-center space-x-4">
					<form on:submit|preventDefault={handleAvatarUploadToggle}>
						<button type="submit" disabled={isLoadingAvatar}>
							<div class="relative">
								<img class="w-16 h-16 rounded-full" src={getURLToCurrentUserAvatar()} alt="user avatar" />
								<Icon class="-bottom-1 left-10 absolute w-4 h-4 p-1.5 text-white bg-blue-600 border-2 border-white dark:border-gray-800  rounded-full {isLoadingAvatar ? 'animate-spin' : ''}" data={isLoadingAvatar ? mdiLoading : mdiPencil} size={8} />
							</div>
						</button>
					</form>
					<div class="font-medium">
						<div>{$auth.username}</div>
						<div class="text-sm text-gray-500 dark:text-gray-400">{isFlaggedForDeletion ? 'May the odds be ever in your favor.' : `Joined in ${getShortDateSince($auth.userJoinDate)}`}</div>
					</div>
				</div>
				{#key showAvatarUpload}
					{#if showAvatarUpload}
						<div class="mt-6">
							<AvatarPicker on:cropped={avatarPickComplete} on:canceled={avatarPickCanceled} />
						</div>
					{/if}
				{/key}
			</BoxedContainer>

			<BoxedContainer>
				<PeekableInput bind:value={password} on:input={handleInputChange} label={'Current Password'} placeholder={'••••••••••••••••••'} required={true} class="" />

				{#key isFlaggedForDeletion}
					{#if !isFlaggedForDeletion}
						<div class="flex relative mt-6 mb-6">
							<PeekableInput bind:value={newPassword} on:input={handleInputChange} label={'Password'} placeholder={'••••••••••••••••••'} required={isPasswordRequired} class="mr-12" />
							<div class="absolute bottom-0 right-0">
								<form on:submit|preventDefault={generateRandomPassword}>
									<button type="submit" class="p-2.5 ml-2 text-sm font-medium bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 focus:ring-2 focus:ring-blue-700 dark:focus:ring-blue-500">
										<Icon data={mdiRefreshCircle} size={5} /> <span class="sr-only">Generate Password</span>
									</button>
								</form>
							</div>
						</div>

						<PeekableInput bind:value={newPasswordConfirm} on:input={handleInputChange} label={'Confirm password'} placeholder={'••••••••••••••••••'} required={isPasswordRequired} />
					{/if}
				{/key}
			</BoxedContainer>

			<BoxedContainer class="bg-red-50 border-red-200 dark:border-red-700">
				<!-- <Toggle bind:value={isFlaggedForDeletion} on:toggle={handleInputChange} label={'Delete Account'} color={'red'}>This will delete your account & settings. Servers and other data remain unaffected.</Toggle> -->
				<Toggle bind:value={isFlaggedForDeletion} on:toggle={handleDeleteClick} label={'Delete Account'} color={'red'}>This will delete your account & settings. Servers and other data remain unaffected.</Toggle>
			</BoxedContainer>

			<Button type="submit" disabled={areButtonsDisabled} color={isFlaggedForDeletion ? 'red' : 'blue'}>
				<Icon data={mdiContentSave} class="mr-2 -ml-1" />
				{isFlaggedForDeletion ? 'Delete Account' : 'Save'}
			</Button>
			<Button type="button" disabled={areButtonsDisabled} on:click={handleFormReset} color="alternative">
				<Icon data={mdiClose} class="mr-2 -ml-1" /> Discard
			</Button>
		</div>
	</form>
</section>
