import { derived, writable } from 'svelte/store';
import type { Mode } from './modes';
import { calculateHighlightWidth, colors } from './util';

export const grid = writable<string[][]>([]);
export const words = writable<string[]>([]);
export const displayTexts = writable<string[]>();

export const CELL_WIDTH = writable(0);
export const HIGHLIGHT = derived(CELL_WIDTH, ($CELL_WIDTH) => calculateHighlightWidth($CELL_WIDTH));

export const validateAnswer = writable(false);

export const cells = writable<{ start: number[]; end: number[] }>({
	start: [],
	end: []
});

export const isMouseDown = writable(false);

export const highlights = writable<
	{ start: number[]; end: number[]; rotation: number; color: string }[]
>([]);

export const gridRect = writable<DOMRect>();

export const foundWords = writable<{
	words: string[];
	coords: number[][];
	colors: string[];
}>({
	words: [],
	coords: [],
	colors: []
});

export const currentColor = writable(colors[Math.floor(Math.random() * colors.length)]);

export const hideFiller = writable(false);

export const isGameStarted = writable(false);

export const startTime = derived(isGameStarted, ($isGameStarted) => $isGameStarted && new Date());

export const isGameFinished = derived(
	[isGameStarted, words, foundWords],
	([$isGameStarted, $words, $foundWords]) => {
		if (!$isGameStarted) return false;
		if ($words.length <= 0) return false;
		if ($foundWords.words.length <= 0) return false;
		if ($foundWords.words.length !== $words.length) return false;

		return true;
	}
);

// export const isGameFinished = writable(false);

export const finishTime = derived(isGameFinished, ($isGameFinished) => {
	if ($isGameFinished) return new Date();
});

export const type = writable<Mode>();

export const isTouchDown = writable(false);
