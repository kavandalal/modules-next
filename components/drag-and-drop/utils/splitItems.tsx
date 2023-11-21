import { Chunk } from '../types';

function sliceIntoItems<T>(maxItems: number, items: T[]): T[][] {
	const numberOfSlices: number = Math.ceil(items.length / maxItems);
	const sliceIndexes: number[] = Array(numberOfSlices)
		.fill(0)
		.map((_, index: number) => index);
	return sliceIndexes.map((index: number) => items.slice(index * maxItems, index * maxItems + maxItems));
}

function mapToChunk(createId: () => string) {
	return function <T>(items: T[]): Chunk<T> {
		return {
			id: createId(),
			items,
		};
	};
}

export function splitItems<T>(maxItems: number, items: T[], createId: () => string): Chunk<T>[] {
	const slicedItems: T[][] = sliceIntoItems(maxItems, items);
	return slicedItems.map(mapToChunk(createId));
}
