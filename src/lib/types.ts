export type Point = {
	x: number;
	y: number;
};

export type Cell = {
	width: number;
	height: number;
};

export type Coord = [number, number];

export type Direction = Point & {
	name: string;
};

export type LineData = Point & {
	width: number;
	rotation: number;
	color?: string;
};
