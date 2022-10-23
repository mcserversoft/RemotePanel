<script type="ts">
	import { selectedServerGuid } from '$lib/api';
	import Sidebar from '$lib/components/sidebar.svelte';
	import Server from '$lib/components/server.svelte';
	import Console from '$lib/components/console.svelte';
	import ServerStats from '$lib/components/serverStats.svelte';
</script>

<svelte:head>
	<title>MCSS Remote Panel | Panel</title>
</svelte:head>

<div class="">
	<div class="flex flex-col lg:flex-row">
		<div class="flex-none hidden lg:block">
			<Sidebar />
		</div>
		<div class="flex-grow p-6">
			<div class="mb-20">
				{#if $selectedServerGuid}
					<Server />
					<ServerStats />
					<Console />
				{:else}
					<div class="text-center">
						<span class="text-sm font-medium italic text-slate-400">No server selected.</span>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
