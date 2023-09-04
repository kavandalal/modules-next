type JSONTemplate = {
	counters: Record<string, number>;
	body: {
		id: string | undefined;
		rows: Array<{
			id: string;
			cells: number[];
			columns: Array<{
				id: string;
				contents: Array<{}>;
				values: {};
			}>;
			values: {};
		}>;
		values: {};
	};
	schemaVersion?: number | undefined;
};
export type { JSONTemplate };
export type { EditorRef, EmailEditorProps } from 'react-email-editor';
