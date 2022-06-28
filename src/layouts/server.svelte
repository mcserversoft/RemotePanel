<script lang="ts">
    import { selectedServer } from "$lib/store.js";
    import Console from "../layouts/console.svelte";
    import ActionDropdown from "../components/actionDropdown.svelte";
</script>

<div class="flex mb-8">
    <div class="grow">
        <h2 class="leading-relaxed align-middle text-xl truncate">{$selectedServer.name}</h2>
    </div>

    <ActionDropdown />
</div>

<Console />
