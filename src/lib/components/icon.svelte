<script type="ts">
	export let data: string;
	export let size: number = 6;
	export { className as class };

	let className: string = '';
</script>

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="{className} w-{size} h-{size}">
	<path fill="currentColor" d={data} />
</svg>
