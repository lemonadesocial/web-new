import dynamic from 'next/dynamic';

const TextEditor = dynamic(() => import('./text-editor'), { ssr: false });

export { TextEditor };
export type { TextEditorRef } from './text-editor';
export { EmojiPicker } from './emoji-picker';
