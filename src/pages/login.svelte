<script type="ts">
	import { auth } from "$lib/store.js";
	import FormError from "../components/FormError.svelte";

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
		const request = new Request(`https://localhost:2096/auth`, {
			//const request = new Request(`/auth`, {
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
				auth.set({
					apiKey: data[`apiKey`],
					username: data[`username`],
				});
			})
			.catch((error) => {
				// 401 -> unauthorized || undefined -> because of false CORS warnings
				if (error.status === 401 || error.status === undefined) {
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
	<!-- <meta name="description" content="Svelte demo app" /> -->
</svelte:head>

<section class="h-screen bg-login-background bg-cover bg-blend-color-dodge bg-zinc-800">
	<div class="container mx-auto max-w-md h-full">
		<div class="flex flex-col place-content-center h-full text-white">
			<div class="p-10 rounded-xl bg-mcss-gray">
				<p class="mb-4 text-xl text-center font-semibold">Remote Login</p>

				<svg width="96" height="96" class="mx-auto mb-8 " xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2134 2134" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2">
					<path d="M770.279 1681.329l-352.14-616.921 352.14-616.911h704.28l352.14 616.911-352.14 616.921h-704.28z" fill="#1f2e35" fill-rule="nonzero" />
					<g transform="matrix(4.3501 0 0 4.3501 -19.0235 -48.5561)">
						<clipPath id="A">
							<path
								d="M248.557 499C227.84 499 45.461 390.228 38.113 377.5c-9.221-15.971-7.618-229.806 0-243C48.362 116.748 227.84 13.001 248.557 13.001c23.778 0 198.65 101.074 210.443 121.5 12.659 21.927 9.549 226.46 0 242.999C449.509 393.938 267.961 499 248.557 499z"
							/>
						</clipPath>
						<g clip-path="url(#A)" fill-rule="nonzero">
							<path d="M248.557 500.149l85.54-134.09H163.02" fill="#266b59" />
							<path d="M551.4 471.049l-302.843 29.1 149.67-271.715" fill="#7ca740" />
							<path d="M248.557 499l-296.124-35.82 157.25-228.302" fill="#0a3b3a" />
							<path d="M195.683 116.49l-219.971 23.838L-9.701 456.7l205.384-340.21z" fill="#0c6f50" />
							<path d="M38.112 134.65L212.145-37.97l122.952 172.62" fill="#95c83d" />
							<path d="M652.44 30.301L459 377.5 248.557 12.001" fill="#abd037" />
						</g>
					</g>
				</svg>

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
