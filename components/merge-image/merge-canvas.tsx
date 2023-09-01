'use client';

import React, { forwardRef, useCallback, useEffect, useRef } from 'react';
import { toast } from '../ui/use-toast';

type TMergeImageProps = {
	logoX: number;
	logoY: number;
	scaleLogo: number;
	bannersrc: string;
	logosrc: string;
	refresh: boolean;
	test?: boolean;
	bannerWidth: number;
	bannerHeight: number;
};

const MergeImage = forwardRef<HTMLCanvasElement | null, TMergeImageProps>(function MergeImage(
	{ logoX, logoY, scaleLogo, bannersrc, logosrc, refresh, test = false, bannerWidth, bannerHeight },
	externalRef
) {
	// console.log({ bannersrc, logosrc });
	// const externalRef: React.MutableRefObject<HTMLCanvasElement | null> = useRef(null);
	const logoMaxWidth = 250;
	// const bannerWidth = 1920;
	// const bannerHeight = 480;

	const fetchImageFromBackend = useCallback(async ({ src }: { src: string }) => {
		try {
			// console.log('fetchImageFromBackend', src);
			const data = await fetch(src);
			// console.log({ data });
			if (!data) {
				return false;
			}

			const buffer = await data.arrayBuffer();
			const base64 = arrayBufferToBase64(buffer);
			const contentType = data.headers.get('content-type');
			const imageData = `data:${contentType};base64,${base64}`;

			// console.log(imageData);
			return imageData;
		} catch (err) {
			console.log(err);
			toast({
				variant: 'destructive',
				title: 'Something went wrong',
			});

			return false;
		}
	}, []);

	const doThings = useCallback(async () => {
		try {
			// const logoData = await fetchImageFromBackend({ src: logosrc });
			// const bannerData = await fetchImageFromBackend({ src: bannersrc });
			const logoData = logosrc;
			const bannerData = bannersrc;

			// const refCanvas = externalRef;
			const refCanvas = externalRef.current;
			if (!refCanvas) return false;

			if (refCanvas && logoData && bannerData) {
				const canvas = refCanvas;

				if (!(canvas instanceof HTMLCanvasElement)) return false;
				const ctx = canvas.getContext('2d');

				canvas.width = bannerWidth;
				canvas.height = bannerHeight;
				const canvasWidth = canvas.width;
				const canvasHeight = canvas.height;

				const bannerImg = new Image();
				const logoImg = new Image();

				bannerImg.onload = () => {
					const imageAspectRatio = bannerImg.width / bannerImg.height;
					const canvasAspectRatio = canvasWidth / canvasHeight;

					let renderWidth;
					let renderHeight;
					let xOffset = 0;
					let yOffset = 0;

					if (imageAspectRatio > canvasAspectRatio) {
						renderWidth = canvasWidth;
						renderHeight = canvasWidth / imageAspectRatio;
						yOffset = (canvasHeight - renderHeight) / 2;
					} else {
						renderWidth = canvasHeight * imageAspectRatio;
						renderHeight = canvasHeight;
						xOffset = (canvasWidth - renderWidth) / 2;
					}

					if (!ctx) {
						return false;
					}
					ctx.drawImage(bannerImg, xOffset, yOffset, renderWidth, renderHeight);

					logoImg.onload = () => {
						const logoAspectRatio = logoImg.width / logoImg.height;

						const scaleFactor = scaleLogo || 1;

						const maxLogoWidth = Math.min(logoImg.width, logoMaxWidth);
						const maxLogoHeight = maxLogoWidth / logoAspectRatio;

						const destWidth = maxLogoWidth * scaleFactor;
						const destHeight = maxLogoHeight * scaleFactor;

						const logoXCenter = logoX - destWidth / 2;
						const logoYCenter = logoY - destHeight / 2;

						ctx.drawImage(logoImg, logoXCenter, logoYCenter, destWidth, destHeight);
					};

					logoImg.src = logoData;
					logoImg.crossOrigin = 'anonymous';
				};

				bannerImg.src = bannerData;
				bannerImg.crossOrigin = 'anonymous';
			}
		} catch (err) {
			console.log(err);
			toast({
				variant: 'destructive',
				title: 'Something went wrong',
			});
			return false;
		}
	}, [externalRef, logosrc, bannersrc, logoX, logoY, scaleLogo, fetchImageFromBackend]);

	useEffect(() => {
		doThings();
	}, [refresh, logoX, logoY, scaleLogo, doThings]);

	const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
		const bytes = new Uint8Array(buffer);
		let binary = '';
		for (let i = 0; i < bytes.byteLength; i += 1) {
			binary += String.fromCharCode(bytes[i]);
		}
		const base64 = window.btoa(binary);
		return base64;
	};

	// if (!externalRef) {
	// 	return <div>Canvas not found</div>;
	// }

	return <canvas ref={externalRef} style={{ height: '100%', width: '100%' }} />;
});

export default MergeImage;
