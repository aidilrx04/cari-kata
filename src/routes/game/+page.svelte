<script lang="ts">
	import Modal from '$lib/Modal.svelte';
	import Timer from '$lib/Timer.svelte';
	import type { PageData } from './$types';
	import Grid from './Grid.svelte';
	import Words from './Words.svelte';
	import FinishModal from './FinishModal.svelte';
	import Meta from '$lib/Meta.svelte';
	import Ogp from '$lib/OGP.svelte';
	import stats from '$lib/stores/stats';
	import {
		game,
		mode,
		hideFiller,
		checkGameFinish,
		words,
		CELL_WIDTH,
		foundWords,
		currentColor
	} from '$lib/stores/game';
	import { onDestroy } from 'svelte';
	import { colors } from '$lib/util';
	import WinSfx from '$lib/audio/win.mp3';
	import BackgroundMusic from '$lib/audio/background.mp3';

	export let data: PageData;
	let showModal = true;
	const gameInfo = {
		grid: data.type.grid
	};

	$mode = data.type;

	let winAudio: HTMLAudioElement;
	let backgroundAudio: HTMLAudioElement;

	// stats
	$: if ($game.hasStarted && $mode) {
		const _type = $mode.type;
		$stats = {
			...$stats,
			total: $stats.total + 1,
			mode: {
				...$stats.mode,
				[_type]: {
					...$stats.mode[_type],
					total: $stats.mode[_type].total + 1
				}
			}
		};
	}

	$: if ($game.hasEnded && $mode && $game.finishTime && $game.startTime) {
		const _type = $mode.type;
		$stats = {
			...$stats,
			win: $stats.win + 1,
			total_time: $stats.total_time + ($game.finishTime?.getTime() - $game.startTime?.getTime()),
			mode: {
				...$stats.mode,
				[_type]: {
					...$stats.mode[_type],
					win: $stats.mode[_type].win + 1
				}
			}
		};
	}

	// check is game is finished
	$: $checkGameFinish;

	$: if ($game.hasStarted) {
		backgroundAudio.loop = true;
		backgroundAudio?.play();
	}

	$: if ($game.hasEnded) {
		winAudio?.play();
	}

	onDestroy(() => {
		showModal = true;
		$game = {
			hasEnded: false,
			hasStarted: false,
			startTime: null,
			finishTime: null
		};
		$hideFiller = false;
		$words = [];
		$CELL_WIDTH = 0;
		$foundWords = [];
		$currentColor = colors[Math.floor(Math.random() * colors.length)];

		winAudio?.pause();
		backgroundAudio?.pause();
	});
</script>

<Meta
	title="Tahap {data.type.title} | Cari Kata"
	description="Main {data.words.map((n) => 'kata ' + n.word)}"
/>
<Ogp title="Tahap {data.type.title} | Cari Kata" />

<audio src={WinSfx} class="absolute -left-100 -top-100 win" bind:this={winAudio} />
<audio
	src={BackgroundMusic}
	class="background absolute -left-100 -top-100"
	bind:this={backgroundAudio}
/>

<header class="lg:hidden">
	<div class="content-header flex items-center justify-between my-4 px-3">
		<div class="title">
			<h2 class="text-2xl text-slate-900 font-semibold">{data.type.title}</h2>
			<small class="text-xs font-semibold text-slate-600 tracking-wider">
				{gameInfo.grid.column}x{gameInfo.grid.row} GRID
			</small>
		</div>
		{#if $game.hasEnded}
			<div>
				<button
					class="block m-1 py-2 px-3 text-gray-50 bg-violet-600 rounded uppercase hover:bg-violet-700 transition-colors"
					on:click={() => {
						showModal = true;
					}}>SELESAI</button
				>
			</div>
		{/if}
		<div class="timer flex flex-col items-end justify-center">
			<small class="label text-xs font-bold text-slate-600 uppercase">MASA</small>
			{#if $game.hasStarted && $game.startTime}
				<Timer
					startAt={$game.startTime}
					finishAt={$game.finishTime}
					startCounting={$game.hasStarted && !$game.hasEnded}
					_class="block text-slate-800 text-3xl"
				/>
			{:else}
				<span class="placeholder block text-slate-800 text-3xl">00:00</span>
			{/if}
		</div>
	</div>

	<!-- <button on:click={() => ($hideFiller = !$hideFiller)}
		>{$hideFiller ? 'Show' : 'Hide'} filler</button
	>
	<button on:click={() => ($game.hasEnded = !$game.hasEnded)}> toggle finish </button> -->
</header>

<main class="bg-gray-50 p-3 relative my-5">
	{#if !$game.hasStarted}
		<Modal _class="bg-gray-50 w-[250px] max-w-full px-2 py-1 shadow top-[70%] rounded">
			<div slot="header" class="text-xl text-center mb-2">Cari Kata</div>
			<div class="content">
				<button
					on:click={() => ($game.hasStarted = true)}
					class="px-6 py-2 block mx-auto bg-violet-600 text-gray-50 text-xl mt-2 mb-3 rounded shadow-sm hover:bg-violet-700 transition-colors"
					>Main</button
				>
			</div>
			<div slot="footer" />
		</Modal>
	{/if}
	{#if $game.hasEnded}
		<FinishModal
			bind:showModal
			on:close={() => {
				showModal = false;
			}}
		/>
	{/if}
	<div
		class="
default: game grid grid-cols-1 relative min-h-[400px]
sma: 
med: md:
lar: lg:grid-cols-2 lg:gap-3
	"
	>
		{#if $game.hasStarted}
			<Grid
				words={data.type.preprocess ? data.type.preprocess(data.words) : data.words}
				type={data.type}
			/>
			<div>
				<header class="hidden lg:block">
					<div class="content-header flex items-center justify-between my-4 px-3">
						<div class="title">
							<h2 class="text-2xl text-slate-900 font-semibold">{data.type.title}</h2>
							<small class="text-xs font-semibold text-slate-600 tracking-wider">
								{gameInfo.grid.column}x{gameInfo.grid.row} GRID
							</small>
						</div>
						{#if $game.hasEnded}
							<div>
								<button
									class="block m-1 py-2 px-3 text-gray-50 bg-violet-600 rounded uppercase hover:bg-violet-700 transition-colors"
									on:click={() => {
										showModal = true;
									}}>SELESAI</button
								>
							</div>
						{/if}
						<div class="timer flex flex-col items-end justify-center">
							<small class="label text-xs font-bold text-slate-600 uppercase">MASA</small>
							{#if $game && $game.startTime}
								<Timer
									startAt={$game.startTime}
									finishAt={$game.finishTime}
									startCounting={$game.hasStarted && !$game.hasEnded}
									_class="block text-slate-800 text-3xl"
								/>
							{:else}
								<span class="placeholder block text-slate-800 text-3xl">00:00</span>
							{/if}
						</div>
					</div>
				</header>
				<Words />
			</div>
		{/if}
	</div>
</main>
