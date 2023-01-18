<script type="ts">
	import { login, LoginFailureReason } from '$lib/code/auth';
	import FormError from '$lib/components/formError.svelte';
	import Logo from '$lib/svgs/Logo.svelte';
	import { PanelTheme } from '../../types';
	import { AccordionItem, Accordion, Button, Label, Input, Tooltip } from 'flowbite-svelte';
	import { mdiAccount, mdiLockAlert, mdiWeatherSunny } from '@mdi/js';
	import Icon from '$lib/components/icon.svelte';
	import ThemeToggler from '$lib/components/themeToggler.svelte';

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

<section class="bg-gray-50 dark:bg-gray-900 min-h-screen">
	<div class="flex justify-end p-5">
		<ThemeToggler />
	</div>

	<div class="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
		<Logo className="mx-auto mb-4" width="96" height="96" />
		<p class="mb-8 text-center text-2xl font-semibold dark:text-white">MC Server Soft Remote</p>

		<div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
			<div class="p-6 space-y-4 md:space-y-6 sm:p-8">
				<h1 class="text-center text-xl font-bold leading-tight tracking-tight md:text-2xl dark:text-white">Log in to your account</h1>
				<form on:submit|preventDefault={onLogin} class="space-y-4 md:space-y-6">
					<div>
						<Label for="username" class="mb-2">Username</Label>
						<Input bind:value={username} type="text" id="username" placeholder="Username" required />
					</div>

					<div>
						<Label for="password" class="mb-2">Password</Label>
						<Input bind:value={password} type="password" id="password" placeholder="•••••••••" required />
					</div>

					<Button type="submit" class="w-full" color="primary">Log in</Button>

					{#if error.visible}
						<FormError title={error.title} message={error.message} />
					{/if}

					<p class="text-center text-lg font-medium text-gray-500 dark:text-gray-400">FAQ</p>
					<Accordion>
						<AccordionItem>
							<span slot="header" class="text-base flex gap-2">
								<Icon data={mdiAccount} />
								<span>How do I create an account?</span>
							</span>

							<p>Accounts can be created and edited in the Web Panel section of MC Server Soft.</p>
							<a href="https://docs.mcserversoft.com/webpanel/users" target="_blank" rel="noopener noreferrer" class="text-primary-600 dark:text-primary-500 hover:underline">View documentation</a>
						</AccordionItem>
						<AccordionItem>
							<span slot="header" class="text-base flex gap-2">
								<Icon data={mdiLockAlert} />
								<span>What is this SSL warning? Is this safe?</span>
							</span>

							<p class="mb-2 dark:text-gray-400">Yes it's safe, this self-signed certificates provides a secure connection to the panel even though it is not issued by a trusted third-party certificate authority.</p>
							<p class="mb-2 dark:text-gray-400">While browsers and other software may not recognize it as trusted by default, it still encrypt and decrypt data transmitted between the website and you.</p>

							<p class="mb-2 dark:text-gray-400">To remove the warning, you can:</p>
							<ul class="list-disc list-inside">
								<li>Trust the certificate</li>
								<li>Setup a reverse proxy</li>
								<li>Use <a href="https://mcss.app" target="_blank" rel="noopener noreferrer" class="text-primary-600 dark:text-primary-500  hover:underline">mcss.app</a></li>
							</ul>
						</AccordionItem>
					</Accordion>
				</form>
			</div>
		</div>
	</div>
</section>
