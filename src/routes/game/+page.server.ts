import type { Game, Word } from '$lib/types';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { wordsearch } from '$lib/wordsearch';

// const apiUrl = 'http://bahasa-api.coolpage.biz/api/word/';
const apiUrl = 'https://bahasa-api.vercel.app/api/word';

export const prerender = false;

const preconfigGames: { [key: string]: Game } = {
	EASY: {
		title: 'Mudah',
		words: [],
		grid: {
			rows: 9,
			columns: 7,
			grid: [],
			solved: []
		},
		backwardProbability: 0.25
	},
	NORMAL: {
		title: 'Sederhana',
		words: [],
		grid: {
			rows: 11,
			columns: 9,
			grid: [],
			solved: []
		},
		backwardProbability: 0.5
	},
	HARD: {
		title: 'Sukar',
		words: [],
		grid: {
			rows: 13,
			columns: 13,
			grid: [],
			solved: []
		},
		backwardProbability: 0.75
	},
	IMPOSSIBLE: {
		title: 'Mustahil',
		words: [],
		grid: {
			rows: 15,
			columns: 13,
			grid: [],
			solved: []
		},
		backwardProbability: 0.75,
		functions: ['IMPOSSIBLE']
	}
};

export const load: PageServerLoad = async (req) => {
	const { url } = req;

	const modeStr = url.searchParams.get('mode');

	if (!modeStr) throw redirect(307, '/mode');

	const game = preconfigGames[modeStr.toUpperCase()];

	if (!game) throw redirect(307, '/mode');

	const totalWords = 30;
	const wordLength = game.grid.columns;

	const queryString = new URLSearchParams({
		amount: totalWords.toString(),
		length: wordLength.toString()
	}).toString();

	let response: Response;

	const dataURL = `${apiUrl}?${queryString}`;
	try {
		response = await req.fetch(dataURL);
	} catch (e) {
		console.error('error', e);
		throw redirect(302, '/mode');
	}

	const responseData = await response.json();

	// create grid
	const words = wordsResponseToWords(responseData);
	const wordString = words.map((word) => word.value);

	const result = wordsearch(wordString, game.grid.columns, game.grid.rows, {
		backwards: game.backwardProbability,
		totalWordsInGrid: 16
	});

	game.words = result.words.map((word) => ({ value: word, display: word }));
	game.grid.grid = result.grid;
	game.grid.solved = result.solved;

	return {
		game
	};
};

const wordsResponseToWords = (response): Word[] => {
	const words = response.map((word) => ({ value: word.word, display: word.word }));

	return words;
};
