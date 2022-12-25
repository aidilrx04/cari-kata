<script lang="ts">
	import Navigation from '$lib/Navigation.svelte';
	import '../app.css';
</script>

<div class="max-w-screen-lg mx-auto">
	<Navigation />
	<slot />
</div>

<style global>
	body {
		@apply bg-slate-100 text-slate-800;
	}
</style>
