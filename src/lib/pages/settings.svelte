<script type="ts">
	import { navigateToPage, Page } from '$lib/routing';
	import { settings } from '$lib/storage';

	let serversRefreshRate: number = $settings.serversRefreshRate;
	let consoleRefreshRate: number = $settings.consoleRefreshRate;
	let amountOfConsoleLines: number = $settings.amountOfConsoleLines;
	let autoScrollConsole: boolean = $settings.autoScrollConsole;

	let inputErrorServersRefreshRate: boolean;
	let inputErrorConsoleRefreshRate: boolean;
	let inputErrorAmountOfConsoleLines: boolean;
	let disableSaveButton: boolean = true;

	function inputValidator() {
		inputErrorServersRefreshRate = !(serversRefreshRate >= 1 && serversRefreshRate <= 3600);
		inputErrorConsoleRefreshRate = !(consoleRefreshRate >= 1 && consoleRefreshRate <= 3600);
		inputErrorAmountOfConsoleLines = !(amountOfConsoleLines >= 1 && amountOfConsoleLines <= 1000);
        disableSaveButton = false;
	}

	function handleSettingsEdit() {
		if (serversRefreshRate >= 1 && serversRefreshRate <= 1000) {
			$settings.serversRefreshRate = serversRefreshRate;
		}

		if (consoleRefreshRate >= 1 && consoleRefreshRate <= 1000) {
			$settings.consoleRefreshRate = consoleRefreshRate;
		}

		if (amountOfConsoleLines >= 1 && amountOfConsoleLines <= 2000) {
			$settings.amountOfConsoleLines = amountOfConsoleLines;
		}

		$settings.autoScrollConsole = autoScrollConsole;
        disableSaveButton = true;
	}
</script>

<svelte:head>
	<title>MCSS Remote Panel | Settings</title>
</svelte:head>

<seaction class="text-center">
	<div class="max-w-sm mx-auto py-12 px-6 md:px-0">
        <div class="hidden lg:block">
            <button class="btn btn-ghost mb-9" on:click={() => navigateToPage(Page.Dashboard)}>{'< Back to the Dashboard'}</button>
        </div>

		<h1 class="text-3xl font-bold pb-1">Settings</h1>
		<p>Control how this panel interacts with the MCSS API, these settings only stored in this browser.</p>

		<form on:submit|preventDefault={handleSettingsEdit} class="my-6">
			<div class="form-control mb-6">
				<label class="label" for="serversRefreshRate">
					<span class="label-text">Server refresh rate in seconds</span>
				</label>
				<input bind:value={serversRefreshRate} on:input={inputValidator} required id="serversRefreshRate" name="serversRefreshRate" type="number" min="1" max="3600" placeholder="" class="input input-bordered {inputErrorServersRefreshRate ? 'input-error' : ''}" />
				<label class="label" for="serversRefreshRate">
					<span class="label-text-alt text-opacity-50">Setting this value too low can lead to peformance issues.</span>
					<div class="tooltip tooltip-error tooltip-bottom {inputErrorServersRefreshRate ? 'visible' : 'hidden'}" data-tip="The value must be between 1 and 3600.">
						<span class="label-text-alt text-error">1-3600</span>
					</div>
				</label>
			</div>

			<div class="form-control mb-6">
				<label class="label" for="consoleRefreshRate">
					<span class="label-text">Console refresh rate in seconds</span>
				</label>
				<input bind:value={consoleRefreshRate} on:input={inputValidator} required id="consoleRefreshRate" name="consoleRefreshRate" type="number" min="1" max="3600" placeholder="" class="input input-bordered {inputErrorConsoleRefreshRate ? 'input-error' : ''}" />
				<label class="label" for="consoleRefreshRate">
					<span class="label-text-alt text-opacity-50">Setting this value too low can lead to peformance issues.</span>
					<div class="tooltip tooltip-error tooltip-bottom {inputErrorConsoleRefreshRate ? 'visible' : 'hidden'}" data-tip="The value must be between 1 and 3600.">
						<span class="label-text-alt text-error">1-3600</span>
					</div>
				</label>
			</div>

			<div class="form-control mb-6">
				<label class="label" for="amountOfConsoleLines">
					<span class="label-text">Amount of console lines</span>
				</label>
				<input bind:value={amountOfConsoleLines} on:input={inputValidator} required id="amountOfConsoleLines" name="amountOfConsoleLines" type="number" min="1" max="1000" placeholder="" class="input input-bordered {inputErrorAmountOfConsoleLines ? 'input-error' : ''}" />
				<label class="label" for="amountOfConsoleLines">
					<span class="label-text-alt text-opacity-50">Setting this value too high can lead to peformance issues.</span>
					<div class="tooltip tooltip-error tooltip-bottom {inputErrorAmountOfConsoleLines ? 'visible' : 'hidden'}" data-tip="The value must be between 1 and 1000.">
						<span class="label-text-alt text-error">1-1000</span>
					</div>
				</label>
			</div>

			<div class="form-control">
				<label class="label cursor-pointer" for="autoScrollConsole">
					<span class="label-text">Automatially scroll console</span>
					<input type="checkbox" bind:checked={autoScrollConsole}  on:input={inputValidator} id="autoScrollConsole" class="checkbox" />
				</label>
			</div>

			<button type="submit" disabled={disableSaveButton} class="btn btn-primary btn-block mt-6">Save</button>
		</form>
	</div>
</seaction>
