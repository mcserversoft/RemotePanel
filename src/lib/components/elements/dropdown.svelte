<script lang="ts">
	import { Dropdown as FlowbiteDropdown } from 'flowbite-svelte';

	export let isOpen: boolean = false;
	export { className as class };

	let className: string = '';

	function onClick(e: any) {
		isOpen = false;
	}
</script>

<!-- TODO temp width fix -->
<FlowbiteDropdown bind:open={isOpen} class={className + 'w-44'}>
	<div on:click={onClick} aria-hidden>
		<slot />
	</div>
</FlowbiteDropdown>
