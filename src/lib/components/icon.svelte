<script lang="ts">
	export let data: string;
	export let size: number = 6;
	export let viewBox: number = 24;
</script>

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {viewBox} {viewBox}" class="w-{size} h-{size} {$$restProps.class}">
	<path fill="currentColor" d={data} />
</svg>
