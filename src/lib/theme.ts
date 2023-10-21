import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import type { Theme } from './types';

export const theme = writable<Theme>('system');
export const currentTheme = writable<'light' | 'dark'>('dark');

/**!should be use on client only!
 */
const matchDarkModeMedia = () => {
	return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

// initiate theme if not exist yet
if (browser) {
	const storedTheme = localStorage.getItem('theme') as Theme | null;

	if (storedTheme !== null) {
		theme.set(storedTheme);
		if (storedTheme === 'system') {
			const isPreferDark = matchDarkModeMedia();
			if (isPreferDark) {
				currentTheme.set('dark');
			} else {
				currentTheme.set('light');
			}
		}
	}
}

theme.subscribe(($theme) => {
	if (browser) {
		localStorage.setItem('theme', $theme);

		if ($theme === 'system') {
			currentTheme.set(matchDarkModeMedia() ? 'dark' : 'light');
			return;
		}

		currentTheme.set($theme);
	}
});
