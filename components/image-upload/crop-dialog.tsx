'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop, Crop, PixelCrop, PercentCrop } from 'react-image-crop';
import imageCompression from 'browser-image-compression';
import 'react-image-crop/dist/ReactCrop.css';

import { canvasPreview } from './canvasPreview';
import { useDebounceEffect } from '../../hooks/useDebounceEffect';
import { blobToPreview } from '@/helper/blobToPreview';
import { toast } from '../ui/use-toast';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { RefreshCcw, RotateCcw, RotateCw } from 'lucide-react';
import { Input } from '../ui/input';
import ImageNext from 'next/image';
import { TCropDialog, TcenterAspectCrop } from './types.image';
import { Slider } from '../ui/slider';

function centerAspectCrop({ mediaWidth, mediaHeight, aspect }: TcenterAspectCrop): PercentCrop {
	// console.log('running centerAspectCrop');
	return centerCrop(
		makeAspectCrop(
			{
				unit: '%',
				width: 100,
			},
			aspect || 16 / 9,
			mediaWidth,
			mediaHeight
		),
		mediaWidth,
		mediaHeight
	);
}

const imageHandW = {
	width: '30vh',
	//  height: '30vh'
};

export default function CropDialog({
	propAspect,
	propSize,
	onClose,
	previousImgSrc,
	prevName,
	autoOpen,
	customClass,
	customOpen,
}: TCropDialog) {
	const [imgSrc, setImgSrc] = useState<string | Blob>();
	const [nameHere, setNameHere] = useState('');
	const previewCanvasRef: React.RefObject<HTMLCanvasElement> = useRef(null);
	const imgRef: React.RefObject<HTMLImageElement> = useRef(null);
	const changePhotoRef: React.RefObject<HTMLInputElement> = useRef(null);

	const [crop, setCrop] = useState<PercentCrop | undefined>();
	const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
	const [scale, setScale] = useState(1);
	const [rotate, setRotate] = useState(0);
	const [aspect, setAspect] = useState(0);
	const [openModal, setOpenModal] = useState(false);

	useEffect(() => {
		if (openModal) {
			setRotate(0);
			if (propAspect) {
				setAspect(propAspect);
			}
			if (previousImgSrc) {
				setImgSrc(previousImgSrc);
				openAgain(previousImgSrc);
			}
			if (prevName) {
				setNameHere(prevName);
			}
		}
	}, [openModal, previousImgSrc, prevName, propAspect]);

	useEffect(() => {
		if (autoOpen) {
			handleOpenModal();
		}
	}, [autoOpen]);

	const onCloseHere = useCallback(() => {
		setImgSrc(undefined);
		setCompletedCrop(undefined);
		setOpenModal(false);
		onClose();
	}, [onClose]);

	useEffect(() => {
		if (customOpen || customOpen === false) {
			if (customOpen) {
				handleOpenModal();
			} else {
				onCloseHere();
			}
		}
	}, [customOpen, onCloseHere]);

	const openAgain = async (previousImgSrc: Blob | string) => {
		if (!(previousImgSrc instanceof Blob)) return;
		setCrop(undefined); // Makes crop preview update between images.

		const base64 = await blobToPreview(previousImgSrc);
		if (!base64) {
			toast({ variant: 'destructive', title: 'blobToPreview did not return url' });
			return;
		}
		setImgSrc(base64);
	};

	function handleOpenModal() {
		setOpenModal(true);
	}

	const readBlob = useCallback(
		(file: Blob) =>
			new Promise<Blob>((resolve, reject) => {
				const readerBlob = new FileReader();

				readerBlob.onabort = () => {
					reject(new Error(`file reading was aborted `));
				};
				readerBlob.onerror = () => {
					reject(new Error(`file reading has failed `));
				};
				readerBlob.onload = () => {
					if (file?.size > Number(propSize) * 1048576) {
						// propSize in MB
						reject(new Error(`Image size is more than ${propSize}mb of ${file.name}`));
					}
					if (!readerBlob.result) {
						toast({ variant: 'destructive', title: 'readerBlob.result is null' });
						return;
					}
					const blob = new Blob([readerBlob.result], { type: file.type });

					resolve(blob);
					return true;
				};
				readerBlob.readAsArrayBuffer(file);
			}),
		[propSize]
	);

	const readBase64 = useCallback(
		(file: Blob) =>
			new Promise<string>((resolve, reject) => {
				const readerURL = new FileReader();

				readerURL.onabort = () => reject(new Error(`file reading was aborted `));
				readerURL.onerror = () => reject(new Error(`file reading has failed `));
				readerURL.onload = () => {
					const display = readerURL.result;
					if (!display) {
						reject(new Error(`file result not found`));
						return;
					}
					resolve(display as string);
					return true;
				};
				readerURL.readAsDataURL(file);
			}),
		[]
	);

	async function onSelectFile(e: any) {
		try {
			if (e.target && e.target.files && e.target.files.length > 0) {
				const file = e.target.files[0];
				const [blob, base64] = await Promise.all([readBlob(file), readBase64(file)]);
				setCrop(undefined); // Makes crop preview update between images.

				setImgSrc(base64 || undefined);
			}
			return true;
		} catch (err: any) {
			toast({ variant: 'destructive', title: err.message });
			return null;
		}
	}

	const onImageLoad = useCallback(
		(e: React.ChangeEvent<HTMLImageElement>) => {
			if (e.currentTarget && imgRef) {
				const { width, height } = e.currentTarget;
				if (width && height) {
					setCrop(
						centerAspectCrop({
							mediaWidth: width,
							mediaHeight: height,
							aspect,
						})
					);
				}
				if (!imgRef || !imgRef.current || !previewCanvasRef.current || !completedCrop) {
					return false;
				}
				canvasPreview({
					image: imgRef.current,
					canvas: previewCanvasRef.current,
					crop: completedCrop,
					scale,
					rotate,
				});
			}
		},
		[completedCrop, scale, rotate, aspect]
	);

	async function onSubmitHere() {
		if (!previewCanvasRef) {
			return false;
		}
		if (!previewCanvasRef?.current) {
			toast({ variant: 'destructive', title: `Please Update/Crop Image` });
			return false;
		}

		if (!previewCanvasRef?.current?.toDataURL()) {
			toast({ variant: 'destructive', title: `Please Update/Crop Image` });
			return false;
		}
		if (previewCanvasRef?.current && previewCanvasRef?.current?.toDataURL()) {
			const blobData: Blob = await getblob(previewCanvasRef);

			// const toastID = toast.loading('Processing...');
			// console.log('Before Compression', e.target.files[0]?.size);
			const options = { maxSizeMB: propSize };
			const toOptimiseFile = blobToFile(blobData, '');
			const compressedBlob = await imageCompression(toOptimiseFile, options);
			// console.log('After Compression', compressedFile);
			// customToast({ updateId: toastID, type: 'update', msg: 'Image Processed', updateType: 'success' });

			onClose(compressedBlob, nameHere);
		} else {
			onClose();
		}
		setImgSrc(undefined);
		setCompletedCrop(undefined);
		setOpenModal(false);
		return true;
	}

	function blobToFile(blob: Blob, fileName: string): File {
		// Create a new File instance using the Blob data and a specified filename
		return new File([blob], fileName, { type: blob.type });
	}

	const getblob = (previewCanvasRef: React.RefObject<HTMLCanvasElement>): Promise<Blob> =>
		new Promise<Blob>((resolve, reject) => {
			const canvas = previewCanvasRef?.current;
			if (!canvas) {
				reject(new Error(`Canvas not found`));
				return;
			}

			const ctx = canvas.getContext('2d');
			if (!ctx) {
				reject(new Error(`ctx not found`));
				return;
			}

			const img: HTMLImageElement = new Image();
			img.src = previewCanvasRef?.current.toDataURL();
			img.onload = () => {
				canvas.width = img.width;
				canvas.height = img.height;
				ctx.drawImage(img, 0, 0);

				// Get the Blob
				canvas.toBlob((blob: Blob | null) => {
					// You can use the retrieved blob here
					if (blob) {
						resolve(blob);
					} else {
						reject(new Error(`Blob is null`));
					}
				});
			};
		});

	useDebounceEffect({
		fn: async () => {
			if (completedCrop?.width && completedCrop?.height && imgRef.current && previewCanvasRef.current) {
				canvasPreview({ image: imgRef.current, canvas: previewCanvasRef.current, crop: completedCrop, scale, rotate });
			}
		},
		waitTime: 100,
		deps: [completedCrop, scale, rotate],
	});

	const clickChangePhoto = () => {
		if (!changePhotoRef) return;
		const isThere = changePhotoRef?.current;
		if (!isThere) {
			return;
		}
		isThere.click();
	};

	const ConditionalRender = useCallback(() => {
		if (imgSrc && imgSrc instanceof Blob) return;
		const newImgSrc = imgSrc;
		if (!newImgSrc) return;
		return (
			<img
				crossOrigin='anonymous'
				ref={imgRef}
				alt='Crop me'
				src={newImgSrc}
				// width={400}
				// // sizes='100vw'
				// height={400}
				style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
				onLoad={onImageLoad}
			/>
		);
	}, [imgSrc, imgRef, scale, rotate]);

	return (
		<>
			{/* <Button type={'button'} onClick={handleOpenModal}>
				Select
			</Button> */}

			<Dialog open={openModal} onOpenChange={onCloseHere}>
				{/* <DialogTrigger /> */}
				{/* Open</DialogTrigger> */}
				<DialogContent className='md:max-w-[800px]'>
					<DialogHeader>
						<DialogTitle className='mb-4'>Crop Image</DialogTitle>
						<DialogDescription>
							<div className='gap-4 overflow-hidden grid grid-cols-2 '>
								{!!imgSrc && (
									<div className='mx-auto '>
										<div>Your Image</div>
										<ReactCrop
											crop={crop}
											onChange={(_, percentCrop) => setCrop(percentCrop)}
											onComplete={(c) => {
												setCompletedCrop(c);
											}}
											aspect={aspect}
											style={{ ...imageHandW }}>
											<ConditionalRender />
										</ReactCrop>
									</div>
								)}
								<div className='mx-auto hidden sm:block '>
									<div>Output Image</div>
									<div className='h-full my-auto flex items-center'>
										<div style={{ ...imageHandW }}>
											{!!completedCrop && (
												<canvas
													ref={previewCanvasRef}
													style={{
														border: '1px solid black',
														objectFit: 'contain',
														width: '100%',
														height: '100%',
													}}
												/>
											)}
										</div>
									</div>
								</div>
								<div className=''>
									<div className='text-center mb-3'>Rotate</div>
									<div className=' flex justify-center'>
										<Button
											variant='secondary'
											type='button'
											className='px-3 me-2 rounded-pill'
											onClick={(e) => setRotate(Number(rotate + 90))}>
											<RotateCw />
										</Button>
										<Button
											variant='secondary'
											type='button'
											onClick={(e) => setRotate(Number(rotate - 90))}
											className='px-3 rounded-pill'>
											<RotateCcw />
										</Button>
									</div>
								</div>
								<div className='hidden'>
									<div className='text-center mb-3'>Zoom</div>
									<div className=' flex justify-center'>
										<Slider
											defaultValue={[40]}
											onValueChange={(e: number[]) => {
												setCrop((prev) => {
													if (!prev) return {} as PercentCrop;
													console.log({ e, propAspect, prev });
													const newWidth = Number(e[0]);
													const newHeight = newWidth / propAspect;
													// const newReturn = {
													// 	...prev,
													// 	width: newWidth,
													// 	height: newHeight,
													// };
													const newResult = centerAspectCrop({
														mediaWidth: newWidth,
														mediaHeight: newHeight,
														aspect: propAspect,
													});
													console.log({ newResult });
													return newResult;
												});
											}}
											name='logoWidth'
											id='logoWidth'
											max={100}
											min={1}
											step={1}
										/>
									</div>
								</div>
							</div>
							<div>
								<Input
									type='file'
									className='hidden'
									ref={changePhotoRef}
									onChange={(e) => onSelectFile(e)}
									accept={'image/*'}
								/>
							</div>
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<div className='flex justify-end items-center w-100'>
							<Button
								type='button'
								onClick={() => clickChangePhoto()}
								// disabled={isLoading}
								variant='outline'
								className='rounded-pill px-3 px-md-4 me-3 w-[200px]'>
								<RefreshCcw size={16} className='me-2' /> Change Photo
							</Button>
							<Button
								type='button'
								// disabled={isLoading}
								onClick={() => onSubmitHere()}
								variant='default'
								className='rounded-pill px-3 px-md-4 w-100 w-[130px]'>
								Apply
							</Button>
						</div>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
