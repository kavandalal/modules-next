'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
// import * as _ from 'lodash';

// import customToast from '../../utils/customToast';
// import ImageUpload from './crop-dialog';
import { previewToBlob } from '../../helper/previewToBlob';
import { toast } from '../ui/use-toast';
import { TDropZone, TImageObj, imageObj } from './types.image';

const DropZone = ({
	onClose,
	propSize = 1,
	propAspect,
	acceptType = ['jpeg', 'png'],
	multiple = false,
	className,
	...other
}: TDropZone) => {
	const [fileState, setFileState] = useState<TImageObj[]>([]);
	const [acceptTypeState, setAcceptTypeState] = useState<TDropZone['acceptType']>(acceptType);

	useEffect(() => {}, []);

	const readBlob = useCallback(
		(file: File, index: number) =>
			new Promise((resolve, reject) => {
				const readerBlob = new FileReader();

				readerBlob.onabort = () => {
					reject(new Error(`file reading was aborted index - ${index}`));
				};
				readerBlob.onerror = () => {
					reject(new Error(`file reading has failed index - ${index}`));
				};
				readerBlob.onload = () => {
					if (!readerBlob || !readerBlob.result) {
						return;
					}
					if (file?.size > Number(propSize) * 1048576) {
						// propSize in MB
						reject(new Error(`Image size is more than ${propSize}mb of ${file.name}`));
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
		(file: File, index: number) =>
			new Promise((resolve, reject) => {
				const readerURL = new FileReader();

				readerURL.onabort = () => reject(new Error(`file reading was aborted index -${index}`));
				readerURL.onerror = () => reject(new Error(`file reading has failed index -${index}`));
				readerURL.onload = () => {
					const display = readerURL.result;
					resolve(display);
					return true;
				};
				readerURL.readAsDataURL(file);
			}),
		[]
	);

	const onDrop = useCallback(
		async (acceptedFiles: File[]) => {
			const readSingleFile = async (file: File, index: number) => {
				try {
					const [resultBlob, resultBase64] = await Promise.all([readBlob(file, index), readBase64(file, index)]);

					const result = {
						blob: resultBlob,
						display: resultBase64,
						name: file.name,
						size: file.size,
						type: file.type,
					};
					return result;
				} catch (err: any) {
					toast({ variant: 'destructive', title: err?.message });
					return undefined;
					// return new Error(err?.message || err);
				}
			};

			try {
				const iteratorTo = multiple ? acceptedFiles.length : 1;
				let allFilesResult: TImageObj[] = new Array(iteratorTo).fill(0)?.map((_) => imageObj);
				for (let index = 0; index < iteratorTo; index += 1) {
					// eslint-disable-next-line no-await-in-loop
					const resultHere = await readSingleFile(acceptedFiles[index], index);
					if (!resultHere) {
					}
					allFilesResult[index] = resultHere as TImageObj;
				}

				allFilesResult = allFilesResult.filter((i) => i);

				// if (multiple) {
				onClose(allFilesResult);
				// } else {
				//   setFileState(allFilesResult);
				// }

				return true;
			} catch (err2) {
				console.log(err2);
				return false;
			}
		},
		[readBase64, readBlob, multiple, onClose]
	);
	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

	const getCroppedHere = async (preview = '') => {
		if (!preview) return false;

		const blob = await previewToBlob(preview);
		if (!blob) {
			return false;
		}

		const updateFields: Pick<TImageObj, 'display' | 'blob' | 'size'> = { display: preview, blob, size: blob.size };
		setFileState((prev) => [{ ...prev[0], ...updateFields }]);
		onClose([{ ...fileState, ...updateFields }]);
		return true;
	};

	const acceptData = useMemo(() => {
		const returnArr = [];
		const checkThis = acceptTypeState || [];
		if (checkThis.indexOf('jpeg') !== -1) {
			returnArr.push('image/jpeg');
			returnArr.push('image/jpg');
		}
		if (checkThis.indexOf('png') !== -1) {
			returnArr.push('image/png');
		}
		if (checkThis.indexOf('gif') !== -1) {
			returnArr.push('image/gif');
		}
		const returnName = returnArr.join(',');
		return returnName;
	}, [acceptTypeState]);

	const acceptInfo = useMemo(() => {
		const returnArr = [];
		const checkThis = acceptTypeState || [];
		if (checkThis.indexOf('jpeg') !== -1) {
			returnArr.push('JPEG');
		}
		if (checkThis.indexOf('png') !== -1) {
			returnArr.push('PNG');
		}
		if (checkThis.indexOf('gif') !== -1) {
			returnArr.push('GIF');
		}
		const returnName = returnArr.join(' or ');
		return returnName;
	}, [acceptTypeState]);

	return (
		<>
			<div
				{...getRootProps()}
				style={{
					minHeight: '150px',
					maxHeight: '300px',
					border: '2px dashed grey',
					borderRadius: '12px',
					padding: 2,
				}}
				className={`flex flex-col justify-center items-center cursor-pointer flex-column bg-secondary ${className}`}>
				<input {...getInputProps()} accept={acceptData} multiple={multiple} />
				<div className='text-lg'>
					{isDragActive ? (
						<p>Drop your file here...</p>
					) : (
						<p>
							Drag and drop or <b>choose</b> a file to upload
						</p>
					)}
				</div>
				<div className='mt-4'>
					<ul className='list-disc'>
						{multiple === true && (
							<li>
								You can upload <b>multiple</b> pictures
							</li>
						)}
						{propSize && (
							<li className='text-destructive '>
								Max size of the image should be <b>{propSize} MB</b>
							</li>
						)}
						{propAspect && (
							<li className='text-destructive '>
								Dimension will be{' '}
								<b>
									{propAspect === 16 / 9 ? '16:9' : '1:1'} ({acceptInfo})
								</b>
							</li>
						)}
					</ul>
				</div>
			</div>
		</>
	);
};

export default DropZone;
