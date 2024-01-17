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

// line intercept math by Paul Bourke http://paulbourke.net/geometry/pointlineplane/
// Determine the intersection point of two line segments
// Return FALSE if the lines don't intersect
export function line_intersect(x1, y1, x2, y2, x3, y3, x4, y4): Coord | false {
	// Check if none of the lines are of length 0
	if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
		return false;
	}

	const denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);

	// Lines are parallel
	if (denominator === 0) {
		return false;
	}

	const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
	const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;

	// is the intersection along the segments
	if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
		return false;
	}

	// Return a object with the x and y coordinates of the intersection
	const x = x1 + ua * (x2 - x1);
	const y = y1 + ua * (y2 - y1);

	return { x, y };
}

export function parallelLineOverlap(
	line1: { start: Coord; end: Coord },
	line2: { start: Coord; end: Coord }
): Coord[] | false {
	// Function to swap coordinates if start is greater than end
	const swapCoordinates = (line: { start: Coord; end: Coord }) => {
		if (line.start.x > line.end.x || (line.start.x === line.end.x && line.start.y > line.end.y)) {
			return { start: line.end, end: line.start };
		}
		return line;
	};

	// Swap coordinates if needed
	line1 = swapCoordinates(line1);
	line2 = swapCoordinates(line2);

	// Check if the lines are parallel
	if (
		(line1.start.x - line1.end.x) * (line2.start.y - line2.end.y) ===
		(line2.start.x - line2.end.x) * (line1.start.y - line1.end.y)
	) {
		// Lines are parallel, check if they are overlapping on the x-axis
		if (
			Math.max(line1.start.x, line1.end.x) < Math.min(line2.start.x, line2.end.x) ||
			Math.min(line1.start.x, line1.end.x) > Math.max(line2.start.x, line2.end.x)
		) {
			return false; // No overlap on x-axis
		}

		// Check if they are overlapping on the y-axis
		if (
			Math.max(line1.start.y, line1.end.y) < Math.min(line2.start.y, line2.end.y) ||
			Math.min(line1.start.y, line1.end.y) > Math.max(line2.start.y, line2.end.y)
		) {
			return false; // No overlap on y-axis
		}

		const overlapCoords: Coord[] = [];

		// debugger;

		// Calculate overlap coordinates
		const overlapStartX = Math.max(line1.start.x, line2.start.x);
		const overlapStartY = Math.max(line1.start.y, line2.start.y);
		const overlapEndX = Math.min(line1.end.x, line2.end.x);
		const overlapEndY = Math.min(line1.end.y, line2.end.y);

		const direction = getDirection(overlapStartX, overlapStartY, overlapEndX, overlapEndY);
		const steps = getSteps(
			{ x: overlapStartX, y: overlapStartY },
			{ x: overlapEndX, y: overlapEndY }
		);

		for (let i = 0; i <= steps; i++) {
			const coord = {
				x: overlapStartX + direction.x * i,
				y: overlapStartY + direction.y * i
			};
			overlapCoords.push(coord);
		}

		return overlapCoords;
	}

	return false; // Lines are not parallel
}
export function isCoordOnLine(
	coord: Coord,
	line: { start: Coord; end: Coord },
	threshold: number = Number.EPSILON
): boolean {
	// Calculate the vector from start to end
	const lineVector = {
		x: line.end.x - line.start.x,
		y: line.end.y - line.start.y
	};

	// Calculate the vector from start to the given coordinate
	const coordVector = {
		x: coord.x - line.start.x,
		y: coord.y - line.start.y
	};

	// Calculate the cross product of the two vectors
	const crossProduct = lineVector.x * coordVector.y - lineVector.y * coordVector.x;

	// Check if the cross product is within the specified threshold
	if (Math.abs(crossProduct) >= threshold) {
		return false; // Point is not on the infinite line
	}

	// Check if the point is within the bounding box of the line segment
	const minX = Math.min(line.start.x, line.end.x);
	const maxX = Math.max(line.start.x, line.end.x);
	const minY = Math.min(line.start.y, line.end.y);
	const maxY = Math.max(line.start.y, line.end.y);

	return coord.x >= minX && coord.x <= maxX && coord.y >= minY && coord.y <= maxY;
}

// Binary search helper function
export function binarySearch(target: number, array: number[]): number {
	let low = 0;
	let high = array.length - 1;

	while (low <= high) {
		const mid = Math.floor((low + high) / 2);
		const midValue = array[mid];

		if (midValue === target) {
			return mid; // Target found
		} else if (midValue < target) {
			low = mid + 1;
		} else {
			high = mid - 1;
		}
	}

	return high; // Return the index of the element just before the target
}

export const getDirectionByAngle = (angle: number) => {
	const directions = {
		'0': { x: 1, y: 0 },
		'45': { x: 1, y: 1 },
		'90': { x: 0, y: 1 },
		'135': { x: -1, y: 1 },
		'180': { x: -1, y: 0 },
		'-45': { x: 1, y: -1 },
		'-90': { x: 0, y: -1 },
		'-135': { x: -1, y: -1 }
	};

	const angles = Object.keys(directions).map((i) => parseInt(i));
	if (!angles.includes(angle)) return false;

	return directions[angle.toString()];
};

// Function to calculate the length between two coordinates
export function getLineLength(start: Coord, end: Coord): number {
	const deltaX = Math.abs(end.x - start.x);
	const deltaY = Math.abs(end.y - start.y);

	// Using the Pythagorean theorem to calculate the distance
	const length = Math.sqrt(deltaX ** 2 + deltaY ** 2);

	return length;
}

export const getCoordIntersectPerpendicularOnAngle = (angle: number, base: Coord, coord: Coord) => {
	if (angle < 0) {
		// since angle is negative, 180 + angle to get the exterior angle
		const exterior = 180 + angle;
		angle = 180 + exterior;
	}

	// convert angle to radian
	// add Number.EPSILON to prevent absolute 0, 90, or 270
	const rad = ((angle + Number.EPSILON) * Math.PI) / 180;
	// line formula for base with angle
	const slope = Math.tan(rad);
	// y = mx + c
	// base.y = (slope)(base.x) + c
	// c = base.y - (slope)(base.x)
	const c1 = base.y - slope * base.x;

	// line formula for coord that is perpendicular to base
	const perpendicularSlope = -1 / slope;
	// y = mx + c
	// coord.y = (perpendicularSlope)(coord.x) + c
	// c = coord.y - (perpendicularSlope)(coord.x)
	const c2 = coord.y - perpendicularSlope * coord.x;

	// find intersection of two line

	// find x
	// (m1)x + c1 = (m2)x + c2
	// (m1)x - (m2)x = c2 - c1
	// (m1 - m2)x = c2 - c1
	// x = (c2 - c1) / (m1 - m2)
	const x = (c2 - c1) / (slope - perpendicularSlope);

	// find y
	// replace x with any line formula
	const y = slope * x + c1;

	return {
		x,
		y
	};
};
