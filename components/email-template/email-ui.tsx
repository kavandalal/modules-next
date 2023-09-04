'use client';

import dynamic from 'next/dynamic';

const DynamicEmailEditor = dynamic(() => import('react-email-editor'), { ssr: false });

export default DynamicEmailEditor;
