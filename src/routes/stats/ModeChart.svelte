<script lang="ts">
	import { MODES, MODE_TYPES } from '$lib/modes';
	import type { Stats } from '$lib/stores/stats';
	import { currentTheme } from '$lib/theme';

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
	const LABELS = Object.entries(MODE_TYPES).map((n) => n[1].title);

	let canvas: HTMLCanvasElement;
	let chart: Chart;

	$: labelColor = $currentTheme === 'dark' ? '#e2e8f0' : '#1e293b';
	$: gridColor = $currentTheme === 'dark' ? '#94a3b8' : '#475569';

	onMount(() => {
		Chart.register(BarElement, BarController, CategoryScale, LinearScale, Legend, Tooltip);

		const modes = Object.entries(stats.mode);

		chart = new Chart(canvas, {
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
							},
							color: labelColor
						}
					}
				},
				scales: {
					y: {
						ticks: {
							color: labelColor
						}
					},
					x: {
						ticks: {
							color: labelColor
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

	$: if (chart) {
		chart.config.options = {
			...chart.config.options,
			scales: {
				y: {
					ticks: {
						color: labelColor
					},
					grid: {
						color: gridColor
					}
				},
				x: {
					ticks: {
						color: labelColor
					},
					grid: {
						color: gridColor
					}
				}
			},
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
						},
						color: labelColor
					}
				}
			}
		};

		chart.update();
	}
</script>

<canvas id="chart" bind:this={canvas} aria-label="Stats Chart" height="250">
	<p>Your browser does not support <code>canvas</code> element</p>
</canvas>
