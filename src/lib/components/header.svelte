<script lang="ts">
	import { logout } from '$lib/common.js';
	import Logo from '$lib/svgs/Logo.svelte';
</script>

<header class="navbar sticky top-0 z-50 bg-custom-gray shadow-sm">
	<div class="flex-1">
		<Logo width="32" height="32" />
		<p class="font-semibold text-xl px-3">MCSS Remote Panel</p>
	</div>
	<div class="flex-none gap-2">
		<div class="dropdown dropdown-end">
			<label tabindex="0" class="btn btn-ghost btn-circle avatar">
				<div class="w-10 rounded-full">
					<!-- <img src="https://placeimg.com/80/80/people" /> -->
					<img src="avatar.png" />
				</div>
			</label>

			<ul tabindex="0" class="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52">
				<li>
					<a class="justify-between">
						Profile
						<span class="badge">New</span>
					</a>
				</li>
				<li><a>Settings</a></li>
				<li><button on:click={logout} class="flex w-full py-1 px-3 font-medium text-sm capitalize text-red-500 hover:bg-zinc-700">log out</button></li>
			</ul>
		</div>
	</div>
</header>
