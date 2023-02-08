<script lang="ts">
	import { auth } from '$lib/code/auth';
	import { servers, selectedServerId, isLoadingServers } from '$lib/code/api';
	import { getGreeting, getFriendlyStatusName, getStatusBgColor } from '$lib/code/shared';

	function onServerClick(serverId: string) {
		selectedServerId.set(serverId);
	}
</script>

<section class="h-max w-max max-w-full overflow-hidden pr-6 bg-custom-gray-lighter text-white">
	<div class="flex-col h-screen overflow-y-auto bg-inherit w-64 pt-6 pl-6">
		<h3 class="text-xs uppercase text-slate-500 font-semibold pl-3">
			<span class="text-center w-6">{getGreeting()}, {$auth.username} 👋</span>
		</h3>

		<div class="mt-6 px-3">
			<div class="flex items-center justify-between">
				<div class="flex items-center">
					<svg class="shrink-0 h-6 w-6" viewBox="0 0 24 24">
						<path class="fill-current text-slate-400" d="M13 15l11-7L11.504.136a1 1 0 00-1.019.007L0 7l13 8z" />
						<path class="fill-current text-slate-700" d="M13 15L0 7v9c0 .355.189.685.496.864L13 24v-9z" />
						<path class="fill-current text-slate-600" d="M13 15.047V24l10.573-7.181A.999.999 0 0024 16V8l-11 7.047z" />
					</svg>
					<span class="text-sm font-medium ml-3 cursor-default">Servers</span>
				</div>
			</div>

			<ul class="pl-9 mt-1 truncate">
				{#each $servers || [] as { serverId, name, status }}
					<li class="mb-1 last:mb-0">
						<button on:click={() => onServerClick(serverId)} class=" text-slate-400 hover:text-slate-200">
							<span class="inline-flex rounded-full h-2 w-2 {getStatusBgColor(status)}" title={getFriendlyStatusName(status)} /> <span class="text-sm font-medium">{name}</span>
						</button>
					</li>
				{:else}
					<li class="mb-1 last:mb-0">
						<span class="text-sm font-medium italic text-slate-400">{$isLoadingServers ? 'Loading Servers.' : 'No Servers found.'}</span>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</section>
