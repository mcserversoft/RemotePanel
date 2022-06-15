<script context="module" lang="ts">
	export const prerender = true;
</script>

<script type="ts">
	// import { browser, dev } from "$app/env";

	// // we don't need any JS on this page, though we'll load
	// // it in dev so that we get hot module replacement...
	// export const hydrate = dev;

	// // ...but if the client-side router is already loaded
	// // (i.e. we came here from elsewhere in the app), use it
	// export const router = browser;

	// // since there's no dynamic data here, we can prerender
	// // it so that it gets served as a static asset in prod
	// export const prerender = true;

	let username: String;
	let password: String;

	function handleOnSubmit() {
		console.log(username);

		const request = new Request(`/auth`, { method: "POST", body: JSON.stringify({ username: username, password: password }) });
		fetch(request).then((response) => {
			console.log(response);
			try {
				if (response.status === 200) {
					response.json().then((result) => {
						// $(".ui.form .ui.input").hide();

						console.log(result);
						JSON.stringify(result);

						localStorage.setItem("apiKey", result["apiKey"]);
						localStorage.setItem("username", result["username"]);

						window.location.href = "/panel.html";
					});
					return;
				} else if (response.status === 401) {
					// showErrorMessage("Your username and/or password are not correct.");
				} else if (response.status === 500) {
					console.log(response.status);
					// showErrorMessage("Unable to reach the API.", response.status);
				} else {
					console.log("API could not be reached, error code: " + response.status);
					// showErrorMessage("Unable to reach the API.", response.status);
				}
			} catch (error) {
				// showErrorMessage("Failed to login for some unknown reason.");
			}
			// showBusyIndicator(false);
		});
	}
</script>

<svelte:head>
	<title>About</title>
	<meta name="description" content="About this app" />
</svelte:head>

<form on:submit|preventDefault={handleOnSubmit} class="ui form">
	<div class="field">
		<div class="ui left icon input">
			<i class="user icon" />
			<input bind:value={username} id="username" type="text" name="username" placeholder="Username" />
		</div>
	</div>
	<div class="field">
		<div class="ui left icon input">
			<i class="lock icon" />
			<input bind:value={password} id="password" type="password" name="password" placeholder="Password" />
		</div>
	</div>
	<button type="submit" class="ui fluid large submit button">Login</button>
	<div class="ui error message" />
</form>
