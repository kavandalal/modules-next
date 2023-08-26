'use client';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { toast } from '@/components/ui/use-toast';
import React, { useCallback, useState } from 'react';
import { QRCode } from 'react-qrcode-logo';

type RGB = `rgb(${number}, ${number}, ${number})`;
type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
type HEX = `#${string}`;
type Color = RGB | RGBA | HEX;

type TdefaultValues = {
	value: string;
	ecLevel: 'L' | 'M' | 'Q' | 'H';
	enableCORS: boolean;
	size: number;
	bgColor: Color;
	fgColor: Color;
	removeQrCodeBehindLogo: boolean;
	addLogo: boolean;
	logoImage: string;
	logoWidth: number;
	logoOpacity: number;
	logoPadding: number;
	eyeRadius: number;
	eyeColor: Color;
	qrStyle: 'squares' | 'dots';
	id: string;
	name: string;
};
export default function CreateQR() {
	const defaultValues: TdefaultValues = {
		value: 'https://www.linkedin.com/in/kavan-dalal/',
		ecLevel: 'M',
		enableCORS: true,
		size: 250,
		bgColor: '#ffffff',
		fgColor: '#000000',
		logoImage: 'https://static-00.iconduck.com/assets.00/nextjs-icon-1024x1024-0nli97e5.png',
		logoOpacity: 1,
		logoWidth: 50,
		logoPadding: 2,
		removeQrCodeBehindLogo: true,
		eyeRadius: 5,
		eyeColor: '#432fd4',
		qrStyle: 'squares',
		id: 'download-qr',
		name: '',
		addLogo: false,
	};
	const [state, setState] = useState<TdefaultValues>(defaultValues);

	const downloadLogo = () => {
		const canvas: any = document.getElementById('download-qr');
		if (canvas) {
			const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
			let downloadLink = document.createElement('a');
			downloadLink.href = pngUrl;
			downloadLink.download = `${state.name || 'qr'}.png`;
			document.body.appendChild(downloadLink);
			downloadLink.click();
			document.body.removeChild(downloadLink);
		}
	};

	const resetLogo = () => {
		setState(defaultValues);
	};

	const handleChange = (e: any) => {
		const { name, value } = e.target;
		console.log(name, '---', value);
		setState((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const openErrorToast = () => {
		toast({
			variant: 'destructive',
			title: 'Not able to scan the QR code',
			description: (
				<ul>
					<li>Try reducing the size of Logo</li>
					<li>Try Increasing the size of Complexity </li>
				</ul>
			),
		});
	};

	const boxStyling = 'border rounded p-3 bg-[hsl(var(--secondary))]';

	const SliderRadiusHere: React.FC = useCallback(
		() => (
			<Slider
				defaultValue={[state.eyeRadius]}
				onValueChange={(e: number[]) => setState((prev) => ({ ...prev, eyeRadius: e[0] }))}
				name='eyeRadius'
				max={30}
				step={2}
			/>
		),
		[state.eyeRadius]
	);

	const SliderSizeHere: React.FC = useCallback(
		() => (
			<Slider
				defaultValue={[state.size]}
				onValueChange={(e: number[]) => setState((prev) => ({ ...prev, size: e[0] }))}
				name='size'
				id='size'
				max={400}
				step={10}
			/>
		),
		[state.size]
	);

	const SliderLogoSizeHere: React.FC = useCallback(
		() => (
			<Slider
				defaultValue={[state.logoWidth]}
				onValueChange={(e: number[]) => setState((prev) => ({ ...prev, logoWidth: e[0] }))}
				name='logoWidth'
				id='logoWidth'
				max={90}
				step={5}
			/>
		),
		[state.logoWidth]
	);

	return (
		<section className=' container justify-center items-center flex-row gap-3'>
			<div className='text-4xl font-bold text-center my-5 text-[hsl(var(--primary))]'>Create QR Code</div>
			<div
				className=' grid grid-flow-row md:grid-flow-col grid-cols-1 md:grid-cols-[2fr_1fr]'
				// style={{ gridTemplateColumns: '2fr 1fr' }}
			>
				<div className='grid grid-flow-row gap-4 px-8'>
					<div>
						<Label htmlFor='value'>Value</Label>
						<Input type='text' name='value' placeholder='Value' value={state.value} onChange={handleChange} />
					</div>
					<div>
						<Label>Color</Label>
						<div className={`grid grid-cols-1 md:grid-cols-3 gap-3 ${boxStyling}`}>
							<div>
								<Label htmlFor='bgColor'>Background</Label>
								<Input
									type='color'
									name='bgColor'
									placeholder='Background Color'
									value={state.bgColor}
									onChange={handleChange}
								/>
							</div>
							<div>
								<Label htmlFor='fgColor'>Foreground</Label>
								<Input
									type='color'
									name='fgColor'
									placeholder='Foreground Color'
									value={state.fgColor}
									onChange={handleChange}
								/>
							</div>
						</div>
					</div>
					<div>
						<Label htmlFor='qr-style'>QR Style</Label>
						<div id='qr-style' className={`grid grid-cols-1 md:grid-cols-3 gap-3 ${boxStyling}`}>
							<div>
								<Label htmlFor='fgColor'> Type </Label>
								<Select
									defaultValue={state.qrStyle}
									onValueChange={(e: any) => setState((prev) => ({ ...prev, qrStyle: e }))}>
									<SelectTrigger className='w-full'>
										<SelectValue placeholder='Type' />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='squares'>Squares</SelectItem>
										<SelectItem value='dots'>Dots</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div>
								<Label htmlFor='fgColor'> Complexity </Label>
								<Select
									defaultValue={state.ecLevel}
									onValueChange={(e: any) => setState((prev) => ({ ...prev, ecLevel: e }))}>
									<SelectTrigger className='w-full'>
										<SelectValue placeholder='Type' />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='L'>L</SelectItem>
										<SelectItem value='M'>M</SelectItem>
										<SelectItem value='Q'>Q</SelectItem>
										<SelectItem value='H'>H</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div>
								<Label htmlFor='size'> Size</Label>
								<SliderSizeHere />
							</div>
						</div>
					</div>
					<div>
						<Label htmlFor='eye-style'>Eye Styling</Label>
						<div id='eye-style' className={`grid grid-cols-1 md:grid-cols-3 gap-3 ${boxStyling}`}>
							<div>
								<Label htmlFor='fgColor'> Color</Label>
								<Input
									type='color'
									name='eyeColor'
									placeholder='Foreground Color'
									value={state.eyeColor}
									onChange={handleChange}
								/>
							</div>
							<div>
								<Label htmlFor='eyeRadius'> Radius</Label>
								<SliderRadiusHere />
							</div>
						</div>
					</div>

					<Label>Logo</Label>
					<div className={`flex flex-col ${boxStyling}`}>
						<div className='items-center space-x-2 '>
							<Checkbox
								id='addLogo'
								checked={state.addLogo}
								onCheckedChange={(e: boolean) => setState((prev) => ({ ...prev, addLogo: e }))}
							/>
							<Label
								htmlFor='addLogo'
								className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
								Add Logo
							</Label>
						</div>

						{state.addLogo === true && (
							<div className='grid grid-cols-1 md:grid-cols-2 gap-3 mt-3'>
								<div>
									<Label htmlFor='logoImage'>Logo URL</Label>
									<Input
										type='text'
										name='logoImage'
										placeholder='Logo URL'
										value={state.logoImage}
										onChange={handleChange}
									/>
								</div>
								<div>
									<Label htmlFor='eyeRadius'> Size</Label>
									<SliderLogoSizeHere />
								</div>
							</div>
						)}
					</div>
				</div>
				<div className='grid grid-flow-row gap-4 px-8 '>
					<div className='flex justify-center items-center flex-col mt-4'>
						<QRCode
							{...state}
							{...(!state.addLogo && {
								logoImage: '',
								logoOpacity: defaultValues.logoOpacity,
								logoPadding: defaultValues.logoPadding,
							})}
						/>
						<Button variant={'link'} className='text-[hsl(var(--destructive))]' onClick={openErrorToast}>
							Not Able To Scan With Logo?
						</Button>
					</div>
					<div>
						<Label htmlFor='name'>File Name</Label>
						<Input type='text' name='name' placeholder='qr' value={state.name} onChange={handleChange} />
					</div>

					<div className='grid grid-flow-col gap-3'>
						<Button variant={'destructive'} onClick={resetLogo}>
							Reset
						</Button>
						<Button variant={'default'} onClick={downloadLogo}>
							Download
						</Button>
					</div>
				</div>
			</div>
		</section>
	);
}
