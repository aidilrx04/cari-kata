<script lang="ts">
	import { calcDistance, getAngle, getDirection, setCoord } from '../../lib/util';
	import { wordsearch } from '$lib/wordsearch';
	import type { Cell, Coord, Direction, LineData, Point } from '$lib/types';
	import Row from './Row.svelte';

	const _words = [
		'lobber',
		'prod',
		'reabsorb',
		'applets',
		'spectroscopic',
		'paganising',
		'fanatically',
		'flaxen',
		'outkeep',
		'berakes'
	];

	let found: string[] = [];
	// console.table(_words);
	const search = wordsearch(_words, 10, 10);

	$: grid = search.grid;
	$: solved = search.solved;
	$: words = search.words;

	let cell: Cell = {
		width: 30,
		height: 30
	};

	let base: Point;
	let origin: Point;

	let container: HTMLDivElement;

	let firstCoord: Coord;
	let lastCoord: Coord;
	let mouseIsDown: boolean;
	let direction: Direction;
	let checkAnswer: boolean;
	let foundLines: LineData[] = [];

	let mouse: Point = { x: 0, y: 0 };

	// colors to pick
	const colors = [
		'#476469',
		'#f0eee9',
		'#c70f0f',
		'#384c5a',
		'#d7bbb7',
		'#bbde7a',
		'#c5a493',
		'#db9c7c',
		'#cc3366',
		'#92644a',
		'#f1c7af',
		'#b1574c',
		'#d26626',
		'#818366',
		'#64997e',
		'#2c554e',
		'#a7af9b',
		'#b3a195',
		'#ab8664'
	];
	const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];
	let currentColor = getRandomColor();

	// effects
	$: if (container) {
		const rect = container.getBoundingClientRect();
		base = { x: rect.x, y: rect.y };
	}

	$: if (firstCoord) {
		// calc origin
		let x = cell.width / 2 + firstCoord[0] * cell.width;
		let y = cell.height / 2 + firstCoord[1] * cell.width;
		origin = { x, y };
	}

	$: if (firstCoord && lastCoord) {
		direction = getDirection(firstCoord[0], firstCoord[1], lastCoord[0], lastCoord[1]);
	}

	$: if (checkAnswer) {
		checkChars();
		checkAnswer = false;
	}

	const handleMouseDown = (e) => {
		const el = e.currentTarget;
		const coord = el.dataset.coord.split(',');
		firstCoord = setCoord(coord[0], coord[1]);
		mouseIsDown = true;
		currentColor = getRandomColor();
	};

	const handleMouseUp = (e) => {
		if (!mouseIsDown) return;
		const el = e.currentTarget;
		const coord = el.dataset.coord.split(',');
		lastCoord = setCoord(coord[0], coord[1]);
		mouseIsDown = false;
		checkAnswer = true;
	};

	const checkChars = () => {
		if (!checkAnswer) return;

		const angle = getAngle(firstCoord[0], firstCoord[1], lastCoord[0], lastCoord[1]);

		// only check if valid direction
		if (angle === 0 || angle % 45 === 0) {
			const chars: string[] = [];

			// amount needed to steps
			let stepDistance = Math.abs(lastCoord[0] - firstCoord[0]);
			if (angle === 90 || angle === -90) {
				stepDistance = Math.abs(lastCoord[1] - firstCoord[1]);
			}

			// debugger;
			for (let i = 0; i <= stepDistance; i++) {
				const totalSteps = { x: direction.x * i, y: direction.y * i };
				const char = grid[firstCoord[1] + totalSteps.y][firstCoord[0] + totalSteps.x];
				chars.push(char);
			}

			let word = chars.join('');
			let wordIndex = _words.indexOf(word);
			if (wordIndex >= 0 && !found.includes(word)) {
				// for line drawing
				const distance = calcDistance(
					{ x: firstCoord[0], y: firstCoord[1] },
					{ x: lastCoord[0], y: lastCoord[1] }
				);

				found = [...found, word];
				console.log(firstCoord);
				console.log(origin.x);
				foundLines = [
					...foundLines,
					{
						x: origin.x,
						y: origin.y,
						width: distance * cell.width + cell.width,
						rotation: angle,
						color: currentColor
					}
				];
			}
		}
	};

	const mouseMove = (e) => {
		const clientX = e.pageX;
		const clientY = e.pageY;

		mouse.x = clientX;
		mouse.y = clientY;
	};

	const calcLineWidth = (x1: number, y1: number, x2: number, y2: number) => {
		const width = calcDistance({ x: x1, y: y1 }, { x: x2, y: y2 }) + cell.width;
		return width;
	};
</script>

<svelte:body on:mousemove={mouseMove} style:position="relative" />
<div style="position:relative">
	<!-- <div
	style="width: 10px; height: 10px; background-color: red; position: absolute; top: {origin.y}px; left: {origin.x}px; transform: translate(-50%, -50%);"
