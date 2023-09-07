'use client';

import React, { use, useEffect, useState } from 'react';
import { AllowedFilterTypes, TFilterDialog, TFilterState } from './types.image';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';

function FilterDialog(props: TFilterDialog) {
	const { filter, setFilter } = props;
	const [stateHere, setState] = useState<TFilterState>({} as TFilterState);
	const [open, setOpen] = useState<boolean>(false);

	useEffect(() => {
		setState(filter);
		return () => {
			if (!open) {
				setState(filter);
			}
		};
	}, [open, filter]);

	const handleSubmit = () => {
		setFilter(stateHere);
		setOpen(false);
	};

	const acceptType: AllowedFilterTypes[] = ['png', 'jpeg'];

	const chnageAccept = (boolVal: boolean, type: AllowedFilterTypes) => {
		setState((prev) => {
			const prevState = prev.accept;
			let newState;
			if (boolVal) {
				prevState.push(type);
				newState = prevState;
			} else {
				const removeIndex = prevState.indexOf(type);
				prevState.splice(removeIndex, 1);
				newState = prevState;
			}
			return { ...prev, accept: [...newState] };
		});
	};
	return (
		<div>
			<Dialog open={open} onOpenChange={(data) => setOpen(data)}>
				<DialogTrigger asChild>
					<Button size='icon'>
						<Filter />
					</Button>
				</DialogTrigger>
				<DialogContent className='md:max-w-[555px]'>
					<DialogHeader>
						<DialogTitle>Edit Filter</DialogTitle>
						{/* <DialogDescription>Make changes to your profile here. Click save when youre done.</DialogDescription> */}
					</DialogHeader>
					<div className='grid gap-4 py-4'>
						<div className='grid grid-cols-3 items-center gap-4'>
							<Label htmlFor='aspect' className='text-right'>
								Aspect Ratio
							</Label>
							<Select
								defaultValue={`${stateHere.aspect}`}
								onValueChange={(e: any) => setState((prev) => ({ ...prev, aspect: Number(e) }))}>
								<SelectTrigger className='col-span-2' id='aspect'>
									<SelectValue placeholder='Aspect Ratio' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value={`${16 / 9}`}>16 / 9</SelectItem>
									<SelectItem value={`${1}`}>Square</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className='grid grid-cols-3 items-center gap-4'>
							<Label htmlFor='size' className='text-right'>
								Maximum Size (mb)
							</Label>
							<Input
								id='size'
								type={'number'}
								max={10}
								value={stateHere.size}
								onChange={(e: any) => setState((prev) => ({ ...prev, size: e.target.value }))}
								className='col-span-2'
							/>
						</div>

						<div className='grid grid-cols-3 items-center gap-4'>
							<Label htmlFor='mutiple' className='text-right'>
								Multiple Select
							</Label>
							<Checkbox
								id='mutiple'
								checked={stateHere.multiple}
								onCheckedChange={(e: boolean) => setState((prev) => ({ ...prev, multiple: e }))}
							/>
						</div>

						<div className='grid grid-cols-3 gap-4'>
							<Label htmlFor='mutiple' className='text-right'>
								File Format
							</Label>
							<div className='col-span-2 flex flex-col gap-3'>
								{acceptType?.map((i) => (
									<div className='flex items-center space-x-2'>
										<Checkbox
											id={i}
											checked={stateHere?.accept?.indexOf(i) !== -1}
											onCheckedChange={(e: boolean) => chnageAccept(e, i)}
										/>
										<label htmlFor={i} className='text-sm font-medium leading-none '>
											{i}
										</label>
									</div>
								))}
							</div>
						</div>
					</div>
					<DialogFooter>
						<Button type='button' onClick={handleSubmit}>
							Save
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}

export default React.memo(FilterDialog);
