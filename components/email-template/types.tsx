type BodyItem = Array<{
	id: string;
	cells: number[];
	columns: Array<{
		id: string;
		contents: Array<{}>;
		values: {};
	}>;
	values: {};
}>;

type JSONTemplate = {
	counters: Record<string, number>;
	body: {
		id: string | undefined;
		rows: BodyItem;
		headers: BodyItem;
		footers: BodyItem;
		values: {};
	};
	schemaVersion?: number | undefined;
};
export type { JSONTemplate };
export type { EditorRef, EmailEditorProps } from 'react-email-editor';
