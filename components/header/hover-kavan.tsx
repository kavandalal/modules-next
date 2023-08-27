'use client';

import React, { useEffect, useState } from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Building2, Github, Instagram, Linkedin, Mail, MapPin } from 'lucide-react';
import Link from 'next/link';
// const linkedinPhoto = 'https://avatars.githubusercontent.com/u/67893720?v=4';

const links = {
	linkedin: 'https://www.linkedin.com/in/kavan-dalal/',
	github: 'https://github.com/kavandalal',
	email: 'mailto:kavandalal.work@gmail.com',
	instagram: 'https://www.instagram.com/kavan.dalal/',
};
export default function HoverKavan() {
	const [data, setData] = useState({ company: '', location: '', avatar_url: '', bio: '' });
	const getGithubData = async () => {
		const data = await fetch('https://api.github.com/users/kavandalal').then((res) => res.json());
		const { company, location, avatar_url, bio } = data;
		setData((prev) => ({ ...prev, company, location, avatar_url, bio }));
	};
	useEffect(() => {
		getGithubData();
	}, []);
	return (
		<HoverCard>
			<HoverCardTrigger asChild>
				<Button variant='link' className='font-bold text-xl'>
					Kavan Dalal
				</Button>
			</HoverCardTrigger>
			<HoverCardContent className='w-80'>
				<div className='flex flex-col justify-between space-y-4'>
					<div className='flex space-x-4'>
						<Avatar style={{ width: 60, height: 60 }} className='my-auto h-full'>
							<AvatarImage src={data.avatar_url} width={100} height={100} />
							<AvatarFallback>KD</AvatarFallback>
						</Avatar>
						<div className='space-y-3'>
							<div className='text-sm'>{data.bio}</div>
							<div className='flex text-sm'>
								<Building2 size={18} />
								<span className='ms-3'>{data.company}</span>
							</div>
							<div className='flex text-sm'>
								<MapPin size={18} />
								<span className='ms-3'>{data.location}</span>
							</div>
						</div>
					</div>
					<div className='space-y-3'>
						<div className='grid grid-cols-3'>
							<Link href={links.linkedin} target='_blank'>
								<Linkedin className='mx-auto text-blue-600' />
							</Link>
							<Link href={links.github} target='_blank'>
								<Github className='mx-auto' />
							</Link>
							<Link href={links.email} target='_blank'>
								<Mail className='mx-auto text-red-500' />
							</Link>
							{/* <Link href={links.instagram} target='_blank'>
								<Instagram className='mx-auto text-red-500' />
							</Link> */}
						</div>
					</div>
				</div>
			</HoverCardContent>
		</HoverCard>
	);
}
