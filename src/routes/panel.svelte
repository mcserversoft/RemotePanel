<script lang="ts" context="module">
    export const prerender = true;
</script>

<script type="ts">
    import { browser } from "$app/env";
    import { Router } from "$lib/Router.js";
    import { auth } from "$lib/store.js";

    if (browser) {
        console.log("browser");

        auth.subscribe((value) => {
            console.log("sub");

            if (!value.apiKey) {
                Router.redirectToLogin();
            }
        });
    }
</script>

<h1>Panel</h1>
