import React from 'react';
import { FloatingMenu, Editor } from '@tiptap/react';
import { Level } from '@tiptap/extension-heading';
import camelCase from 'lodash/camelCase';

import { FileDirectory, uploadFiles } from '$lib/utils/file';

import { FloatingMenuItem } from './toolbars';
import { toast } from '../toast';
import { Menu } from '../menu';
import { Button } from '../button';
import { File } from '$lib/graphql/generated/backend/graphql';

type HeadingType = { level: Level[]; label: string[] };
type ControlType = { enable: boolean; label: string };

type Props = {
  editor: Editor;
  /** directory prop is using for upload file */
  directory?: FileDirectory;
  toolbar: {
    heading?: HeadingType;
    image?: ControlType;
    divider?: ControlType;
    quote?: ControlType;
    bullet_list?: ControlType;
    ordered_list?: ControlType;
  };
};

const pickFile = (onFilePicked: (file: File) => void): void => {
  const inputElemenet = document.createElement('input');
  inputElemenet.style.display = 'none';
  inputElemenet.type = 'file';

  inputElemenet.addEventListener('change', () => {
    if (inputElemenet.files) {
      onFilePicked(inputElemenet.files[0]);
    }
  });

  const teardown = () => {
    document.body.removeEventListener('focus', teardown, true);
    setTimeout(() => {
      document.body.removeChild(inputElemenet);
    }, 1000);
  };
  document.body.addEventListener('focus', teardown, true);

  document.body.appendChild(inputElemenet);
  inputElemenet.click();
};

export default function TextEdiorFloatingMenu({ editor, toolbar, directory = 'event' }: Props) {
  const [uploading, setUploading] = React.useState(false);

  return (
    <FloatingMenu
      editor={editor}
      tippyOptions={{
        offset: [-20, -22],
        placement: 'top',
        duration: 100,
      }}
    >
      <Menu.Root placement="bottom-start">
        <Menu.Trigger>
          <Button variant="tertiary" size="xs" icon="icon-plus" className="p-[2px] backdrop-blur-2xl" />
        </Menu.Trigger>
        <Menu.Content className="p-0">
          {({ toggle }) => {
            return (
              <div className="flex flex-col p-1.5">
                {Object.entries(toolbar).map(([key, value]) => {
                  if (key === 'heading') {
                    const heading = value as HeadingType;
                    if (Array.isArray(heading.level) && Array.isArray(heading.label)) {
                      return heading.level.map((level, idx) => {
                        return (
                          <FloatingMenuItem
                            key={`${key}_${level}`}
                            icon={`h${[level]}`}
                            active={editor?.isActive('heading', { level })}
                            label={value.label[idx]}
                            onClick={() => {
                              editor.chain().focus().toggleHeading({ level }).run();
                              toggle();
                            }}
                          />
                        );
                      });
                    }
                  }

                  const control = value as ControlType;
                  if (typeof control.enable === 'boolean' && control.enable) {
                    return (
                      <FloatingMenuItem
                        key={key}
                        busy={key === 'image' && uploading}
                        icon={key}
                        active={editor.isActive(camelCase(key))}
                        label={control.label}
                        onClick={() => {
                          switch (key) {
                            case 'blockquote':
                              editor.chain().focus().toggleBlockquote().run();
                              toggle();
                              break;
                            case 'image':
                              pickFile(async (file: any) => {
                                try {
                                  setUploading(true);
                                  const files = (await uploadFiles([file], directory)) as unknown as File[];
                                  editor?.chain().focus().setImage({ src: files[0].url }).run();
                                } catch (_e) {
                                  toast.error('Cannot upload file!');
                                } finally {
                                  setUploading(false);
                                  toggle();
                                }
                              });
                              break;
                            case 'divider':
                              editor.chain().focus().setHorizontalRule().run();
                              toggle();
                              break;
                            case 'bullet_list':
                              editor.chain().focus().toggleBulletList().run();
                              toggle();
                              break;
                            case 'ordered_list':
                              editor.chain().focus().toggleOrderedList().run();
                              toggle();
                              break;
                            default:
                              toggle();
                              break;
                          }
                        }}
                      />
                    );
                  }

                  return null;
                })}
              </div>
            );
          }}
        </Menu.Content>
      </Menu.Root>
    </FloatingMenu>
  );
}
