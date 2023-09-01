'use client';

// import Image from 'next/image';
import Image from 'next/image';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import MergeImage from '@/components/merge-image/merge-canvas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type TuserData = {
	logo: string;
	banner: string;
	refresh: boolean;
	aspectRatio: string;
	bannerHeight: number;
	bannerWidth: number;
};

export default function MergeImageTest() {
	const [positionLogo, setPositionLogo] = useState({ logoX: 115, logoY: 59, scale: 0.3 });
	const customCanvasRef: React.RefObject<HTMLCanvasElement | null> = useRef(null);

	const [previewImg, setPreviewImg] = useState<string>('');
	const [userData, setUserData] = useState<TuserData>({
		logo: 'https://static-00.iconduck.com/assets.00/nextjs-icon-1024x1024-0nli97e5.png',

		banner:
			'https://images.unsplash.com/photo-1682687982468-4584ff11f88a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
		aspectRatio: '16/9',
		bannerWidth: 699,
		bannerHeight: 393.7,
		refresh: false,
	});

	useEffect(() => {
		console.log('customCanvasRef chnaged ', customCanvasRef.current);
	}, [customCanvasRef]);

	const canvasToImg = async (canvasRef: React.RefObject<HTMLCanvasElement | null>) => {
		try {
			if (!canvasRef) return false;
			const canvas = canvasRef.current;
			// const ctx = canvas.getContext('2d');
			if (!canvas) return false;
			const imageData = canvas.toDataURL('image/png'); // Change the format as needed (e.g., 'image/jpeg')
			return imageData;
		} catch (err) {
			console.log(err);
			return false;
		}
	};

	const getBase64 = async () => {
		const base64img = await canvasToImg(customCanvasRef);
		if (base64img) {
			setPreviewImg(base64img);
		}
	};

	const generateDownload = async () => {
		const base64img = await canvasToImg(customCanvasRef);
		if (base64img) {
			downloadImageFromBase64(base64img, 'test.png');
		}
	};

	function downloadImageFromBase64(base64String: string, fileName: string) {
		// Create a temporary anchor element
		const link = document.createElement('a');
		link.href = base64String;
		link.download = fileName;

		// Simulate a click on the anchor element
		const clickEvent = new MouseEvent('click', {
			view: window,
			bubbles: true,
			cancelable: true,
		});
		link.dispatchEvent(clickEvent);
	}

	const handlePosition = (e: any) => {
		const { name, value } = e.target;
		setPositionLogo((prev) => ({
			...prev,
			[name]: Number(value),
		}));
	};

	const handleChange = (e: any) => {
		const { name, value } = e.target;
		setUserData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const generateMerge = () => {
		setUserData((prev) => ({
			...prev,
			refresh: !prev.refresh,
		}));
	};

	const handleAspectChange = (e: any) => {
		console.log(e, typeof e, Number(e));
		setUserData((prev) => {
			const bannerWidth = prev?.bannerWidth;
			const bannerHeight = bannerWidth / eval(e);

			return { ...prev, aspectRatio: e, bannerWidth, bannerHeight };
		});
	};

	// const displayWidth = 700;
	// const displayRatio = 16 / 9;

	return (
		<section className=' md:container justify-center items-center flex-row gap-3'>
			<div className='text-4xl font-bold text-center my-5 text-[hsl(var(--primary))]'>Merge Image</div>

			<div className='container'>
				<div className=' grid grid-cols-1 md:grid-cols-3 gap-3'>
					<div>
						<Label htmlFor='banner'>Banner URL</Label>

						<Input
							className='fullWidth-responsive'
							placeholder='Banner source'
							name='banner'
							id='banner'
							value={userData?.banner}
							onChange={handleChange}
						/>
					</div>
					<div>
						<Label htmlFor='logo'>Logo URL</Label>

						<Input
							className='fullWidth-responsive'
							placeholder='Logo source'
							id='logo'
							name='logo'
							value={userData?.logo}
							onChange={handleChange}
						/>
					</div>

					<div className=' '>
						<Label htmlFor='aspect'> Aspect Ratio </Label>
						<Select defaultValue={userData.aspectRatio} onValueChange={handleAspectChange}>
							<SelectTrigger className='w-full'>
								<SelectValue placeholder='Type' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value={'16/9'}>16:9</SelectItem>
								<SelectItem value={'1'}>Square</SelectItem>
								<SelectItem value={'4/1'}>4:1</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className='d-flex'>
						<Label htmlFor='logoX'>Logo X axis</Label>

						<Slider
							defaultValue={[positionLogo.logoX]}
							name='logoX'
							id='logoX'
							onValueChange={(e: number[]) => {
								setPositionLogo((prev) => ({
									...prev,
									logoX: e[0],
								}));
							}}
							max={2500}
						/>
						<input type='number' name='logoX' value={positionLogo.logoX} onChange={handlePosition} placeholder='X' />
					</div>
					<div className='d-flex'>
						<Label htmlFor='logoY'>Logo Y axis</Label>

						<Slider
							defaultValue={[positionLogo.logoY]}
							name='logoY'
							id='logoY'
							onValueChange={(e: number[]) => {
								setPositionLogo((prev) => ({
									...prev,
									logoY: e[0],
								}));
							}}
							max={600}
						/>
						<input type='number' name='logoY' value={positionLogo.logoY} onChange={handlePosition} placeholder='Y' />
					</div>
					<div className='d-flex'>
						<Label htmlFor='scale'>Zoom</Label>

						<Slider
							defaultValue={[positionLogo.scale]}
							name='scale'
							id='scale'
							onValueChange={(e: number[]) => {
								setPositionLogo((prev) => ({
									...prev,
									scale: e[0],
								}));
							}}
							min={0.1}
							step={0.1}
							max={3}
						/>
						<input
							type='number'
							name='scale'
							min='1'
							value={positionLogo.scale}
							onChange={handlePosition}
							placeholder='Increase size of logo'
						/>
					</div>
				</div>
			</div>
			<div>
				<div
					className='mb-3 mx-auto'
					style={{
						width: userData?.bannerWidth,
						height: userData?.bannerHeight,
						aspectRatio: Number(userData?.aspectRatio),
					}}>
					<MergeImage
						ref={customCanvasRef}
						logoX={positionLogo.logoX}
						logoY={positionLogo.logoY}
						scaleLogo={positionLogo.scale}
						bannersrc={userData?.banner}
						logosrc={userData?.logo}
						refresh={userData?.refresh}
						bannerWidth={userData?.bannerWidth}
						bannerHeight={userData?.bannerHeight}
						test
					/>
				</div>

				{/* <Image src={previewImg} width={1080} height={768} alt='' /> */}

				{/* <Button type='button' onClick={getBase64}>
						Generate Preview
					</Button> */}
				<div className='flex justify-center items-center'>
					<Button type='button' onClick={generateDownload}>
						Download
					</Button>
				</div>
			</div>
		</section>
	);
}
