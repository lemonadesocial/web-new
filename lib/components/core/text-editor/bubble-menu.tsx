import React from 'react';
import { BubbleMenu, Editor, isTextSelection } from '@tiptap/react';
import { Level } from '@tiptap/extension-heading';
import camelCase from 'lodash/camelCase';
import { Divider } from '../divider';
import { InputPrompt, ToggleButton } from './toolbars';

type Props = {
  editor: Editor;
  toolbar: {
    heading?: Level[];
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strike?: boolean;
    code_block?: boolean;
    quote?: boolean;
    bullet_list?: boolean;
    ordered_list?: boolean;
    link?: boolean;
  };
};

export default function TextEditorBubbleMenu({ editor, toolbar }: Props) {
  const [showInputLink, setShowInputLink] = React.useState(false);

  const isSelectedText = isTextSelection(editor.state.selection);
  const linkValue = editor?.getAttributes('link').href;

  const setLink = React.useCallback(
    (url: string) => {
      // cancelled
      if (url === null) {
        return;
      }

      // empty
      if (url === '') {
        editor?.chain().focus().extendMarkRange('link').unsetLink().run();
        return;
      }

      // update link
      editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    },
    [editor],
  );

  return (
    <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
      {isSelectedText && !showInputLink && (
        <div className="flex p-1.5 rounded-md bg-background backdrop-blur-2xl border w-fit divide-x divide-[var(--color-divider)]">
          {Object.entries(toolbar).map(([key, value]) => {
            if (key === 'heading' && Array.isArray(value)) {
              return (
                <div key={key} className="flex">
                  {value.map((level) => {
                    return (
                      <ToggleButton
                        key={level}
                        icon={`h${level}`}
                        active={editor?.isActive('heading', { level })}
                        onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
                      />
                    );
                  })}
                </div>
              );
            }

            if (typeof value == 'boolean' && value) {
              return (
                <React.Fragment key={key}>
                  <ToggleButton
                    icon={key}
                    active={editor.isActive(camelCase(key))}
                    onClick={() => {
                      switch (key) {
                        case 'bold':
                          editor.chain().focus().toggleBold().run();
                          break;
                        case 'italic':
                          editor.chain().focus().toggleItalic().run();
                          break;
                        case 'underline':
                          editor.chain().focus().toggleUnderline().run();
                          break;
                        case 'strike':
                          editor.chain().focus().toggleStrike().run();
                          break;
                        case 'code_block':
                          editor.commands.toggleCodeBlock();
                          break;
                        case 'blockquote':
                          editor.chain().focus().toggleBlockquote().run();
                          break;
                        case 'bullet_list':
                          editor.chain().focus().toggleBulletList().run();
                          break;
                        case 'ordered_list':
                          editor.chain().focus().toggleOrderedList().run();
                          break;
                        case 'link':
                          if (!editor.isActive('link')) setShowInputLink(true);
                          else editor.chain().focus().unsetLink().run();
                          break;
                        default:
                          break;
                      }
                    }}
                  />
                  {key === 'strike' && <Divider />}
                </React.Fragment>
              );
            }

            return null;
          })}
        </div>
      )}

      {showInputLink && (
        <InputPrompt
          value={linkValue}
          placeholder="Enter link URL"
          onClose={() => setShowInputLink(false)}
          onConfirm={(value) => {
            setLink(value);
            setShowInputLink(false);
          }}
        />
      )}
    </BubbleMenu>
  );
}
