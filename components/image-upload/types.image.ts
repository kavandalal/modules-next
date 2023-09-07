import { PixelCrop } from 'react-image-crop';

// canvas
export type CanvasProp = {
	image: HTMLImageElement;
	canvas: HTMLCanvasElement;
	crop: PixelCrop;
	scale?: number;
	rotate?: number;
};

// drop-zone
export type TDropZone = {
	propAspect: number;
	propSize: number; // in mb
	onClose: (...args: any[]) => void;
	acceptType?: Array<'jpeg' | 'png' | 'gif'>;
	multiple?: boolean;
	className?: string;
};
export type TImageObj = { display: string; blob: Blob; name: string; size: number; type: string; index?: number };
export const imageObj: TImageObj = {} as TImageObj;

// crop-dialog
export type TCropDialog = {
	previousImgSrc: string | Blob;
	prevName: string;
	propAspect: number;
	propSize: number;
	onClose: (...args: any[]) => void;
	autoOpen: boolean;
	customClass?: string;
	customOpen?: boolean;
};
export type TcenterAspectCrop = {
	mediaWidth: number;
	mediaHeight: number;
	aspect: number;
};

// Filter
export const defaultFilter: TFilterState = { aspect: 16 / 9, size: 1, multiple: true, accept: ['jpeg', 'png'] };
export type AllowedFilterTypes = 'jpeg' | 'png' | 'gif';
export type TFilterState = { aspect: number; size: number; multiple: boolean; accept: AllowedFilterTypes[] };
export type TFilterDialog = {
	filter: TFilterState;
	setFilter: React.Dispatch<React.SetStateAction<TFilterState>>;
};
