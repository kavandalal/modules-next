import { toast } from '@/components/ui/use-toast';

export const previewToBlob = (preview: any) => {
	if (!preview) return false;

	const isBase64 = (str: string) => str.indexOf('data:') !== -1;

	function dataURLtoBlob(dataURL: string) {
		const [, mimeType, base64Data] = dataURL.match(/^data:(.*?);base64,(.*)$/) || [];
		const binaryData = atob(base64Data);
		const arrayBuffer = new ArrayBuffer(binaryData.length);
		const view = new Uint8Array(arrayBuffer);

		for (let i = 0; i < binaryData.length; i += 1) {
			view[i] = binaryData.charCodeAt(i);
		}
		return new Blob([arrayBuffer], { type: mimeType });
	}

	const fetchFromUrl = async (url: string) => {
		const result = await fetch(url);
		const blobResult = result.blob();
		return blobResult;
		// } catch (err) {
		//   console.log(err);
		//   return false;
		// }
	};

	const previewToBlob = async () => {
		try {
			if (!preview) {
				throw new Error('No preview provided');
			}
			let blob;
			if (isBase64(preview)) {
				blob = dataURLtoBlob(preview);
			} else {
				blob = await fetchFromUrl(preview);
			}
			return blob;
		} catch (err: any) {
			// customToast({ type: 'error', msg: err.message });
			toast({
				variant: 'destructive',
				title: err.message || 'Something went wrong!!!',
				// description: 'Friday, February 10, 2023 at 5:57 PM',
			});
			return false;
		}
	};

	return previewToBlob();
};
