import type { Game } from './types';

export const functions: { [key: string]: WordFunction } = {
	IMPOSSIBLE: (game) => {
		// hidden random word

		const words = [...game.words];

		const MIN_CHARS = 3;

		const newWords = words.map(({ value: word }) => {
			const amount = Math.floor(Math.random() * (word.length - 2 - MIN_CHARS + 1)) + MIN_CHARS;

			let visibleIndexes: number[] = [];

			while (visibleIndexes.length < amount) {
				if (amount > word.length) {
					visibleIndexes = [...word].map((_, i) => i);
					break;
				}

				const randomIndex = Math.floor(Math.random() * word.length);
				if (visibleIndexes.includes(randomIndex)) continue;
				visibleIndexes.push(randomIndex);
			}

			// make the letter invisible if not included in visibleIndexes
			const newWord = [...word].map((letter, index) =>
				visibleIndexes.indexOf(index) >= 0 ? letter : ' '
			);

			return {
				value: word,
				display: newWord.join('')
			};
		});

		game.words = newWords;

		return game;
	}
};

type WordFunction = (game: Game) => Game;
