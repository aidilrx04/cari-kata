import { MODE_TYPES, type Mode } from '$lib/modes';
import type { Game, Word } from '$lib/types';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

// const apiUrl = 'http://bahasa-api.coolpage.biz/api/word/';
const apiUrl = 'https://bahasa-api.vercel.app/api/word';

export const prerender = false;

const preconfigGames: { [key: string]: Game } = {
	EASY: {
		title: 'Mudah',
		words: [],
		grid: {
			row: 9,
			column: 7,
			backwardProbability: 0.25,
			diagonalProbability: 0.25
		}
	},
	NORMAL: {
		title: 'Sederhana',
		words: [],
		grid: {
			row: 11,
			column: 9,
			backwardProbability: 0.5,
			diagonalProbability: 0.5
		}
	},
	HARD: {
		title: 'Sukar',
		words: [],
		grid: {
			row: 13,
			column: 13,
			backwardProbability: 0.75,
			diagonalProbability: 0.75
		}
	}
};

export const load: PageServerLoad = async (req) => {
	const { url } = req;

	const modeStr = url.searchParams.get('mode');

	if (!modeStr) throw redirect(307, '/mode');

	const game = preconfigGames[modeStr.toUpperCase()];

	if (!game) throw redirect(307, '/mode');

	const totalWords = 30;
	const wordLength = game.grid.column;

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

	game.words = responseData;

	return {
		game
	};
};

const getModeFromStr = (modeStr: string): Mode | false => {
	const validModes = Object.entries(MODE_TYPES).map((n) => n[1].type.toString());
	const modeIndex = validModes.indexOf(modeStr);
	if (modeIndex < 0) return false;

	return MODE_TYPES[validModes[modeIndex]];
};
