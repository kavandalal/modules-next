'use client';

import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import React, { useEffect, useRef, useState } from 'react';
import { EditorRef, EmailEditorProps, JSONTemplate } from '@/components/email-template/types';

import ForwardedEmailEditor from '@/components/email-template/email-ui';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowDownToLine, ArrowUpToLine } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Page = () => {
	const emailEditorRef = useRef<EditorRef | null>(null);

	useEffect(() => {
		console.log('ref changed = ', emailEditorRef.current);
	}, [emailEditorRef]);

	const onReady: EmailEditorProps['onReady'] = (unlayer) => {
		emailEditorRef.current = { editor: unlayer };
	};

	const loadDesign = (json: JSONTemplate) => {
		if (emailEditorRef?.current?.editor) {
			emailEditorRef.current.editor.loadDesign(json);
		}
	};
	const copyHTML = () => {
		const unlayer = emailEditorRef?.current?.editor;
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
	const downloadHTML = async () => {
		const unlayer = emailEditorRef?.current?.editor;
		unlayer?.exportHtml(async (data) => {
			const { design, html } = data;
			try {
				downloadFile(html, 'html-email');

				toast({
					variant: 'success',
					title: 'File will be downloaded soon',
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

	const downloadJSON = async () => {
		const unlayer = emailEditorRef?.current?.editor;
		unlayer?.exportHtml(async (data) => {
			const { design, html } = data;
			try {
				const stringified = JSON.stringify(design);
				downloadFile(stringified, 'json-email');

				toast({
					variant: 'success',
					title: 'File will be downloaded soon',
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

	const downloadFile = (content: string, name: string) => {
		try {
			// Create a Blob containing the text content
			const blob = new Blob([content], { type: 'text/plain' });

			// Create a URL for the Blob
			const url = window.URL.createObjectURL(blob);

			// Create a hidden anchor element for download
			const a = document.createElement('a');
			a.style.display = 'none';
			a.href = url;
			a.download = `${name}.txt`;

			// Trigger a click event on the anchor element to initiate the download
			document.body.appendChild(a);
			a.click();

			// Clean up by revoking the URL and removing the anchor element
			window.URL.revokeObjectURL(url);
			document.body.removeChild(a);
			return true;
		} catch (err) {
			toast({
				variant: 'destructive',
				title: 'Error in downloading the file',
			});
			return false;
		}
	};

	return (
		<section className=' md:container justify-center items-center flex-row gap-3'>
			<div className='text-4xl font-bold text-center my-5 text-[hsl(var(--primary))] flex flex-col md:flex-row gap-2 justify-between md:grid-cols-[3fr_1fr] '>
				<span>Create Email Template</span>
				<div className='flex justify-center items-center'>
					<FilterDialog loadDesign={loadDesign} />
					<DropdownMenu>
						<DropdownMenuTrigger
							asChild
							className='ml-3'
							onChange={() => {
								toast({
									variant: 'info',
									title: 'Download JSON file for future updates',
								});
							}}>
							<Button>
								<span className='me-2'>Export </span>
								<ArrowUpToLine size={18} />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className='w-46'>
							<DropdownMenuGroup>
								<DropdownMenuItem onClick={copyHTML}>Copy HTML Code</DropdownMenuItem>
								<DropdownMenuItem onClick={downloadHTML}>Export HTML File</DropdownMenuItem>
								<DropdownMenuItem onClick={downloadJSON}>Export JSON File</DropdownMenuItem>
							</DropdownMenuGroup>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
			<div className=' grid grid-flow-col md:grid-flow-col grid-cols-1  mb-4'>
				{ForwardedEmailEditor && <ForwardedEmailEditor ref={emailEditorRef} onReady={onReady} />}
			</div>
		</section>
	);
};

export default Page;

type TFilterDialog = {
	loadDesign: (json: JSONTemplate) => void;
};
const FilterDialog = ({ loadDesign }: TFilterDialog) => {
	const [open, setOpen] = useState<boolean>(false);
	const [stateHere, setState] = useState<string>();

	const handleSubmit = () => {
		if (!stateHere) {
			return false;
		}
		const result: JSONTemplate = JSON.parse(stateHere);

		loadDesign(result);
		setOpen(false);
	};

	return (
		<Dialog open={open} onOpenChange={(data) => setOpen(data)}>
			<DialogTrigger asChild>
				<Button>
					<span className='me-2'>Import JSON</span>
					<ArrowDownToLine size={18} />
				</Button>
			</DialogTrigger>
			<DialogContent className='md:max-w-[555px]'>
				<DialogHeader>
					<DialogTitle>Import JSON</DialogTitle>
				</DialogHeader>
				<div className='grid gap-4 py-4'>
					<div className='grid grid-cols-3 items-center gap-4'>
						<Label htmlFor='html' className='text-right'>
							Paste JSON Content
						</Label>
						<Input id='html' value={stateHere} onChange={(e: any) => setState(e.target.value)} className='col-span-2' />
					</div>
				</div>
				<DialogFooter>
					<Button type='button' onClick={handleSubmit}>
						Save
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
