<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import Navigation from '$lib/components/Navigation.svelte';
	import { onMount } from 'svelte';
	import '../app.css';
	import { currentTheme, theme } from '$lib/theme';

	let htmlElement: HTMLHtmlElement;
	let systemPreference: 'light' | 'dark';

	onMount(() => {
		htmlElement = document.body.parentElement as HTMLHtmlElement;
		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
			if (e.matches) {
				systemPreference = 'dark';
			} else {
				systemPreference = 'light';
			}
		});
	});

	$: if ($theme === 'system' && systemPreference !== undefined) $currentTheme = systemPreference;

	$: if (htmlElement && $currentTheme) {
		htmlElement.classList.toggle('dark', $currentTheme === 'dark');
	}
</script>

<Navigation />
<div class="max-w-screen-xl mx-auto">
	<div class="px-3">
		<slot />
		<Footer />
	</div>
</div>

<style global>
	body {
		@apply bg-slate-100 text-slate-800;
	}

	.dark body {
		@apply bg-slate-800 text-slate-100;
	}
</style>
