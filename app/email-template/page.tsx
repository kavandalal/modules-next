'use client';

import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import React, { useEffect, useRef } from 'react';
import { EditorRef, EmailEditorProps } from '@/components/email-template/types';
// import dynamic from 'next/dynamic';

import ForwardedEmailEditor from '@/components/email-template/email-ui';

// type TEmailEditor = React.ForwardRefExoticComponent<EmailEditorProps & React.RefAttributes<EditorRef> & typeof>;
// const ForwardedEmailEditor: TEmailEditor = dynamic(
// 	() => {
// 		console.log('importing ');
// 		return import('react-email-editor');
// 	},
// 	{ ssr: false }
// );

export default function Page() {
	const emailEditorRef = useRef<EditorRef | null>(null);
	const testRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		console.log('test ref changed = ', testRef.current);
	}, [testRef]);

	useEffect(() => {
		console.log('ref changed = ', emailEditorRef.current);
	}, [emailEditorRef]);

	const exportHtml = () => {
		const unlayer = emailEditorRef?.current?.editor;
		unlayer?.exportHtml((data) => {
			const { design, html } = data;
			try {
				console.log('%c Copy function Running', 'color: yellow; background:#222;');
				console.log(html);
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
		// const x = unlayer?.init({ id: 'email-editor' });
		// console.log('new editor', x);

		console.log('editor react-email-editor is ready', emailEditorRef.current);
	};

	return (
		<section className=' md:container justify-center items-center flex-row gap-3'>
			<div className='text-4xl font-bold text-center my-5 text-[hsl(var(--primary))] flex flex-col md:flex-row gap-2 justify-between md:grid-cols-[3fr_1fr] '>
				<span>Create Email Template</span>
				<Button onClick={exportHtml}>Export HTML</Button>
			</div>
			<pre>{JSON.stringify(emailEditorRef.current)}</pre>
			<div id='email-editor' ref={testRef}>
				Name{' '}
			</div>
			<div className=' grid grid-flow-col md:grid-flow-col grid-cols-1  mb-4'>
				{ForwardedEmailEditor && (
					<ForwardedEmailEditor ref={(editorRef) => (emailEditorRef.current = editorRef)} onReady={onReady} />
				)}
			</div>
		</section>
	);
}
