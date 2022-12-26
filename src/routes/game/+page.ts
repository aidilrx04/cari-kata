import { MODE_TYPES, type Mode } from '$lib/modes';
import type { Word } from '$lib/types';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

// const apiUrl = 'http://bahasa-api.coolpage.biz/api/word/';
const apiUrl = 'https://bahasa-api.vercel.app/api/word';

export const prerender = false;

export const load: PageLoad = async (req) => {
	const { url } = req;

	const modeStr = url.searchParams.get('mode');
	const mode = getModeFromStr(modeStr ?? '') as Mode;
	const shouldRedirect = !modeStr && !mode;

	if (shouldRedirect) throw redirect(307, '/mode');

	const totalWords = 30;
	const wordLength = mode.grid.column - 2;

	const queryString = new URLSearchParams({
		amount: totalWords.toString(),
		length: wordLength.toString()
	}).toString();

	let response: Response;

	const dataURL = `${apiUrl}?${queryString}`;
	try {
		response = await req.fetch(dataURL);
	} catch (e) {
		console.log('error');
		throw redirect(302, '/mode');
	}

	const responseData = await response.json();

	return {
		words: responseData as Word[],
		type: mode
	};
};

const getModeFromStr = (modeStr: string): Mode | false => {
	const validModes = ['easy', 'normal', 'hard', 'impossible'];
	const modeIndex = validModes.indexOf(modeStr);
	if (modeIndex < 0) return false;

	return MODE_TYPES[modeIndex + 1];
};
