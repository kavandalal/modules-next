'use client';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import React, { useRef } from 'react';
import EmailEditor, { EditorRef, EmailEditorProps } from 'react-email-editor';

export default function Page() {
	const emailEditorRef = useRef<EditorRef>(null);

	const exportHtml = () => {
		const unlayer = emailEditorRef.current?.editor;

		unlayer?.exportHtml((data) => {
			const { design, html } = data;
			navigator.clipboard.writeText(html);
			toast({
				variant: 'success',
				title: 'HTML code copied to clipboard',
			});
		});
	};

	const onReady: EmailEditorProps['onReady'] = (unlayer) => {
		console.log('editor react-email-editor is ready');
	};
	return (
		<section className=' md:container justify-center items-center flex-row gap-3'>
			<div className='text-4xl font-bold text-center my-5 text-[hsl(var(--primary))] flex flex-col md:flex-row gap-2 justify-between md:grid-cols-[3fr_1fr] '>
				<span>Create Email Template</span>
				<Button variant={'default'} onClick={exportHtml}>
					Export HTML
				</Button>
			</div>
			<div
				className=' grid grid-flow-col md:grid-flow-col grid-cols-1  mb-4'
				// style={{ gridTemplateColumns: '2fr 1fr' }}
			>
				<EmailEditor ref={emailEditorRef} onReady={onReady} style={{ width: '100%' }} />
			</div>
		</section>
	);
}
