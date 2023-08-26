import { useEffect } from 'react';

type TypeuseDebounceEffect = {
	fn: () => {};
	waitTime: number;
	deps: [];
};

export function useDebounceEffect({ fn, waitTime, deps }: TypeuseDebounceEffect) {
	useEffect(() => {
		const t = setTimeout(() => {
			fn.apply(undefined, deps);
		}, waitTime);

		return () => {
			clearTimeout(t);
		};
	}, [deps, fn, waitTime]);
}
