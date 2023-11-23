import type { Game } from './types';

export const functions: { [key: string]: WordFunction } = {
	IMPOSSIBLE: (game) => {
		// hidden random word

		const words = [...game.words];

		const MIN_CHARS = 3;

		const newWords = words.map((word) => {
			const amount = Math.floor(Math.random() * (word.length - 2 - MIN_CHARS + 1)) + MIN_CHARS;

			let hiddenIndexes: number[] = [];

			while (hiddenIndexes.length < amount) {
				if (amount > word.length) {
					hiddenIndexes = [...word].map((_, i) => i);
					break;
				}

				const randomIndex = Math.floor(Math.random() * word.length);
				if (hiddenIndexes.includes(randomIndex)) continue;
				hiddenIndexes.push(randomIndex);
			}

			const newWord = [...word];

			hiddenIndexes.forEach((index) => {
				newWord[index] = ' ';
			});
			return newWord.join('');
		});

		console.log(newWords);

		return game;
	}
};

type WordFunction = (game: Game) => Game;
