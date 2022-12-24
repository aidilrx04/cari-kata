<script lang="ts">
	import { MODES } from '$lib/modes';
	import type { Stats } from '$lib/stores/stats';

	// ! Dont forget to minify this
	import {
		Chart,
		BarController,
		CategoryScale,
		LinearScale,
		BarElement,
		Legend,
		Tooltip
	} from 'chart.js';
	import { onMount } from 'svelte';

	export let stats: Stats;
	const LABELS = ['Mudah', 'Sederhana', 'Sukar'];

	let canvas: HTMLCanvasElement;

	onMount(() => {
		Chart.register(BarElement, BarController, CategoryScale, LinearScale, Legend, Tooltip);

		const modes = Object.entries(stats.mode);

		new Chart(canvas, {
			type: 'bar',
			options: {
				responsive: true,
				plugins: {
					legend: {
						display: true,
						position: 'bottom',
						fullSize: true,
						align: 'center',
						labels: {
							boxHeight: 17,
							boxWidth: 17,
							font: {
								size: 14
							}
						}
					}
				}
			},
			data: {
				labels: LABELS,
				datasets: [
					{
						label: 'Permainan',
						data: modes.map((mode) => mode[1].total),
						backgroundColor: '#9333EA'
					},
					{
						label: 'Menang',
						data: modes.map((mode) => mode[1].win),
						backgroundColor: '#4ADE80'
					}
				]
			}
		});
	});
</script>

<canvas id="chart" bind:this={canvas} aria-label="Stats Chart" height="250">
	<p>Your browser does not support <code>canvas</code> element</p>
</canvas>
