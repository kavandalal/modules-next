'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop, Crop, PixelCrop } from 'react-image-crop';
import imageCompression from 'browser-image-compression';
import 'react-image-crop/dist/ReactCrop.css';

import { canvasPreview } from './canvasPreview';
import { useDebounceEffect } from '../../hooks/useDebounceEffect';
import { blobToPreview } from '@/helper/blobToPreview';
import { toast } from '../ui/use-toast';

type TcenterAspectCrop = {
	mediaWidth: number;
	mediaHeight: number;
	aspect: number;
};
function centerAspectCrop({ mediaWidth, mediaHeight, aspect }: TcenterAspectCrop) {
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

type TCropDialog = {
	propAspect: number;
	propSize: number;
	onClose: () => {};
	previousImgSrc: Blob;
	prevName: string;
	autoOpen: boolean;
	customClass: string;
	customOpen: boolean;
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
	const [imgSrc, setImgSrc] = useState<Blob | string>();
	const [nameHere, setNameHere] = useState('');
	const previewCanvasRef = useRef(null);
	const imgRef = useRef(null);
	const changePhotoRef = useRef(null);

	const [crop, setCrop] = useState();
	const [completedCrop, setCompletedCrop] = useState(false);
	const [scale] = useState(1);
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

	// useEffect(() => {
	// 	if (customOpen || customOpen === false) {
	// 		if (customOpen) {
	// 			handleOpenModal();
	// 		} else {
	// 			onCloseHere();
	// 		}
	// 	}
	// }, [customOpen, onCloseHere]);

	useEffect(() => {
		if (autoOpen) {
			handleOpenModal();
		}
	}, [autoOpen]);

	const openAgain = async (previousImgSrc: Blob) => {
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

				setImgSrc(base64 || '');
			}
			return true;
		} catch (err: any) {
			toast({ variant: 'destructive', title: err.message });
			return null;
		}
	}

	// 	function onImageLoad(e: React.ChangeEvent<HTMLImageElement>) {
	// 		if (e.currentTarget && imgRef) {
	// 			const { width, height } = e.currentTarget;
	// 			setCrop(
	// 				centerAspectCrop({
	// 					mediaWidth: width,
	// 					mediaHeight: height,
	// 					aspect,
	// 				})
	// 			);
	// 			canvasPreview( {

	//         image : imgRef.current,
	// 	canvas : previewCanvasRef.current,
	// 	crop : completedCrop

	// scale, rotate  });
	// 		}
	// 	}

	// 	function onCloseHere() {
	// 		setImgSrc('');
	// 		setCompletedCrop(false);
	// 		setOpenModal(false);
	// 		onClose();
	// 	}

	// 	async function onSubmitHere() {
	// 		if (!previewCanvasRef?.current || !previewCanvasRef?.current?.toDataURL()) {
	// 			toast({ variant: 'destructive', title: `Please Update/Crop Image` });

	// 			return false;
	// 		}
	// 		if (previewCanvasRef?.current && previewCanvasRef?.current?.toDataURL()) {
	// 			const blobData = await getblob(previewCanvasRef);

	// 			const toastID = toast.loading('Processing...');
	// 			// console.log('Before Compression', e.target.files[0]?.size);
	// 			const options = { maxSizeMB: propSize };
	// 			const compressedBlob = await imageCompression(blobData, options);
	// 			// console.log('After Compression', compressedFile);
	// 			customToast({ updateId: toastID, type: 'update', msg: 'Image Processed', updateType: 'success' });

	// 			onClose(compressedBlob, nameHere);
	// 			// onClose(previewCanvasRef?.current?.toDataURL());
	// 		} else {
	// 			onClose();
	// 		}
	// 		setImgSrc('');
	// 		setCompletedCrop(false);
	// 		setOpenModal(false);
	// 		return true;
	// 	}

	// 	const getblob = (previewCanvasRef) =>
	// 		new Promise((resolve, reject) => {
	// 			const canvas = previewCanvasRef?.current;
	// 			const ctx = canvas.getContext('2d');

	// 			const img = new Image();
	// 			img.onload = () => {
	// 				canvas.width = img.width;
	// 				canvas.height = img.height;
	// 				ctx.drawImage(img, 0, 0);

	// 				// Get the Blob
	// 				canvas.toBlob((blob) => {
	// 					// You can use the retrieved blob here
	// 					if (blob) {
	// 						resolve(blob);
	// 					}
	// 				});
	// 			};
	// 			img.src = previewCanvasRef?.current.toDataURL();
	// 		});

	// 	useDebounceEffect(
	// 		async () => {
	// 			if (completedCrop?.width && completedCrop?.height && imgRef.current && previewCanvasRef.current) {
	// 				canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop, scale, rotate);
	// 			}
	// 		},
	// 		100,
	// 		[completedCrop, scale, rotate]
	// 	);

	// 	const clickChangePhoto = () => {
	// 		const isThere = changePhotoRef?.current;
	// 		if (isThere) {
	// 			isThere.click();
	// 		}
	// 	};

	return <div>crop-dialog</div>;
}
