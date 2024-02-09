import { writable } from 'svelte/store';

export const pickRandomColor = (colors: string[]) => {
	return colors[Math.floor(Math.random() * colors.length)];
};

export const colors = [
	'#ef4444',
	'#fb923c',
	'#84cc16',
	'#4ade80',
	'#059669',
	'#5eead4',
	'#22d3ee',
	'#0369a1',
	'#2563eb',
	'#3730a3',
	'#a855f7',
	'#f43f5e',
	'#be185d'
];

export const currentColor = writable(pickRandomColor(colors));

export const updateCurrentColor = () => {
	currentColor.set(pickRandomColor(colors));
};
