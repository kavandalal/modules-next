'use client';

import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import React, { useEffect, useRef } from 'react';
import { EditorRef, EmailEditorProps } from 'react-email-editor';

import dynamic from 'next/dynamic';

const EmailEditor = dynamic(() => import('react-email-editor'), {
	ssr: false, // Disable server-side rendering for this component
});

export default function Page() {
	const emailEditorRef = useRef<EditorRef>(null);

	const exportHtml = () => {
		const unlayer = emailEditorRef.current?.editor;

		unlayer?.exportHtml((data) => {
			const { design, html } = data;

			try {
				navigator.clipboard.writeText(html);
				toast({
					variant: 'success',
					title: 'HTML code copied to clipboard',
				});
			} catch (error) {
				console.error('Clipboard write failed:', error);
				toast({
					variant: 'destructive',
					title: 'Failed to copy HTML to clipboard',
				});
			}
		});
	};
	const onReady: EmailEditorProps['onReady'] = (unlayer) => {
		console.log('editor react-email-editor is ready');
	};
	// Your code that uses the window object
	return (
		<section className=' md:container justify-center items-center flex-row gap-3'>
			<div className='text-4xl font-bold text-center my-5 text-[hsl(var(--primary))] flex flex-col md:flex-row gap-2 justify-between md:grid-cols-[3fr_1fr] '>
				<span>Create Email Template</span>
				<Button variant={'default'} onClick={exportHtml}>
					Export HTML
				</Button>
			</div>
			<div className=' grid grid-flow-col md:grid-flow-col grid-cols-1  mb-4'>
				<EmailEditor ref={emailEditorRef} onReady={onReady} style={{ width: '100%' }} />
			</div>
		</section>
	);
}
