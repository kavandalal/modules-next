import React, { ReactNode } from 'react';
import { Draggable, DraggableProvided } from 'react-beautiful-dnd';

export interface ListManagerItemProps<T extends { id: string }> {
	item: T;
	index: number;
	render(item: T, index: number): ReactNode;
	itemClassName?: string;
	isDisabled?: boolean;
}

export function ListManagerItem<T extends { id: string }>({
	item,
	index,
	render,
	itemClassName,
	isDisabled,
}: ListManagerItemProps<T>) {
	// console.log(isDisabled, item.id);
	return (
		<Draggable isDragDisabled={isDisabled} draggableId={item.id} index={index}>
			{(provided: DraggableProvided) => (
				<div
					ref={provided.innerRef}
					className={itemClassName}
					{...provided.draggableProps}
					{...provided.dragHandleProps}>
					{render(item, index)}
				</div>
			)}
		</Draggable>
	);
}
