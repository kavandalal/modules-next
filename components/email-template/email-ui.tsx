'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import type { EmailEditorProps, EditorRef } from './types';

type TEmailEditor = React.ForwardRefExoticComponent<EmailEditorProps & React.RefAttributes<EditorRef>>;
const DynamicEmailEditor = dynamic(
	() => {
		console.log('importing ');
		return import('react-email-editor');
	},
	{ ssr: false }
);

const ForwardedEmailEditor = React.forwardRef<EditorRef, EmailEditorProps>((props, ref) => {
	return <DynamicEmailEditor {...props} ref={ref} />;
});

export default DynamicEmailEditor;
