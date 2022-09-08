<script lang="ts">
	import { onDestroy, beforeUpdate, afterUpdate } from 'svelte';
	import { get } from 'svelte/store';
	import { browser } from '$app/environment';
	import { auth, logout } from '$lib/auth';
	import { baseUrl } from '$lib/routing';
	import { settings } from '$lib/storage';
	import { selectedServerGuid, sendServerCommand } from '$lib/api';
	import ReloadSvg from '$lib/svgs/ReloadSvg.svelte';

	let loadingConsole: boolean;
	let serverConsole: string[] = [];
	let consoleInput: string;
	let textarea: HTMLTextAreaElement;
	let consoleRequiresUpdate: boolean;

	if (browser) {
		const unsubscribe = selectedServerGuid.subscribe((newGuid) => {
			reloadConsole(newGuid);
		});

		const updateConsole = setInterval(() => {
			updateConsoleIfNeeded();
		}, 5000);

		onDestroy(unsubscribe);
		onDestroy(() => clearInterval(updateConsole));
	}

	beforeUpdate(() => {
		consoleRequiresUpdate = textarea && textarea.offsetHeight + textarea.scrollTop > textarea.scrollHeight - 20;
	});

	afterUpdate(() => {
		if (consoleRequiresUpdate) {
			scrollToBottom();
		}
	});

	async function reloadConsole(guid: string) {
		if (!guid) {
			return;
		}

		loadingConsole = true;

		//TODO move this to api.ts
		const request = new Request(`${baseUrl}/api/v1/servers/${guid}/console?amountOfLines=${$settings.amountOfConsoleLines}&reversed=${$settings.reverseConsoleLines}`, {
			method: `GET`,
			headers: {
				apiKey: get(auth).apiKey
			}
		});

		await fetch(request)
			.then((response) => {
				if (response.status === 200) {
					return response.json();
				}
				return Promise.reject(response);
			})
			.then((data) => {
				serverConsole = data.join('\r\n');
				scrollToBottom();
			})
			.catch((error) => {
				if (error.status === 403) {
					logout();
				}
			})
			.finally(() => {
				loadingConsole = false;
			});
	}

	async function updateConsoleIfNeeded() {
		const guid = get(selectedServerGuid);

		if (!guid) {
			return;
		}

		loadingConsole = true;

		let lines = textarea.value.split('\n');
		let length: number = lines.length - 1;

		let secondLastLine: string = encodeURIComponent(lines[length - 1]);
		let lastLine: string = encodeURIComponent(lines[length]);

		//TODO move this to api.ts
		const request = new Request(`${baseUrl}/api/v1/servers/${guid}/console/outdated?secondLastLine=${secondLastLine}&lastLine=${lastLine}`, {
			method: `GET`,
			headers: {
				apiKey: get(auth).apiKey
			}
		});

		await fetch(request)
			.then((response) => {
				if (response.status === 200) {
					return response.json();
				}
				return Promise.reject(response);
			})
			.then((data) => {
				if (data.isOutdated) {
					reloadConsole(guid);
					scrollToBottom();
				}
			})
			.catch((error) => {
				if (error.status === 401) {
					logout();
				}
			})
			.finally(() => {
				loadingConsole = false;
			});
	}

	function sendCommand() {
		if (!consoleInput) {
			return;
		}

		sendServerCommand(consoleInput);
		consoleInput = '';
	}

	function scrollToBottom() {
		if ($settings.autoScrollConsole) {
			textarea.scrollTo(0, textarea.scrollHeight);
		}
	}

	function clearConsole() {
		serverConsole = [];
	}
</script>

<!-- <div class="col-span-full xl:col-span-6 shadow-lg rounded-md bg-zinc-700"> -->
<div class="col-span-full xl:col-span-6 shadow-lg rounded-md bg-custom-gray-lighter">
	<div class="flex px-5 py-4">
		<h2 class="font-semibold text-gray-300">Console</h2>
		<div class="inline-flex ml-2">
			<button on:click={() => reloadConsole} disabled={loadingConsole} class="disabled:text-zinc-800 text-slate-400">
				<ReloadSvg className={loadingConsole ? 'animate-spin' : ''} />
			</button>
		</div>
		<div class="ml-auto self-center text-xs">
			<label>
				<input type="checkbox" bind:checked={$settings.autoScrollConsole} /> Auto scroll
			</label>
		</div>
	</div>

	<textarea bind:this={textarea} readonly class="w-full h-96 md:px-5 px-2 outline-none md:text-sm text-xs bg-inherit">{serverConsole}</textarea>

	<form on:submit|preventDefault={sendCommand}>
		<input bind:value={consoleInput} type="text" placeholder="Enter command e.g. /say hello" class="w-full px-5 pt-1 pb-3 outline-none bg-inherit" />
	</form>
</div>
