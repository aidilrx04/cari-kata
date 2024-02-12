import { API_URL } from '$lib/config';
import type { Game } from '$lib/types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, cookies, fetch, parent }) => {
	const gameId = params.id;
	const authToken = cookies.get('token');

	const data = await (
		await fetch(`${API_URL}/games/${gameId}`, {
			method: 'get',
			headers: {
				Authorization: `Bearer ${authToken}`,
				Accept: 'application/json'
			}
		})
	).json();

	return {
		game: data.data as Game
	};
};
