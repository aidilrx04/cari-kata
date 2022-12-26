import { browser } from '$app/environment';
import { MODES } from '$lib/modes';
import { writable } from 'svelte/store';

export type Stats = {
	win: number;
	total: number;
	total_time: number; // in seconds; only when win effect this
	history: string[];
	mode: {
		[MODES.EASY]: { total: number; win: number };
		[MODES.NORMAL]: { total: number; win: number };
		[MODES.HARD]: { total: number; win: number };
		[MODES.IMPOSSIBLE]: { total: number; win: number };
	};
};

// const defaultStats = {
// 	win: 0,
// 	total: 0,
// 	history: [],
// 	mode: {
// 		easy: 0,
// 		normal: 0,
// 		hard: 0
// 	}
// };

let statsState: Stats = {
	win: 0,
	total: 0,
	total_time: 0,
	history: [],
	mode: {
		[MODES.EASY]: { total: 0, win: 0 },
		[MODES.NORMAL]: { total: 0, win: 0 },
		[MODES.HARD]: { total: 0, win: 0 },
		[MODES.IMPOSSIBLE]: { total: 0, win: 0 }
	}
};

console.log(typeof localStorage !== undefined);
if (browser) {
	if (typeof localStorage !== undefined) {
		const storedStats = localStorage.getItem('stats');
		if (!storedStats) {
			localStorage.setItem('stats', JSON.stringify(statsState));
		} else {
			try {
				statsState = JSON.parse(storedStats);
			} catch (e) {
				// do nothing
			}
		}
	}
}

const stats = writable(statsState);

export default stats;

stats.subscribe((newValue) => {
	if (browser)
		if (typeof localStorage !== undefined) {
			localStorage.setItem('stats', JSON.stringify(newValue));
		}
});
