import { API_URL } from '$lib/config';
import type { Game } from '$lib/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch, cookies }) => {
	const gameId = params.id;

	const authToken = await cookies.get('token');

	const gameData = await (
		await fetch(`${API_URL}/games/${gameId}`, {
			method: 'get',
			headers: {
				Authorization: `Bearer ${authToken}`,
				Accept: 'application/json'
			}
		})
	).json();

	console.log(gameData);

	return {
		game: gameData.data as Game
	};
};
