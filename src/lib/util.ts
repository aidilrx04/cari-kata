import type { Coord, Direction, Point } from './types';

export const getDirection = (ox: number, oy: number, x: number, y: number): Direction => {
	const directions = {
		0: 'up',
		1: 'top-right',
		2: 'right',
		3: 'bottom-right',
		4: 'bottom',
		5: 'bottom-left',
		6: 'left',
		7: 'top-left'
	};
	const steps = {
		0: { x: 0, y: -1, name: directions[0] },
		1: { x: 1, y: -1, name: directions[1] },
		2: { x: 1, y: 0, name: directions[2] },
		3: { x: 1, y: 1, name: directions[3] },
		4: { x: 0, y: 1, name: directions[4] },
		5: { x: -1, y: 1, name: directions[5] },
		6: { x: -1, y: 0, name: directions[6] },
		7: { x: -1, y: -1, name: directions[7] }
	};

	const mx = x - ox;
	const my = y - oy;
	let direction = {
		x: 0,
		y: 0,
		name: 'default'
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

export const getAngle = (x1, y1, x2, y2) => {
	// calc dot product
	const rad = Math.atan2(y2 - y1, x2 - x1);

	return (rad * 180) / Math.PI;
};

export const calcDistance = (p1: Point, p2: Point): number => {
	const xLength = p2.x - p1.x;
	const yLength = p2.y - p1.y;
	const hipotenus = Math.sqrt(Math.pow(xLength, 2) + Math.pow(yLength, 2));

	return hipotenus;
};

export const setCoord = (x: number | string, y: number | string): Coord => [
	parseInt(x as string),
	parseInt(y as string)
];
