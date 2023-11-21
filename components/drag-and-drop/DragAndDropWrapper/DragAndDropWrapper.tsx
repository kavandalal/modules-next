import React, { ReactElement } from 'react';
import { DragDropContext, Droppable, DroppableProvided, OnDragEndResponder } from 'react-beautiful-dnd';
import { Chunk } from '../types';
import { ListManagerItem } from './ListManagerItem';

export interface Props<T> {
	chunks: Chunk<T>[];
	direction: 'horizontal' | 'vertical';
	render(item: T, index: number): ReactElement;
	onDragEnd: OnDragEndResponder;
	chunkClassName?: string;
	itemClassName?: string;
	isDisabled?: boolean;
}

const horizontalStyle: React.CSSProperties = {
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'flex-start',
};

export function DragAndDropWrapper<T extends { id: string }>({
	onDragEnd,
	chunks,
	direction,
	render,
	chunkClassName,
	itemClassName,
	isDisabled,
}: Props<T>) {
	return (
		<DragDropContext onDragEnd={onDragEnd}>
			{chunks.map(({ id: droppableId, items }: Chunk<T>) => (
				<Droppable key={droppableId} droppableId={droppableId} direction={direction}>
					{(provided: DroppableProvided) => (
						<div
							ref={provided.innerRef}
							className={chunkClassName}
							style={direction === 'horizontal' ? horizontalStyle : undefined}
							{...provided.droppableProps}>
							{items.map((item: T, index: number) => (
								<ListManagerItem
									key={index}
									isDisabled={isDisabled}
									itemClassName={itemClassName}
									item={item}
									index={index}
									render={render}
								/>
							))}
							{provided.placeholder}
						</div>
					)}
				</Droppable>
			))}
		</DragDropContext>
	);
}
