<script lang="ts" context="module">
	export const prerender = true;
</script>

<script type="ts">
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
		const request = new Request(`/auth`, { method: `POST`, body: JSON.stringify({ username: username, password: password }) });
		await fetch(request).then((response) => {
			console.log(response);
			try {
				if (response.status === 200) {
					response.json().then((result) => {
						hideError();
						console.log(result);
						JSON.stringify(result);
						localStorage.setItem(`apiKey`, result[`apiKey`]);
						localStorage.setItem(`username`, result[`username`]);
						window.location.href = "/panel.html";
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
			// showBusyIndicator(false);
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

<section class="w-full max-w-sm p-6 m-auto bg-white rounded-md shadow-md dark:bg-gray-800">
	<h1 class="text-3xl font-semibold text-center text-gray-700 dark:text-white">Brand</h1>

	<form on:submit|preventDefault={handleOnSubmit} class="mt-6">
		<div>
			<label for="username" class="block text-sm text-gray-800 dark:text-gray-200">Username</label>
			<input
				bind:value={username}
				required
				id="username"
				type="text"
				name="username"
				class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
			/>
		</div>

		<div class="mt-4">
			<label for="password" class="block text-sm text-gray-800 dark:text-gray-200">Password</label>
			<input
				bind:value={password}
				required
				id="password"
				type="password"
				name="password"
				class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
			/>
		</div>
		{#if error.visible}
			<div class="flex w-full max-w-sm mx-auto mt-4 overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
				<div class="flex items-center justify-center w-12 bg-red-500">
					<svg class="w-6 h-6 text-white fill-current" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M20 3.36667C10.8167 3.36667 3.3667 10.8167 3.3667 20C3.3667 29.1833 10.8167 36.6333 20 36.6333C29.1834 36.6333 36.6334 29.1833 36.6334 20C36.6334 10.8167 29.1834 3.36667 20 3.36667ZM19.1334 33.3333V22.9H13.3334L21.6667 6.66667V17.1H27.25L19.1334 33.3333Z"
						/>
					</svg>
				</div>

				<div class="px-4 py-2 -mx-3">
					<div class="mx-3">
						<span class="font-semibold text-red-500 dark:text-red-400">{error.title}</span>
						<p class="text-sm text-gray-600 dark:text-gray-200">{error.message}</p>
					</div>
				</div>
			</div>
		{/if}

		<div class="mt-6">
			<button type="submit" class="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600">Login</button>
		</div>
	</form>

	<p class="mt-8 text-xs font-light text-center text-gray-400">New accounts can be created from the mcss settings.</p>
</section>
