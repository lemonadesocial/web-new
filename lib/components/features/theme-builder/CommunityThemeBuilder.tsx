'use client';
import React from 'react';
import { Sheet, SheetRef } from 'react-modal-sheet';
import { isEqual } from 'lodash';

import { Button, modal } from '$lib/components/core';
import {
  FileCategory,
  GetSystemFilesDocument,
  Space, UpdateSpaceDocument
} from '$lib/graphql/generated/backend/graphql';
import { useMutation, useQuery } from '$lib/graphql/request';

import {
  defaultTheme, fonts,
  getRandomColor,
  getRandomFont,
  getThemeName, presets, ThemeValues
} from './store';
import { ThemeBuilderActionKind, useTheme } from './provider';
import { PopoverColor, PopoverDisplay, PopoverEffect, PopoverFont, PopoverStyle, ThemeTemplate } from './ThemeBuilder';

export function CommunityThemeBuilder({ themeData, spaceId }: { themeData: ThemeValues; spaceId?: string }) {
  const [toggle, setToggle] = React.useState(false);

  // PERF: loading images
  useQuery(GetSystemFilesDocument, {
    variables: { categories: [FileCategory.SpaceDarkTheme, FileCategory.SpaceLightTheme] },
  });

  return (
    <>
      <Button icon="icon-palette-outline" outlined size="lg" onClick={() => setToggle(true)} />
      <CommunityThemeBuilderPane show={toggle} initial={themeData} spaceId={spaceId} onClose={() => setToggle(false)} />
    </>
  );
}

function CommunityThemeBuilderPane({
  initial,
  show,
  onClose,
  spaceId,
}: {
  initial: ThemeValues;
  show: boolean;
  spaceId?: string;
  onClose: () => void;
}) {
  const [state, dispatch] = useTheme();
  const sheetRef = React.useRef<SheetRef>(null);
  
  const themeName = getThemeName(state);
  const mode = state.config.mode || 'dark';

  const [updateCommunity, { loading }] = useMutation(UpdateSpaceDocument);

  const handleCloseSheet = () => {
    const dirty = !isEqual(state, initial);
    if (dirty) {
      modal.open(ConfirmModal, {
        props: {
          onDiscard: () => {
            onClose();
            dispatch({ type: ThemeBuilderActionKind.reset, payload: initial });
          },
        },
      });
      sheetRef.current?.snapTo(0);
    } else {
      onClose();
    }
  };

  return (
    <Sheet ref={sheetRef} isOpen={show} onClose={handleCloseSheet} snapPoints={[324]} initialSnap={0}>
      <Sheet.Backdrop onTap={handleCloseSheet} />

      <Sheet.Container className="bg-overlay-primary/80! rounded-tl-lg! rounded-tr-lg! backdrop-blur-2xl">
        <Sheet.Header className="rounded-tl-lg rounded-tr-lg">
          <div className="flex justify-center items-end h-[20px]">
            <div className="bg-primary/8 rounded-xs w-[48px] h-1 cursor-row-resize"></div>
          </div>
        </Sheet.Header>
        <Sheet.Content disableDrag>
          <Sheet.Scroller draggableAt="top" className="no-scrollbar">
            <div className="flex flex-col gap-6 max-w-[1080px] m-auto py-6 px-4">
              <ThemeTemplate />

              <div className="flex flex-col gap-2">
                <div className="flex gap-2 flex-wrap">
                  <PopoverColor disabled={state.theme && presets[themeName]?.ui?.disabled?.color} />
                  <PopoverStyle />
                  <PopoverEffect />
                </div>

                <div className="flex flex-wrap gap-2">
                  <PopoverFont
                    fonts={fonts.title}
                    label="Title"
                    selected={state.font_title}
                    onClick={(font) => {
                      const payload = {
                        font_title: font,
                        variables: { font: { '--font-title': fonts.title[font] } },
                      };
                      dispatch({ type: ThemeBuilderActionKind.select_font, payload });
                    }}
                  />
                  <PopoverFont
                    fonts={fonts.body}
                    label="Body"
                    selected={state.font_body}
                    onClick={(font) => {
                      const payload = {
                        font_body: font,
                        variables: { font: { '--font-body': fonts.body[font] } },
                      };
                      dispatch({ type: ThemeBuilderActionKind.select_font, payload });
                    }}
                  />

                  <PopoverDisplay />
                </div>
              </div>

              <div className="flex justify-between">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    icon="icon-recent"
                    variant="tertiary-alt"
                    onClick={async () => {
                      if (spaceId) {
                        await updateCommunity({
                          variables: { id: spaceId, input: { theme_data: null } },
                          onComplete: (client) => {
                            client.writeFragment<Space>({ id: `Space:${spaceId}`, data: { theme_data: null } });
                            dispatch({ type: ThemeBuilderActionKind.reset, payload: defaultTheme });
                          },
                        });
                      }
                    }}
                  />
                  <Button
                    size="sm"
                    icon="icon-shuffle"
                    variant="tertiary-alt"
                    disabled={themeName !== 'minimal'}
                    onClick={async () => {
                      const [fontTitle, fontTitleVariable] = getRandomFont('title');
                      const [fontBody, fontBodyVariable] = getRandomFont('body');
                      const payload = {
                        font_title: fontTitle,
                        font_body: fontBody,
                        variables: { font: { '--font-title': fontTitleVariable, '--font-body': fontBodyVariable } },
                      };
                      dispatch({ type: ThemeBuilderActionKind.select_font, payload });
                      dispatch({
                        type: ThemeBuilderActionKind.select_template,
                        payload: { theme: 'minimal', config: { color: getRandomColor() } },
                      });
                    }}
                  />
                </div>

                <div className="flex gap-2">
                  {/* <Button variant="tertiary" size="sm"> */}
                  {/*   Save Theme */}
                  {/* </Button> */}
                  <Button
                    size="sm"
                    loading={loading}
                    onClick={async () => {
                      if (spaceId) {
                        await updateCommunity({
                          variables: { id: spaceId, input: { theme_data: state } },
                          onComplete: (client) => {
                            client.writeFragment<Space>({ id: `Space:${spaceId}`, data: { theme_data: state } });
                          },
                        });
                      }
                    }}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          </Sheet.Scroller>
        </Sheet.Content>
      </Sheet.Container>
    </Sheet>
  );
}

function ConfirmModal({ onDiscard }: { onDiscard: () => void }) {
  return (
    <div className="p-4 flex flex-col gap-4 max-w-[308px]">
      <div className="p-3 rounded-full bg-danger-400/16 w-fit">
        <i className="icon-info text-danger-400" />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-lg font-medium">Discard Customizations?</p>
        <p className="text-sm font-medium text-secondary">
          Your theme changes haven’t been applied. Discard them or go back to keep editing.
        </p>
      </div>
      <div className="flex gap-3">
        <Button
          variant="tertiary"
          className="flex-1"
          onClick={() => {
            modal.close();
          }}
        >
          Cancel
        </Button>
        <Button
          variant="danger"
          className="flex-1"
          onClick={() => {
            modal.close();
            onDiscard();
          }}
        >
          Discard
        </Button>
      </div>
    </div>
  );
}
