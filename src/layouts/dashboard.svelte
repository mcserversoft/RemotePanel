<script lang="ts">
    export let username: string;

    function getGreeting() {
        var currentHour = new Date().getHours();

        if (currentHour < 12) {
            return "good morning";
        } else if (currentHour >= 5 && currentHour < 18) {
            return "good afternoon";
        } else if (currentHour >= 18 && currentHour <= 22) {
            return "good evening";
        } else {
            return "hi";
        }
    }
</script>

<div class="p-6 mb-8 rounded-md shadow-lg bg-zinc-700">
    <h1 class="text-2xl md:text-3xl font-bold mb-1 capitalize">{getGreeting()}, {username} 👋</h1>
    <p>Here is what's happening with your servers today</p>
</div>

<div class="p-6 mb-8 rounded-md shadow-lg bg-zinc-700">
    <p>WIP</p>
</div>