import './globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/header/header';
import Footer from '@/components/footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
	title: {
		default: 'Modules by Kavan Dalal',
		template: '%s | Module by Kavan Dalal',
	},
	description: 'Website made by Kavan Dalal',
	keywords: ['Kavan Dalal', 'kavan dalal', 'india', 'next.js', 'typescript'],
	openGraph: {
		url: 'https://www.linkedin.com/in/kavan-dalal/',
	},
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en'>
			<body className={inter.className}>
				<ThemeProvider attribute='class' defaultTheme='system' enableSystem>
					<main className='min-h-screen' style={{ display: 'grid', gridTemplateRows: '60px 1fr' }}>
						<Header />
						{children}
						{/* <Footer /> */}
					</main>
					<Toaster />
				</ThemeProvider>
			</body>
		</html>
	);
}
