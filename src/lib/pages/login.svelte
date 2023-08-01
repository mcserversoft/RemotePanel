<script lang="ts">
	import { login, LoginFailureReason } from '$lib/code/auth';
	import FormError from '$lib/components/formError.svelte';
	import Logo from '$lib/components/elements/logo.svelte';
	import { Accordion, AccordionItem } from 'flowbite-svelte';
	import Input from '$lib/components/elements/input.svelte';
	import PeekableInput from '$lib/components/elements/peekableInput.svelte';

	interface Error {
		visible: boolean;
		title: string;
		message: string;
	}

	let error: Error = {
		visible: false,
		title: '',
		message: ''
	};

	let username: string;
	let password: string;

	function onLogin() {
		login(username, password, (failureReason: LoginFailureReason) => {
			switch (failureReason) {
				case LoginFailureReason.Unauthorized:
					showError('Unauthorized', 'Your username and/or password are not correct.');
					break;
				case LoginFailureReason.Network:
					showError('Network', 'Unable to reach the API.');
					break;

				default:
					showError('Unknown', 'Failed to login for some unknown reason.');
					break;
			}
		});
	}

	function showError(title: string, message: string) {
		error.visible = true;
		error.title = title;
		error.message = message;
	}
</script>

<svelte:head>
	<title>MCSS Remote Panel | Login</title>
</svelte:head>

<section class="h-screen bg-login-background bg-cover bg-blend-color-dodge bg-zinc-800">
	<div class="container mx-auto max-w-md h-full">
		<div class="flex flex-col place-content-center h-full text-white">
			<div class="p-10 rounded-xl sm:bg-mcss-gray">
				<Logo className="mx-auto mb-8" width="96" height="96" />
				<p class="mb-4 text-xl text-center font-semibold">Remote Login</p>

				<form on:submit|preventDefault={onLogin}>
					<div class="mb-3">
						<Input bind:value={username} label={'Username'} type={'text'} required={true} />
					</div>

					<div class="mb-6">
						<PeekableInput bind:value={password} label={'Password'} required={true} />
					</div>

					<button type="submit" class="w-full text-white bg-mcss-green hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Login</button>

					{#if error.visible}
						<FormError title={error.title} message={error.message} />
					{/if}

					<Accordion flush>
						<AccordionItem class="!text-gray-400" defaultClass="flex items-center justify-between w-full font-medium text-left group-first:rounded-t-xl">
							<span slot="header" class="!text-gray-400">How do I create an account?</span>

							<div class=" text-gray-300 text-center">
								<p>Accounts can be created in the Web Panel section of MC Server Soft.</p>
								<a href="https://docs.mcserversoft.com/webpanel/users" target="_blank" rel="noopener noreferrer" class="text-mcss-green">View documentation</a>
							</div>
						</AccordionItem>
					</Accordion>
				</form>
			</div>
		</div>
	</div>
</section>
