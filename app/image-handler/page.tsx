'use client';

import React, { useCallback, useState } from 'react';
import DropZone from '@/components/image-upload/drop-zone';
import CropDialog from '@/components/image-upload/crop-dialog';
import { previewToBlob } from '@/helper/previewToBlob';
import { blobToPreview } from '@/helper/blobToPreview';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import FilterDialog from '@/components/image-upload/filter-dialog';
import { TFilterDialog, TFilterState, TImageObj, defaultFilter, imageObj } from '@/components/image-upload/types.image';
import { Crop, MoreVertical, Trash2 } from 'lucide-react';
import { Popover } from '@/components/ui/popover';
import { PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';

export default function Page() {
	const [imagesHere, setImageHere] = useState<TImageObj[]>([] as TImageObj[]);
	const [editImg, setEditImg] = useState<TImageObj>({
		index: undefined,
		display: '',
		blob: new Blob(),
		name: '',
		size: 0,
		type: '',
	});
	const [filter, setFilter] = useState<TFilterState>(defaultFilter);

	const onCloseImage = useCallback(
		(dataArr: TImageObj[]) => {
			if (!dataArr) return false;

			if (filter.multiple) {
				setImageHere((prev) => [...prev, ...dataArr]);
			} else {
				setImageHere(dataArr);
			}

			if (!filter.multiple && dataArr.length > 0) {
				setEditImg({ index: 0, ...dataArr[0] });
			}
			return true;
		},
		[filter]
	);

	const editHandle = async (index: number = 0) => {
		const editThis = imagesHere[index];
		if (editThis?.blob) {
			setEditImg({ ...editThis, index });
		} else if (editThis?.display) {
			const blob = await previewToBlob(editThis.display);
			if (!blob) return;
			setEditImg({ ...editThis, index, blob, size: blob.size });
		}
	};

	const closeSingleEdit = useCallback(
		async (blob: Blob, name: string) => {
			const changeIndex = editImg.index || 0;
			if (changeIndex < 0) return;

			if (!blob) {
				setEditImg({ index: undefined, ...imageObj });
				return;
			}
			const preview = await blobToPreview(blob);
			const updateFields = { display: preview, blob, size: blob.size, name };

			setImageHere((prev) =>
				prev.map((i, index) => {
					if (index !== changeIndex) {
						return i;
					}
					return { ...i, ...updateFields } as TImageObj;
				})
			);

			setEditImg({ index: undefined, ...imageObj });
		},
		[editImg.index]
	);

	const clearImage = (index?: number) => {
		if (index !== undefined && index > -1) {
			setImageHere((prev) => [...prev.slice(0, index), ...prev.slice(index + 1)]);
			return true;
		}

		setImageHere([]);
		return true;
	};

	return (
		<section className=' md:container justify-center items-center flex-row gap-3'>
			<div className='text-4xl font-bold text-center my-5 text-[hsl(var(--primary))]'>Image Handler</div>
			<DropZone
				key={filter.accept.length}
				multiple={filter.multiple}
				onClose={onCloseImage}
				propSize={filter.size}
				acceptType={filter.accept}
				propAspect={filter.aspect}
				className='mb-4'
			/>
			<div className='flex justify-end mb-4'>
				{imagesHere.length > 0 && (
					<Button variant={'destructive'} type='button' className=' me-3 w-[120px]' onClick={() => clearImage()}>
						Clear All
					</Button>
				)}
				<FilterDialog filter={filter} setFilter={setFilter} />
			</div>
			<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 '>
				{imagesHere.length !== 0 &&
					imagesHere.map((item, index) => (
						<div key={index} className='mb-3 border bg-secondary rounded-r-xl shadow-md relative'>
							<div className='p-3'>
								<div>
									<b>Name</b> {item.name}
								</div>
								<div>
									<b>Type</b> {item.type}
								</div>
								<div>
									<b>Size</b> {item.size} ({(item.size / 1024).toFixed(1)} kb)
								</div>
							</div>
							<Image src={item.display} alt={item.name} width={80} height={50} className='w-full' />

							<Popover>
								<PopoverTrigger className='absolute top-2 right-2 p-2 shadow-md bg-white rounded-lg'>
									<MoreVertical />
								</PopoverTrigger>
								<PopoverContent className='duration-500 animate-in'>
									<div className='flex flex-col'>
										<Button
											variant='outline'
											type='button'
											onClick={() => editHandle(index)}
											className='flex justify-between w-[110px] bg-[hsl(var(--background))]'>
											<Crop color='blue' />
											<span className='hidden md:block'>Crop </span>
										</Button>

										<Button
											variant={'outline'}
											type='button'
											onClick={() => clearImage(index)}
											className='flex justify-between w-[110px] bg-[hsl(var(--background))]'>
											<Trash2 color='red' />
											<span className='hidden md:block'>Delete </span>
										</Button>
									</div>
								</PopoverContent>
							</Popover>
						</div>
					))}
			</div>
			{editImg.index !== null && typeof editImg.index === 'number' && editImg?.index > -1 && (
				<CropDialog
					previousImgSrc={editImg?.blob}
					prevName={editImg.name?.split('.')[0]}
					autoOpen
					propSize={filter.size}
					propAspect={Number(filter.aspect)}
					onClose={closeSingleEdit}
				/>
			)}
		</section>
	);
}
