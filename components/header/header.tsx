'use client';

import React, { useState } from 'react';
import { ToggleButton } from '@/components/ui/toggle-theme';
import { Button } from '../ui/button';
import { AlignJustify, User2 } from 'lucide-react';
import Links from './links';

export default function Header() {
	const [openNav, setOpenNav] = useState(false);
	const navigatePortfolio = () => {
		window.open('https://portfolio-kavan.vercel.app/', '_blank');
	};

	const toggleNav = () => {
		setOpenNav((prev) => !prev);
	};

	const closeNav = () => {
		setOpenNav((prev) => false);
	};

	return (
		<div
			className='py-3 justify-between w-full flex items-center sticky top-0 bg-[hsl(var(--background))] z-10'
			style={{ boxShadow: '0 -10px 16px hsl(var(--foreground))' }}>
			<div className='container justify-between w-full flex items-center'>
				<div className='font-bold'>Kavan Dalal</div>
				<div className='hidden md:block'>
					<Links open={openNav} onOpenChange={toggleNav} onClose={closeNav} />
				</div>
				<div className='grid grid-flow-col gap-3'>
					<div className='block md:hidden'>
						<Button variant={'link'} size='icon' type='button' onClick={toggleNav} className='border '>
							<AlignJustify />
						</Button>
					</div>
					<Button variant={'link'} size='icon' type='button' onClick={navigatePortfolio} className='border'>
						<User2 />
					</Button>
					<ToggleButton className='border' />
				</div>
			</div>
		</div>
	);
}
