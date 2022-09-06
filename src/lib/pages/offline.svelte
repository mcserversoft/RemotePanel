<script type="ts">
    import { get } from "svelte/store";
    import { onDestroy } from "svelte";
    import { browser } from "$app/environment";
	import { baseUrl, isOffline } from "$lib/store.js";
	import ReloadSvg from "$lib/svgs/ReloadSvg.svelte";

	if (browser) {
        const testConnection = setInterval(() => {
            reconnect();
        }, 5000);

        onDestroy(() => clearInterval(testConnection));
    }

	async function reconnect() {
		const request = new Request(`${get(baseUrl)}/`, {
			method: `POST`,
		});

		await fetch(request)
			.then((response) => {
				if (response.status === 200) {
					$isOffline = false;
				}
				return Promise.reject(response);
			});
	}
</script>

<svelte:head>
	<title>MCSS Remote Panel</title>
	<meta name="description" content="Remote Panel for MC Server Soft" />
</svelte:head>

<section class="h-screen bg-login-background bg-cover bg-blend-color-dodge bg-zinc-800">
	<div class="container mx-auto max-w-md h-full">
		<div class="flex flex-col place-content-center h-full text-white">
			<div class="text-center p-10 rounded-xl sm:bg-mcss-gray">
				<p class="text-xl font-semibold uppercase">mcss api <span class="text-red-500 uppercase">offline</span></p>
				<p>Lost connection to the MC Server Soft API.</p>

				<p class="text-gray-400 italic mt-2 mb-1">Trying to restore the connection...</p>
				<ReloadSvg className="animate-spin inline text-gray-400 " />
			</div>
		</div>
	</div>
</section>
