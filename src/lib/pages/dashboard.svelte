<script type="ts">
	import { selectedServerGuid } from '$lib/code/api';
	import { hasPermission, Permission } from '$lib/code/permissions';
	import Server from '$lib/components/server.svelte';
	import Console from '$lib/components/console.svelte';
	import ServerStats from '$lib/components/serverStats.svelte';
</script>

<svelte:head>
	<title>MCSS Remote Panel | Panel</title>
</svelte:head>

<!-- <section class="py-24 min-h-screen dark:bg-gray-900 dark:text-white"> -->
<section class="py-24  dark:bg-gray-900 dark:text-white">
	<!-- <div class="flex flex-col lg:flex-row"> -->
	<div class="">
		<div class="flex-none hidden lg:block">
			<!-- <Sidebar /> -->
		</div>
		<div class="flex-grow p-6">
			<div class="mb-20">
				{#if $selectedServerGuid}
					<Server />
					{#key $selectedServerGuid}
						{#if hasPermission(Permission.viewStats, $selectedServerGuid)}
							<ServerStats />
						{/if}

						{#if hasPermission(Permission.viewConsole, $selectedServerGuid)}
							<Console />
						{/if}
					{/key}
				{:else}
					<div class="text-center">
						<span class="text-sm font-medium italic text-slate-400">No server selected.</span>
					</div>
				{/if}
			</div>
		</div>
	</div>
</section>
