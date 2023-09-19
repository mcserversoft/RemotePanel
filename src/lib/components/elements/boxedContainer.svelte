<script lang="ts">
	export { className as class };

	let className: string = '';
</script>

<div class="rounded-xl my-4 p-6 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 {className}">
	<slot />
</div>
