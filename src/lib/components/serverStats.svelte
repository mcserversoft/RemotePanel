<script lang="ts">
	import { onDestroy } from 'svelte';
	import { get } from 'svelte/store';
	import { browser } from '$app/environment';
	import { fetchServerStatus, selectedServerGuid } from '$lib/code/api';
	import type { Stats } from '../../types';

	let stats: Stats = {
		cpu: 0,
		memory: { current: 0, max: 0, free: 0, percentageFree: 0 },
		playersOnline: 0,
		playerLimit: 0,
		startDateUnix: 0,
		startDate: '',
		uptime: 'offline'
	};

	let isLoadingStats: boolean = true;

	if (browser) {
		const unsubscribe = selectedServerGuid.subscribe((newGuid) => {
			isLoadingStats = true;
			updateServerStats();
		});

		const updateConsole = setInterval(() => {
			updateServerStats();
		}, 2000);

		onDestroy(unsubscribe);
		onDestroy(() => clearInterval(updateConsole));
	}

	async function updateServerStats() {
		const guid = get(selectedServerGuid);

		if (!guid) {
			return;
		}

		fetchServerStatus(
			guid,
			(latestStats: Stats) => {
				stats = latestStats;
			},
			(wasSuccess: Boolean) => {
				isLoadingStats = false;
			}
		);
	}
</script>

<div class="col-span-full mb-4 xl:col-span-4 shadow-lg rounded-md bg-custom-gray-lighter">
	<div class="stats bg-inherit stats-vertical sm:stats-horizontal block sm:inline-grid" class:animate-pulse={isLoadingStats}>
		<div class="stat">
			<div class="stat-figure text-secondary block sm:hidden md:block">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="inline-block w-8 h-8 stroke-current">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z"
					/>
				</svg>
			</div>
			<div class="stat-title">CPU</div>
			<div class="stat-value">{stats.cpu} %</div>
			<div class="stat-desc">current usage</div>
		</div>

		<div class="stat">
			<div class="stat-figure text-secondary block sm:hidden md:block">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="inline-block w-8 h-8 stroke-current">
					<path fill-rule="evenodd" d="M2.25 13.5a8.25 8.25 0 018.25-8.25.75.75 0 01.75.75v6.75H18a.75.75 0 01.75.75 8.25 8.25 0 01-16.5 0z" clip-rule="evenodd" />
					<path fill-rule="evenodd" d="M12.75 3a.75.75 0 01.75-.75 8.25 8.25 0 018.25 8.25.75.75 0 01-.75.75h-7.5a.75.75 0 01-.75-.75V3z" clip-rule="evenodd" />
				</svg>
			</div>
			<div class="stat-title">Memory</div>
			<div class="stat-value">{stats.memory.current} MB</div>
			<div class="stat-desc">{stats.memory.percentageFree}% used of {stats.memory.max} MB</div>
		</div>

		{#if stats.playerLimit != 0}
			<div class="stat">
				<div class="stat-figure text-secondary block sm:hidden md:block">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="inline-block w-8 h-8 stroke-current">
						<path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clip-rule="evenodd" />
					</svg>
				</div>
				<div class="stat-title">Players</div>
				<div class="stat-value">{stats.playersOnline}</div>
				<div class="stat-desc">out of {stats.playerLimit}</div>
			</div>
		{/if}

		<div class="stat">
			<div class="stat-figure text-secondary block sm:hidden md:block">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="inline-block w-8 h-8 stroke-current">
					<path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clip-rule="evenodd" />
				</svg>
			</div>
			<div class="stat-title">Uptime</div>
			<div class="stat-value">{stats.uptime}</div>

			{#if stats.startDateUnix > 0}
				<div class="stat-desc">since {stats.startDate}</div>
			{:else}
				<div class="stat-desc">server not operational</div>
			{/if}
		</div>
	</div>
</div>
