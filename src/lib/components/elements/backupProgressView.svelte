<script lang="ts">
	import type { BackupStats } from '../../../types';
	import ColoredDot from './coloredDot.svelte';

	export let stats: BackupStats = { canceled: 0, completed: 0, failed: 0, scheduled: 0 };

	function calculateWidthRatio(stat: number) {
		let total = stats.canceled + stats.completed + stats.failed + stats.scheduled;
		return (stat / total) * 100;
	}
</script>

<div class="flex justify-between mb-6 bg-white shadow border border-gray-200 rounded-lg dark:border-gray-700 dark:bg-gray-800">
	<div class="flex w-full flex-col p-4 text-gray-600 dark:text-gray-400">
		<div class="flex flex-row">
			<div class="w-full">
				<div class="flex mb-3 space-x-6 text-xs sm:text-base">
					<div class="col-auto">
						<ColoredDot color="bg-blue-500" />
						{stats.scheduled} Scheduled
					</div>
					<div class="col-auto">
						<ColoredDot color="bg-green-500" />
						{stats.completed} Completed
					</div>
					<div class="col-auto">
						<ColoredDot color="bg-red-500" />
						{stats.failed} Failed
					</div>
					<div class="col-auto">
						<ColoredDot color="bg-gray-500" />
						{stats.canceled} Canceled
					</div>
				</div>

				<div class="flex w-full rounded-full overflow-hidden h-2.5 bg-gray-200 dark:bg-gray-700">
					<div class="2.5 bg-blue-500" style="width: {calculateWidthRatio(stats.scheduled)}%" />
					<div class="2.5 bg-green-500" style="width: {calculateWidthRatio(stats.completed)}%" />
					<div class="2.5 bg-red-500" style="width: {calculateWidthRatio(stats.failed)}%" />
					<div class="2.5 bg-gray-500" style="width: {calculateWidthRatio(stats.canceled)}%" />
				</div>
			</div>
		</div>
		<span class="pt-3 text-xs">The stats above provide insight into the last 15 executed backups.</span>
	</div>
</div>
