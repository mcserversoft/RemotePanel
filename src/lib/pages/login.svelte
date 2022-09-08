<script type="ts">
	import { login } from '$lib/auth';
	import { baseUrl } from '$lib/routing';
	import FormError from '$lib/components/formError.svelte';
	import Logo from '$lib/svgs/Logo.svelte';

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

	async function handleOnSubmit() {
		const request = new Request(`${baseUrl}/auth`, {
			method: `POST`,
			body: JSON.stringify({ username: username, password: password })
		});

		await fetch(request)
			.then((response) => {
				if (response.status === 200) {
					return response.json();
				}
				return Promise.reject(response);
			})
			.then((data) => {
				login(data[`apiKey`], data[`username`]);
			})
			.catch((error) => {
				// 401 -> unauthorized || undefined -> because of false CORS warnings
				// if (error.status === 401 || error.status === undefined) {
				if (error.status === 401) {
					showError(`Unauthorized`, `Your username and/or password are not correct.`);
				} else if (error.status === 500) {
					showError(`Unkown`, `Failed to login for some unknown reason.`);
				} else {
					showError(`Network`, `Unable to reach the API.`);
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
	<meta name="description" content="Remote Panel for MC Server Soft" />
</svelte:head>

<section class="h-screen bg-login-background bg-cover bg-blend-color-dodge bg-zinc-800">
	<div class="container mx-auto max-w-md h-full">
		<div class="flex flex-col place-content-center h-full text-white">
			<div class="p-10 rounded-xl sm:bg-mcss-gray">
				<Logo className="mx-auto mb-8" width="96" height="96" />
				<p class="mb-4 text-xl text-center font-semibold">Remote Login</p>

				<form on:submit|preventDefault={handleOnSubmit}>
					<div class="form-control mb-3">
						<label class="label" for="username">
							<span class="label-text">Username</span>
						</label>
						<input bind:value={username} required id="username" name="username" type="text" placeholder="" class="input input-bordered " />
					</div>

					<div class="form-control mb-6">
						<label class="label" for="password">
							<span class="label-text">Password</span>
						</label>
						<input bind:value={password} required id="password" name="password" type="password" placeholder="" class="input input-bordered " />
					</div>

					<button type="submit" class="btn btn-primary btn-block mb-3"> Login </button>
					{#if error.visible}
						<FormError title={error.title} message={error.message} />
					{/if}

					<div class="collapse text-center">
						<input type="checkbox" />
						<div class="collapse-title text-gray-400 px-0">How do I create an account?</div>
						<div class="collapse-content text-gray-300">
							<p>Accounts can be created/edited in the Web Panel section of MC Server Soft.</p>
							<a href="https://docs.mcserversoft.com/webpanel/users" target="_blank" rel="noopener noreferrer" class="link link-primary">View documentation</a>
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>
</section>
