'use client';

import Link from 'next/link';
import { TLink } from './links';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

interface NavItemProp {
	item: TLink;
	close: () => false | void;
}

function NavItem({ item, close }: NavItemProp) {
	// const segment = useSelectedLayoutSegment();
	// const isActive = item.slug === segment;

	const pathname = usePathname();
	const { slug, title, url } = item;
	const isActive = url === pathname;

	return (
		<Link
			onClick={close}
			href={item.url}
			className={clsx('block rounded-md px-3 py-2 text-sm font-medium hover:bg-[hsl(var(--secondary))]', {
				// '': !isActive,
				'border-b-4 border-[hsl(var(--primary))] bg-[hsl(var(--secondary))] md:bg-transparent animate-[highlight_1s_ease-in-out_1]':
					isActive,
			})}>
			{item.title}
		</Link>
	);
}
export default NavItem;
