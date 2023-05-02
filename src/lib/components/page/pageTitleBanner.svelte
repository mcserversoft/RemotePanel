<script lang="ts">
	export let title: string;
	export let caption: string;
</script>

<div class="flex justify-between py-6">
	<div class="self-center">
		<span class="text-lg font-semibold">{title}</span>
		<p class="text-sm font-normal text-gray-500 max-sm:hidden dark:text-gray-400">{caption}</p>
	</div>
	<div class="self-center">
		<slot />
	</div>
</div>
