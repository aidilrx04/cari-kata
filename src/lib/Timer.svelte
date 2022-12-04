<script lang="ts">
	import { onDestroy } from 'svelte';

	export let startAt: Date;
	export let startCounting: boolean = false;
	export let _class: string = '';

	const startAtTime = startAt.getTime();
	let minutes = 0;
	let seconds = 0;

	let intervalId;
	$: if (startCounting) {
		intervalId = setInterval(() => {
			const now = new Date().getTime();

			const distance = now - startAtTime;
			// console.log(distance);

			// find minutes and seconds
			minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
			seconds = Math.floor((distance % (1000 * 60)) / 1000);
		}, 1000);
	}

	onDestroy(() => {
		clearInterval(intervalId);
	});

	const addPrefix = (number: number, prefix: string, length: number = 2): string => {
		const numberStr = number.toString();
		if (numberStr.length >= length) return numberStr;

		const totalToAdd = length - numberStr.length;
		return prefix.toString().repeat(totalToAdd).concat(numberStr);
	};
</script>

<div class="timer {_class}">
	{addPrefix(minutes, '0', 2)}:{addPrefix(seconds, '0', 2)}
</div>
