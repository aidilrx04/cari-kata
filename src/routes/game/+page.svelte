<script lang="ts">
	import Board from '$lib/components/Board.svelte';
	import Timer from './Timer.svelte';
	import Words from './Words.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import FinishModal from './FinishModal.svelte';
	import type { Solved } from '$lib/types';
	import type { PageServerData } from './$types';
	import { functions } from '$lib/functions';
	import Meta from '$lib/components/Meta.svelte';
	import Ogp from '$lib/components/OGP.svelte';
	import WordSearchGame from './WordSearchGame.svelte';

	export let data: PageServerData;

	$: game = data.game;

	$: if (game.functions && game.functions.length > 0) {
		game.functions.forEach((fn) => {
			game = functions[fn](game);
		});
	}

	let hasStarted = false;
	let hasFinished = false;

	let solvedWords: Solved[] = [];

	let showFinishedModal = false;

	let timeStartedAt: Date;
	let timeFinishedAt: Date;

	$: game.timeStartedAt = timeStartedAt?.getTime();
	$: game.timeFinishedAt = timeFinishedAt?.getTime();

	// check if user solved all the word
	// and valid grid that has more than or equal to 1 word
	$: if (game.words.length > 0 && game.words.length === solvedWords.length) {
		if (game.words.length === solvedWords.length) stopGame();
	}

	const startGame = () => {
		hasStarted = true;
		timeStartedAt = new Date();
	};

	const stopGame = () => {
		hasFinished = true;
		setShowFinishedModal(true);
	};

	const setShowFinishedModal = (status: boolean) => {
		showFinishedModal = status;
	};
</script>

<Meta title="Permainan | Cari Kata" description="Main sekarang!" />
<Ogp title="Permainan | Cari Kata" />

<main class="p-3 relative my-5 min-h-[400px]">
	{#if !hasStarted}
		<Modal
			class="bg-slate-50 dark:bg-slate-700 w-[250px] max-w-full px-2 py-1 shadow top-[70%] rounded"
		>
			<div slot="header" class="text-xl text-center mb-2">Cari Kata</div>
			<div class="content">
				<button
					class="px-6 py-2 block mx-auto bg-violet-600 text-gray-50 text-xl mt-2 mb-3 rounded shadow-sm hover:bg-violet-700 transition-colors"
					on:click={startGame}
				>
					Mula
				</button>
			</div>
			<div slot="footer" />
		</Modal>
	{/if}
	{#if hasStarted}
		<div
			id="ck-game"
			class="
grid grid-cols-1 mt-28 relative min-h-[400px]
lg:grid-cols-2 lg:gap-3 lg:mt-0"
		>
			<WordSearchGame
				grid={game.grid.grid}
				words={game.words}
				rows={game.grid.rows}
				columns={game.grid.columns}
				bind:solveds={solvedWords}
			/>
			<div class="bg-slate-50 dark:bg-slate-700 rounded-md">
				<header class="absolute bottom-[104%] left-0 w-full lg:static">
					<div class="content-header flex items-center justify-between my-4 px-4">
						<div class="title">
							<h2 class="text-2xl text-slate-800 dark:text-slate-100 font-semibold">
								{game.title}
							</h2>
							<small
								class="text-xs font-semibold text-slate-600 dark:text-slate-300 tracking-wider"
							>
								{game.grid.columns} x {game.grid.rows} GRID
							</small>
						</div>
						{#if hasFinished}
							<div class="finish-button">
								<button
									on:click={() => setShowFinishedModal(true)}
									class="block m-1 py-2 px-3 text-gray-50 bg-violet-600 rounded uppercase hover:bg-violet-700 transition-colors"
								>
									SELESAI
								</button>
							</div>
						{/if}
						<div class="timer flex flex-col items-end justify-center">
							<small class="label text-xs font-bold text-slate-600 dark:text-slate-300 uppercase">
								MASA
							</small>
							<Timer
								startAt={timeStartedAt}
								bind:finishAt={timeFinishedAt}
								start={true}
								stop={hasFinished}
							/>
						</div>
					</div>
				</header>
				<div class="px-3">
					<Words {solvedWords} words={game.words} />
				</div>
			</div>
		</div>
	{/if}

	{#if hasFinished && timeStartedAt && timeFinishedAt}
		<FinishModal
			bind:showModal={showFinishedModal}
			duration={timeFinishedAt.getTime() - timeStartedAt.getTime()}
		/>
	{/if}
</main>
