<script lang="ts">
	import type { ISchedulerDetails } from '$lib/code/scheduler';
	import ColoredDot from '../elements/coloredDot.svelte';

	export let stats: ISchedulerDetails = { tasks: 0, interval: 0, fixedTime: 0, timeless: 0 };
</script>

<div class="justify-between mb-6 flex bg-white shadow border border-gray-200 rounded-lg dark:border-gray-700 dark:bg-gray-800">
	<div class="w-full p-4 text-gray-600 dark:text-gray-400">
		<div class="flex space-x-6 text-xs sm:text-base">
			<div>
				<span>Overview ({stats.tasks}):</span>
			</div>
			<div>
				<ColoredDot color="bg-orange-500" />
				{stats.interval} Interval
			</div>
			<div>
				<ColoredDot color="bg-blue-500" />
				{stats.fixedTime} Fixed Time
			</div>
			<div>
				<ColoredDot color="bg-gray-500" />
				{stats.timeless} Timeless
			</div>
		</div>
	</div>
</div>
