import type { Coord } from './types';

export const getDirection = (ox: number, oy: number, x: number, y: number) => {
	const steps = {
		0: { x: 0, y: -1 },
		1: { x: 1, y: -1 },
		2: { x: 1, y: 0 },
		3: { x: 1, y: 1 },
		4: { x: 0, y: 1 },
		5: { x: -1, y: 1 },
		6: { x: -1, y: 0 },
		7: { x: -1, y: -1 }
	};

	const mx = x - ox;
	const my = y - oy;
	let direction = {
		x: 0,
		y: 0
	};

	if (mx === 0 && my < 0) {
		direction = steps[0];
	} else if (mx > 0 && my < 0) {
		direction = steps[1];
	} else if (mx > 0 && my === 0) {
		direction = steps[2];
	} else if (mx > 0 && my > 0) {
		direction = steps[3];
	} else if (mx === 0 && my > 0) {
		direction = steps[4];
	} else if (mx < 0 && my > 0) {
		direction = steps[5];
	} else if (mx < 0 && my === 0) {
		direction = steps[6];
	} else if (mx < 0 && my < 0) {
		direction = steps[7];
	} else {
		direction = steps[0];
	}

	return direction;
};

export const getSteps = (a: Coord, b: Coord) => {
	if (a.x === b.x && a.y === b.y) return 0;

	let steps = 0;
	if (a.x === b.x) {
		steps = Math.abs(a.y - b.y);
	} else {
		steps = Math.abs(a.x - b.x);
	}
	return steps;
};

export const getAngle = (x1, y1, x2, y2) => {
	// calc dot product
	const rad = Math.atan2(y2 - y1, x2 - x1);
	const degree = (rad * 180) / Math.PI;
	return degree;
};

export const calcDistance = (p1: Point, p2: Point): number => {
	const xLength = p2.x - p1.x;
	const yLength = p2.y - p1.y;
	const hipotenus = Math.sqrt(Math.pow(xLength, 2) + Math.pow(yLength, 2));
	return hipotenus;
};

export const validateAngle = (start: Coord, end: Coord) => {
	const validAngles = [0, 45, 90, 135, 180, -45, -90, -135];

	const angle = getAngle(start.x, start.y, end.x, end.y);

	if (!validAngles.includes(angle)) return false;
	return angle;
};

export const calculateHighlightWidth = (base: number) => {
	const percentage = 20 / 100;
	return base - base * percentage;
};

export function shuffle(array: unknown[]) {
	let currentIndex = array.length,
		randomIndex: number;

	// While there remain elements to shuffle.
	while (currentIndex != 0) {
		// Pick a remaining element.
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
	}

	return array;
}

export const addPrefix = (number: number, prefix: string, length = 2): string => {
	const numberStr = number.toString();
	if (numberStr.length >= length) return numberStr;

	const totalToAdd = length - numberStr.length;
	return prefix.toString().repeat(totalToAdd).concat(numberStr);
};

export const isValidCellElement = (element: HTMLElement) => {
	const targetElement = 'span';
	const targetContainClass = 'cell';

	if (
		element?.tagName.toLowerCase() !== targetElement ||
		!element.classList.contains(targetContainClass)
	) {
		return false;
	}

	return true;
};

export const getCoordFromString = (str: string): Coord => {
	const arr = str.split(',');

	if (arr.length !== 2) throw Error('Invalid Coord');
	const x = Number(arr[0]);
	const y = Number(arr[1]);

	if (Number.isNaN(x) || Number.isNaN(y)) {
		throw Error('Invalid coord numbers');
	}

	return {
		x,
		y
	};
};
