'use client';

import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import Image from 'next/image';

export default function Home() {
	const { toast } = useToast();
	return (
		<main className='flex  flex-col items-center justify-between p-24'>
			{/* <Button
				onClick={() => {
					toast({
						variant: 'info',
						title: 'Scheduled: Catch up',
						description: 'Friday, February 10, 2023 at 5:57 PM',
					});
				}}>
				Show Toast
			</Button> */}
			<div className='text-2xl'>
				This app is made just to keep the code snippets that we can just plug-n-play in the future projects
			</div>
		</main>
	);
}
