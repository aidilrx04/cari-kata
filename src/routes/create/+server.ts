import { API_URL } from '$lib/config';
import { wordsearch } from '$lib/wordsearch';
import { json, type Actions, type RequestHandler, error, redirect } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, fetch, cookies }) => {
	const data = await request.json();
	const token = await cookies.get('token');

	if (!token) throw error(401, { message: 'Unauthenticated' });

	const { core, totalWords } = data;
	let words: string[];
	let grid: string[][];
	let solved: string[][];

	console.log(core.words);

	if (core.words.length === 0) {
		const maxLength = Math.min(core.grid.rows, core.grid.columns);

		const wordsBefore = (
			await (
				await fetch(
					`https://bahasa-api.vercel.app/api/word?amount=${totalWords}&length=${maxLength}`
				)
			).json()
		)
			.map((word) => word.word)
			.reduce((acc, curr) => [...acc, curr], []);

		const ws = wordsearch(wordsBefore, core.grid.columns, core.grid.rows);
		words = ws.words;
		grid = ws.grid;
		solved = ws.solved;
	} else {
		words = core.words;
		grid = core.grid.grid;
		solved = core.grid.solved;
	}

	// create game

	core.grid.solved = solved;
	core.grid.grid = grid;
	core.words = words;

	const formBody = JSON.stringify(core);

	const game = await (
		await fetch(`${API_URL}/games`, {
			method: 'post',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: formBody
		})
	).json();

	return json({
		game: game.data
	});
};
