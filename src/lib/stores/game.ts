import type { Mode } from '$lib/modes';
import type { Found, Game, Word } from '$lib/types';
import { colors } from '$lib/util';
import { derived, writable } from 'svelte/store';

export const grid = writable<string[][]>([]);

export const words = writable<Word[]>([]);

export const CELL_WIDTH = writable(0);

export const foundWords = writable<Found[]>([]);

export const game = writable<Game>({
	hasStarted: false,
	hasEnded: false,
	finishTime: null,
	startTime: null
});

export const checkGameFinish = derived(
	[game, words, foundWords],
	([$game, $words, $foundWords]) => {
		if (!$game.hasStarted) return false;
		if ($game.hasEnded) return false;
		if ($words.length <= 0) return false;
		if ($foundWords.length <= 0) return false;
		if ($foundWords.length !== $words.length) return false;

		game.update((game) => ({ ...game, hasEnded: true }));

		return true;
	}
);

game.subscribe((newState) => {
	if (newState.hasStarted && !newState.startTime) {
		game.update((game) => ({ ...game, startTime: new Date() }));
	}

	if (newState.hasEnded && !newState.finishTime) {
		game.update((game) => ({ ...game, finishTime: new Date() }));
	}
});

export const mode = writable<Mode>();
export const hideFiller = writable(false);
export const currentColor = writable(colors[Math.floor(Math.random() * colors.length)]);
