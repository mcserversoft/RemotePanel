<script>
	import ColoredDot from './coloredDot.svelte';
</script>

<div class="flex justify-between mb-6 bg-white shadow border border-gray-200 rounded-lg dark:border-gray-700 dark:bg-gray-800">
	<div class="flex w-full flex-col p-4 text-gray-600 dark:text-gray-400">
		<div class="flex flex-row">
			<div class="w-full">
				<div class="flex mb-3 space-x-6">
					<div class="col-auto">
						<ColoredDot color="bg-blue-500 " /> 2 Running
					</div>
					<div class="col-auto">
						<ColoredDot color="bg-green-500" /> 8 Completed
					</div>
					<div class="col-auto">
						<ColoredDot color="bg-red-500" /> 6 Failed
					</div>
				</div>
				<div class="flex w-full rounded-full overflow-hidden h-2.5 bg-gray-200 dark:bg-gray-700">
					<div class="2.5 bg-blue-500" style="width: 10%" />
					<div class="2.5 bg-green-500" style="width: 55%" />
					<div class="2.5 bg-red-500" style="width: 35%" />
				</div>
			</div>
		</div>
	</div>
</div>
