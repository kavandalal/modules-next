'use client';

import React from 'react';
import { DropResult, OnDragEndResponder } from 'react-beautiful-dnd';
import { DragAndDropWrapper, Props } from './DragAndDropWrapper/DragAndDropWrapper';
import { Chunk } from './types';
import { computeOriginalIndex, computeOriginalIndexAfterDrop, splitItems } from './utils';
import { v4 } from 'uuid';

export interface WithMaxItemsProps<T> {
	items: T[];
	maxItems?: number;
	onDragEnd: (result: Partial<DropResult>) => void;
	direction: 'horizontal' | 'vertical';
}

const createId = v4;

function ComponentWithMaxItems<T extends { id: string }>(props: WithMaxItemsProps<T> & Omit<Props<T>, 'chunks'>) {
	const maxItems: number = props.maxItems && props.maxItems > 0 ? props.maxItems : props.items.length;

	const chunks = splitItems(maxItems, props.items, createId);
	const findChunkIndex = (id: string): number => chunks.findIndex((chunk: Chunk<T>) => chunk.id === id);

	const onDragEnd: OnDragEndResponder = ({ source, destination }) => {
		if (destination) {
			const { index: indexInSourceChunk, droppableId: sourceChunkId } = source;
			const { index: indexInDestinationChunk, droppableId: destinationChunkId } = destination;
			const sourceChunkIndex: number = findChunkIndex(sourceChunkId);
			const destinationChunkIndex: number = findChunkIndex(destinationChunkId);

			const sourceIndex: number = computeOriginalIndex(maxItems, sourceChunkIndex, indexInSourceChunk);
			const destinationIndex: number = computeOriginalIndexAfterDrop(
				maxItems,
				sourceChunkIndex,
				destinationChunkIndex,
				indexInDestinationChunk
			);
			props.onDragEnd({
				source: { index: sourceIndex, droppableId: sourceChunkId },
				destination: {
					index: destinationIndex,
					droppableId: destinationChunkId,
				},
			});
		}
	};

	return (
		<DragAndDropWrapper
			chunks={chunks}
			direction={props.direction}
			render={props.render}
			chunkClassName={props.chunkClassName}
			itemClassName={props.itemClassName}
			isDisabled={props.isDisabled}
			onDragEnd={onDragEnd}
		/>
	);
}

export const ListManager = ComponentWithMaxItems;
