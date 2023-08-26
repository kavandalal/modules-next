export const blobToPreview = async (blob: Blob): Promise<string | false> => {
	if (!blob) {
		return false;
	}

	const isBlob = (value: any): value is Blob => value instanceof Blob;

	try {
		if (isBlob(blob)) {
			const reader = new FileReader();

			const result = await new Promise<string>((resolve, reject) => {
				reader.onload = (event: ProgressEvent<FileReader>) => {
					if (!event.target || !event.target.result) {
						reject(new Error('No event target or result'));
					} else {
						resolve(event.target.result as string);
					}
				};

				reader.readAsDataURL(blob);
			});

			return result;
		} else {
			throw new Error('Image is not in Blob format');
		}
	} catch (error) {
		return false;
	}
};
