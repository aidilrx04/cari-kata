<script lang="ts">
	import { onDestroy } from 'svelte';
	import { addPrefix } from '../../lib/util';

	export let startAt: Date;
	export let finishAt: Date | null = null;
	export let start: boolean = false;
	export let stop = false;

	const startAtTime = startAt.getTime();
	let hours = 0;
	let minutes = 0;
	let seconds = 0;

	let timerInterval;
	$: if (start) {
		timerInterval = setInterval(() => {
			const now = new Date().getTime();

			const distance = now - startAtTime;
			// console.log(distance);

			// find hours, minutes and seconds
			hours = Math.floor(distance / (1000 * 60 * 60));
			minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
			seconds = Math.floor((distance % (1000 * 60)) / 1000);
		}, 1000);
	}

	// only stop if timer has started, else is invalid
	$: if (stop && start) {
		finishAt = new Date();
		clearInterval(timerInterval);
	}

	onDestroy(() => {
		clearInterval(timerInterval);
	});
</script>

<div class="timer flex text-slate-800 dark:text-slate-100 text-3xl">
	{#if hours > 0}
		<!-- only show hours if minutes > 60 -->
		<span>{addPrefix(hours, '0', 2)}</span>
		<span>:</span>
	{/if}
	<span>{addPrefix(minutes, '0', 2)}</span>
	<span>:</span>
	<span>{addPrefix(seconds, '0', 2)}</span>
</div>