/> -->
	<div id="game" style="overflow: hidden" bind:this={container}>
		<div class="lines">
			{#if foundLines.length > 0}
				{#each foundLines as line}
					<div
						class="line"
						style="position: absolute; z-index: 1;  opacity: 0.3"
						style:transform-origin="{cell.width / 2}px 50%"
						style:border-radius="{cell.height / 2}px"
						style:background-color={line.color ?? currentColor}
						style:height="{cell.height}px"
						style:width="{line.width}px"
						style:top="{line.y}px"
						style:left="{line.x}px"
						style:transform="translate(-{cell.height / 2}px, -{cell.width / 2}px) rotate({line.rotation}deg)"
					/>
				{/each}
			{/if}
			{#if mouseIsDown}
				<div
					style="position: absolute;z-index: 1; "
					style:border-radius="{cell.height / 2}px"
					style:transform-origin="{cell.width / 2}px 50%"
					style:background-color={currentColor}
					style:height="{cell.height}px"
					style:width="{calcLineWidth(origin.x, origin.y, mouse.x - base.x, mouse.y - base.y)}px"
					style:top="{origin.y}px"
					style:left="{origin.x}px"
					style:transform="translate(-{cell.height / 2}px, -{cell.width / 2}px) rotate({getAngle(
						origin.x + base.x,
						origin.y + base.y,
						mouse.x,
						mouse.y
					)}deg)"
					style:opacity="0.5"
				/>
			{/if}
		</div>
		<!-- 
		i === y, j === x -->
		{#each solved as row, i}
			<Row {row} rowCount={i} on:mouseup={handleMouseUp} on:mousedown={handleMouseDown} />
		{/each}
	</div>
	<div class="words">
		<ul>
			{#each search.words.filter((w) => !found.includes(w)) as word}
				<li>{word}</li>
			{/each}
		</ul>
		found
		<ul>
			{#each found as word}
				<li>{word}</li>
			{/each}
		</ul>
	</div>
</div>
<!-- <script>
    
    let mouseIsDown = false;
	let pickedChars: string[] = [];
	let finishPicking = false;

	const cellWidth = 30; // in px
	const cellHeight = 30;

	let origin = {
		x: 0,
		y: 0
	};
	let direction;
	let lastPickCoord;

	$: console.table(search.words);
	// $: console.table(direction);
	// $: console.log(origin);
	// $: if (container) {
	// 	const rect = container.getBoundingClientRect();

	// 	baseX = rect.x;
	// 	baseY = rect.y;
	// }
	// $: console.log(mouseIsDown);
	$: console.log(pickedChars);

	$: if (finishPicking) {
		const constructedWord = pickedChars.join('');

		if (search.words.indexOf(constructedWord) >= 0) {
			console.log('Hey you found ', constructedWord);
		} else {
			// console.log(constructedWord, 'is not a valid word. try again');
		}
		pickedChars = [];
		finishPicking = false;
	}

	const handleMouseDown = (i, j) => {
		if (!mouseIsDown) pickChar(i, j);
		const loc = getLoc(i, j);
		mouseIsDown = true;
	};

	const handleMouseUp = () => {
		mouseIsDown = false;
		finishPicking = true;
	};

	const handleMouseMove = (e: MouseEvent & { currentTarget: EventTarget & HTMLSpanElement }) => {
		if (mouseIsDown) {
			const rect = e.currentTarget.getBoundingClientRect();
			direction = getDirection(origin.x, origin.y, rect.x + cellWidth / 2, rect.y + cellHeight / 2);
		}
	};

	const pickChar = (i: number, j: number) => {
		pickedChars = [...pickedChars, search.solved[i][j]];
	};

	const getLoc = (x, y) => {};
	// getDirection();
</script> -->

<!-- 

<span
					data-char={cell}
					data-coord={[j, i]}
					style:--width={`${cellWidth}px`}
					style:--height={`${cellHeight}px`}
					style:background={mouseIsDown ? 'gray' : 'white'}
					on:mousedown={(e) => {
						const el = e.currentTarget;
						const rect = el.getBoundingClientRect();

						origin.x = rect.x + cellWidth / 2;
						origin.y = rect.y + cellHeight / 2;

						lastPickCoord = el.dataset.coord?.split(',');
						console.log(lastPickCoord);

						handleMouseDown(i, j);
					}}
					on:mouseup={() => {
						console.log('mouse up');
						handleMouseUp();
					}}
					on:mouseenter={(e) => {
						if (mouseIsDown) {
							// pickChar(i, j);
							const el = e.currentTarget;
							const rect = el.getBoundingClientRect();

							const x = rect.x + cellWidth / 2;
							const y = rect.y + cellHeight / 2;

							direction = getDirection(origin.x, origin.y, x, y);
							let currentCoord = el?.dataset?.coord.split(',');

							console.table(direction);
							console.table(lastPickCoord);
							console.table(currentCoord);
							console.log(parseInt(lastPickCoord[0]) + direction.x);
							console.log(parseInt(currentCoord[0]));
							console.log(parseInt(lastPickCoord[0]) + direction.x === parseInt(currentCoord[0]));

							if (lastPickCoord) {
								if (
									parseInt(lastPickCoord[0]) + direction.x === parseInt(currentCoord[0]) &&
									parseInt(lastPickCoord[1]) + direction.y === parseInt(currentCoord[1])
								) {
									lastPickCoord = currentCoord;
									pickChar(i, j);
									console.log('correct position and direction');
								} else {
									console.log('invalid position');
								}
							} else {
								console.log(direction);
							}

							// 	const dir = getDirection(origin.x, origin.y, x, y);

							// 	console.table(dir);
						}
					}}>{cell.trim() === '' ? '-' : cell}</span
				>

 -->
<style>
	/* #game {
		position: absolute;
		top: 0;
		left: 50%;
		transform: translate(-50%, -50%);
	} */
</style>
