<script lang="ts" context="module">
	export const prerender = true;
</script>

<script type="ts">
	import { browser } from "$app/env";
	import { Router } from "$lib/Router.js";
	import { auth } from "$lib/store.js";
	import FormError from "../components/FormError.svelte";

	if (browser) {
		console.log("browser");

		auth.subscribe((value) => {
			console.log("sub");

			if (value.apiKey) {
				Router.redirectToPanel();
			}
		});
	}

	interface Error {
		visible: boolean;
		title: string;
		message: string;
	}

	let error: Error = {
		visible: false,
		title: "",
		message: "",
	};

	let username: string;
	let password: string;

	async function handleOnSubmit() {
		console.log(username);

		const request = new Request(`/auth`, {
			method: `POST`,
			body: JSON.stringify({ username: username, password: password }),
		});

		await fetch(request).then((response) => {
			console.log(response);
			try {
				if (response.status === 200) {
					response.json().then((result) => {
						// hideError();

						auth.set({
							apiKey: result[`apiKey`],
							username: result[`username`],
						});
					});
					return;
				} else if (response.status === 401) {
					showError(``, `Your username and/or password are not correct.`);
				} else if (response.status === 500) {
					showError(``, `Unable to reach the API.`);
				} else {
					showError(``, `Unable to reach the API.`);
				}
			} catch (error) {
				showError(``, `Failed to login for some unknown reason.`);
			}
		});
	}

	function showError(title: string, message: string) {
		error.visible = true;
		error.title = title;
		error.message = message;
	}

	function hideError() {
		error.visible = false;
	}
</script>

<svelte:head>
	<title>MCSS Remote Panel | Login</title>
	<!-- <meta name="description" content="Svelte demo app" /> -->
</svelte:head>

<section class="h-screen bg-login-background bg-cover bg-blend-color-dodge bg-zinc-800">
	<div class="container mx-auto max-w-md h-full">
		<div class="flex flex-col place-content-center h-full text-white">
			<div class="p-10 rounded-xl bg-mcss-gray">
				<p class="mb-4 text-xl text-center font-semibold">Remote Login</p>
				<img src="/logo.png" alt="" class="mx-auto mb-8 " />
				<form on:submit|preventDefault={handleOnSubmit}>
					<div class="mb-6">
						<input bind:value={username} required id="username" name="username" type="text" class="form-control block w-full px-4 py-2 text-sm text-white bg-gray-700 bg-clip-padding  rounded" placeholder="Username" />
					</div>

					<div class="mb-6">
						<input bind:value={password} required id="password" name="password" type="password" class="form-control block w-full px-4 py-2 text-sm text-white bg-gray-700 bg-clip-padding  rounded" placeholder="Password" />
					</div>

					<button
						type="submit"
						class="inline-block px-7 py-3 bg-mcss-green text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-mcss-dark-green hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0  active:shadow-lg transition duration-150 ease-in-out w-full"
						data-mdb-ripple="true"
						data-mdb-ripple-color="light"
					>
						Login
					</button>
				</form>

				{#if error.visible}
					<FormError title={error.title} message={error.message} />
				{/if}
			</div>
		</div>
	</div>
</section>
