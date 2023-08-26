'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { Sheet, SheetContent } from '../ui/sheet';
import NavItem from './single-link';

export type TLink = {
	slug: string;
	url: string;
	title: string;
	description?: string;
};

export default function Links({
	open,
	onOpenChange,
	onClose,
}: {
	open: boolean;
	onOpenChange: () => void;
	onClose: () => void;
}) {
	const links: TLink[] = [
		{
			slug: 'home',
			url: '/',
			title: 'Home',
		},

		{
			slug: 'create-qr',
			url: '/create-qr',
			title: 'Create QR',
		},

		{
			slug: 'image-upload',
			url: '/image-upload',
			title: 'Image Upload',
		},
	];
	const [openNav, setOpenNav] = useState(false);

	const toggleNav = () => {
		setOpenNav((prev) => !prev);
	};

	return (
		<>
			{/* Desktop */}
			<div className='hidden md:block'>
				<ul className='grid grid-flow-col gap-4'>
					{links.map((item) => (
						<li key={item.title}>
							<NavItem key={item.slug} item={item} close={onClose} />
						</li>
					))}
				</ul>
			</div>
			{/* Mobile */}
			{/* <div className='md:hidden block'> */}
			<Sheet open={open} onOpenChange={onOpenChange}>
				<SheetContent>
					<ul className='grid grid-flow-row gap-4'>
						{links.map((item) => (
							<li key={item.title}>
								<NavItem key={item.slug} item={item} close={onClose} />
							</li>
						))}
					</ul>
				</SheetContent>
			</Sheet>
			{/* </div> */}
		</>
	);
}
