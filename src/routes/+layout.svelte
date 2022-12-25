<script lang="ts">
	import '../app.css';
</script>

<div class="max-w-screen-lg mx-auto">
	<slot />
</div>

<style global>
	body {
		@apply bg-slate-100 text-slate-800;
	}
</style>
