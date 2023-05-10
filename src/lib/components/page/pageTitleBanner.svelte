<script lang="ts">
	export let title: string;
	export let caption: string;
</script>

<div class="flex pb-3 space-x-2">
	<div class="self-center grow">
		<div class="pr-3 self-nonecenter">
			<span class="text-lg font-semibold">{title}</span>
			<p class="text-sm font-normal text-gray-500 max-sm:hidden dark:text-gray-400">{caption}</p>
		</div>
	</div>
	<slot />
</div>
