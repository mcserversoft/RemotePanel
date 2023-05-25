<script lang="ts">
	import { onDestroy, beforeUpdate, afterUpdate } from 'svelte';
	import { get } from 'svelte/store';
	import { browser } from '$app/environment';
	import { settings } from '$lib/code/storage';
	import { fetchServerConsole, isServerConsoleOutdated, selectedServerId, sendServerCommand } from '$lib/code/api';
	import ReloadSvg from '$lib/svgs/ReloadSvg.svelte';
	import { hasPermission, Permission } from '$lib/code/permissions';
	import { mdiBullhorn, mdiSend } from '@mdi/js';
	import Icon from '../elements/icon.svelte';
	import { Popover, Button } from 'flowbite-svelte';

	let loadingConsole: boolean;
	let serverConsole: string[] = [];
	let consoleInput: string;
	let textarea: HTMLTextAreaElement;
	let consoleRequiresUpdate: boolean;

	if (browser) {
		const unsubscribe = selectedServerId.subscribe((newServerId) => {
			reloadConsole(newServerId);
		});

		const updateConsole = setInterval(() => {
			updateConsoleIfNeeded();
		}, $settings.consoleRefreshRate * 1000 ?? 5000);

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

	async function reloadConsole(serverId: string) {
		if (!serverId) {
			return;
		}

		loadingConsole = true;

		fetchServerConsole(
			serverId,
			(consoleLines: string[]) => {
				serverConsole = consoleLines;
				scrollToBottom();
			},
			(wasSuccess: boolean) => {
				loadingConsole = false;
			}
		);
	}

	async function updateConsoleIfNeeded() {
		const serverId = get(selectedServerId);

		if (!serverId) {
			return;
		}

		loadingConsole = true;

		let lines = textarea.value.split('\n');
		let length: number = lines.length - 1;

		let secondLastLine: string = encodeURIComponent(lines[length - 1]);
		let lastLine: string = encodeURIComponent(lines[length]);

		isServerConsoleOutdated(
			serverId,
			secondLastLine,
			lastLine,
			(isOutdated: boolean) => {
				if (isOutdated) {
					reloadConsole(serverId);
					scrollToBottom();
				}
			},
			(wasSuccess: boolean) => {
				loadingConsole = false;
			}
		);
	}

	function sendCommand() {
		const serverId = get(selectedServerId);
		if (!consoleInput || !serverId) {
			return;
		}

		sendServerCommand(serverId, consoleInput);
		consoleInput = '';
	}

	function scrollToBottom() {
		if (get(settings).autoScrollConsole) {
			textarea?.scrollTo(0, textarea.scrollHeight);
		}
	}

	function clearConsole() {
		serverConsole = [];
	}

	function toggleChatMode() {
		$settings.chatModeConsole = !get(settings).chatModeConsole;
	}

	//TODO add console features: reload, clear, download
</script>

<div class="w-full border border-b-0 border-gray-200 rounded-b-none rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
	<div class="flex items-center justify-between px-3 py-2">
		<div class="flex flex-wrap items-center divide-gray-200 sm:divide-x dark:divide-gray-600">
			<div class="flex items-center space-x-1 sm:pr-4">
				<h2 class="font-semibold text-gray-700 dark:text-gray-300">Console</h2>
				<button on:click={() => reloadConsole} disabled={loadingConsole} class="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 disabled:text-zinc-800 disabled:pointer-events-none">
					<ReloadSvg className={loadingConsole ? 'animate-spin' : ''} />
				</button>
			</div>
		</div>
		<div class="flex items-center text-xs cursor-pointer">
			<input
				bind:checked={$settings.autoScrollConsole}
				id="autoScrollConsole"
				type="checkbox"
				value=""
				class="w-4 h-4 cursor-pointer text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
			/>
			<label for="autoScrollConsole" class="ml-2 text-sm cursor-pointer select-none font-medium text-gray-900 dark:text-gray-300">Auto scroll</label>
		</div>
	</div>
	<div class="bg-white rounded-b-lg dark:bg-gray-800">
		<textarea bind:this={textarea} readonly class="block w-full h-96 md:px-5 px-2 text-sm text-gray-800 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400">
			{serverConsole}
		</textarea>
	</div>
</div>

{#key $selectedServerId}
	{#if hasPermission(Permission.useConsole, $selectedServerId)}
		<form on:submit|preventDefault={sendCommand}>
			<div class="flex items-center px-3 py-2 rounded-t-none rounded-lg bg-gray-50 dark:bg-gray-700">
				<form on:submit|preventDefault={toggleChatMode}>
					<button id="placement-right" type="submit" class="p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 {$settings.chatModeConsole ? 'text-green-400 dark:text-green-400  ' : 'text-gray-400 dark:text-gray-400  '}  dark:hover:bg-gray-600">
						<Icon data={mdiBullhorn} size={6} />
						<span class="sr-only">Chat mode</span>
					</button>
				</form>
				<Popover triggeredBy="[id^='placement-']" placement="right" class="w-64 text-sm font-light " title="Chat Mode {$settings.chatModeConsole ? 'Enabled' : 'Disabled (default)'}">Talk a lot? Automatically convert your console input to the /say format.</Popover>
				<input
					bind:value={consoleInput}
					type="text"
					placeholder="Enter command e.g. /say hello"
					class="block mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
				/>
				<button type="submit" class="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600">
					<Icon data={mdiSend} size={6} />
					<span class="sr-only">Send</span>
				</button>
			</div>
		</form>
	{/if}
{/key}
