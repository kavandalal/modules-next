'use client';

import { useState } from 'react';
import { v4 } from 'uuid';
import { DropResult } from 'react-beautiful-dnd';

import { ListManager } from '@/components/drag-and-drop';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { AlignJustify, LayoutGrid } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

function reorder<T>(items: T[], moveIndex: number, targetIndex: number): T[] {
	const moveItem = items[moveIndex];
	const newItems = [...items];

	newItems.splice(moveIndex, 1);
	newItems.splice(targetIndex, 0, moveItem);

	return newItems;
}

type Toptions = {
	layout: 'vertical' | 'horizontal';
	maxItems: number;
};

export default function DragAndDrop() {
	const initialItems = [
		{
			id: '101',
			name: 'Black Clover',
			classes: 'bg-rose-600 text-white',
		},
		{
			id: '102',
			name: 'Arcane',
			classes: 'bg-violet-500 text-white',
		},
		{
			id: '103',
			name: 'The Office',
			classes: 'bg-fuchsia-700 text-white',
		},
		{
			id: '104',
			name: 'Dexter',
			classes: 'bg-red-300 text-black',
		},
		{
			id: '105',
			name: 'Two and a half man',
			classes: 'bg-yellow-500 text-white',
		},

		{
			id: '106',
			name: 'Inception',
			classes: 'bg-green-800 text-white',
		},
		{
			id: '107',
			name: 'Dark',
			classes: 'bg-orange-600 text-white',
		},
		{
			id: '108',
			name: 'Chernobyl',
			classes: 'bg-purple-600 text-white',
		},
	];
	const [items, setItems] = useState(initialItems);
	const [options, setOptions] = useState<Toptions>({ layout: 'vertical', maxItems: 2 });

	function handleDragEnd({ destination, source }: Partial<DropResult>) {
		if (!destination || !source) {
			return;
		}

		if (destination.index === source.index) {
			return;
		}

		setItems((items) => {
			return reorder(items, source.index, destination.index);
		});
	}

	const changeType = (newVal: 'vertical' | 'horizontal') => {
		setOptions((prev) => ({ ...prev, layout: newVal }));
	};

	const handleChange = (e: any) => {
		const { name, value } = e.target;
		setOptions((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	return (
		<section className=' md:container justify-center items-center flex-row gap-3'>
			<div className='text-4xl font-bold text-center my-5 text-[hsl(var(--primary))]'>
				Drag&Drop (Custom react-beautify-dnd)
			</div>
			<div className='container text-xl '>
				<div className='flex justify-between'>
					<div />
					<div className='flex'>
						<ToggleGroup type='single' value={options?.layout}>
							<ToggleGroupItem value={'vertical'} aria-label='Grid' onClick={() => changeType('vertical')}>
								<AlignJustify />
							</ToggleGroupItem>
							<ToggleGroupItem value={'horizontal'} aria-label='List' onClick={() => changeType('horizontal')}>
								<LayoutGrid />
							</ToggleGroupItem>
						</ToggleGroup>
						{options?.layout === 'horizontal' && (
							<div className='ms-2'>
								<Input
									type='number'
									name='maxItems'
									placeholder='Max items in row'
									min={2}
									value={options?.maxItems}
									onChange={handleChange}
								/>
							</div>
						)}
					</div>
				</div>
				<div className=''>
					<ListManager
						chunkClassName={'chunk'}
						items={items}
						maxItems={options?.layout === 'vertical' ? 3 : options?.maxItems}
						render={({ id, name, classes }, index) => (
							<div key={id} className={`${classes} w-full p-4 m-3 text-2xl text-center border rounded`}>
								{name}
							</div>
						)}
						// direction={'vertical' || 'horizontal'}
						direction={options?.layout}
						onDragEnd={handleDragEnd}
					/>
				</div>
			</div>
		</section>
	);
}
