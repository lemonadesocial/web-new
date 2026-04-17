import React from 'react';
import clsx from 'clsx';
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { AboutSection } from '$lib/components/features/event/AboutSection';
import { LocationSection } from '$lib/components/features/event/LocationSection';
import { EventAccess } from '$lib/components/features/event-access/EventAccess';
import { EventCollectibles } from '$lib/components/features/event-collectibles/EventCollectibles';
import { SubEventSection } from '$lib/components/features/event/SubEventSection';
import { GallerySection } from '$lib/components/features/event/GallerySection';
import { EventDateTimeBlock } from '$lib/components/features/event/EventDateTimeBlock';
import { EventLocationBlock } from '$lib/components/features/event/EventLocationBlock';
import { CommunitySection } from '$lib/components/features/event/CommunitySection';
import { HostedBySection } from '$lib/components/features/event/HostedBySection';
import { AttendeesSection } from '$lib/components/features/event/AttendeesSection';
import {
  Button,
  Input,
  Textarea,
  Toggle,
  Segment,
  TextEditor,
  PlaceAutoComplete,
  FileInput,
  Accordion,
} from '$lib/components/core';
import { getEventCohosts } from '$lib/utils/event';
import { randomEventDP } from '$lib/utils/user';
import { useSettings } from '../SettingsPanel';
import { generateUrl, EDIT_KEY } from '$lib/utils/cnd';
import { DateTimeGroup, Timezone } from '$lib/components/core/calendar';
import { useStoreManageLayout, storeManageLayout } from '../store';
import { Event, File as BackendFile } from '$lib/graphql/generated/backend/graphql';
import { uploadFiles } from '$lib/utils/file';
import { toast } from '$lib/components/core/toast';
import { usePageEditor, usePageNode, useNodeId } from '$lib/components/features/page-builder/context';

const useEvent = (props: any) => {
  const layoutState = useStoreManageLayout();
  return (layoutState.data as Event) || props.event;
};

const getEmbedUrl = (url: string) => {
  if (!url) return null;
  let match = url.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/);
  if (match) return `https://www.youtube.com/embed/${match[1]}`;
  match = url.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)([0-9]+)/);
  if (match) return `https://player.vimeo.com/video/${match[1]}`;
  return null;
};

// ─────────────────────────────────────────────────────────────────────────────
// Settings panels (all use useSettings from SettingsPanel)
// ─────────────────────────────────────────────────────────────────────────────

const SidebarImageSettings = () => {
  const { actions, props } = useSettings();
  const state = useStoreManageLayout();
  const event = state.data as Event;
  const [uploading, setUploading] = React.useState(false);

  const handleUpload = async (files: File[]) => {
    if (!files.length) return;
    try {
      setUploading(true);
      const res = await uploadFiles([files[0]], 'event');
      if (res.length > 0) {
        const newImageId = res[0]._id;
        const newPhotosExpanded = [res[0], ...(event.new_new_photos_expanded || []).slice(1)];
        const newPhotos = [newImageId, ...(event.new_new_photos || []).slice(1)];
        storeManageLayout.setData({
          ...event,
          new_new_photos_expanded: newPhotosExpanded as any,
          new_new_photos: newPhotos,
        });
        toast.success('Image uploaded successfully!');
      }
    } catch (_e) {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Event Image</p>
        <FileInput onChange={handleUpload} multiple={false}>
          {(open) => (
            <button
              type="button"
              onClick={open}
              className="aspect-square w-full border-2 border-dashed border-card-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-card-hover transition-colors relative overflow-hidden"
            >
              {event?.new_new_photos_expanded?.[0] ? (
                <img
                  src={generateUrl(event.new_new_photos_expanded[0], EDIT_KEY.EVENT_PHOTO)}
                  className="absolute inset-0 w-full h-full object-cover opacity-40"
                />
              ) : null}
              <div className="z-10 flex flex-col items-center gap-2">
                <i
                  className={clsx(uploading ? 'icon-loader animate-spin' : 'icon-upload-sharp', 'size-8 text-tertiary')}
                />
                <p className="text-xs text-tertiary">{uploading ? 'Uploading...' : 'Click to upload'}</p>
              </div>
            </button>
          )}
        </FileInput>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Height (px)</p>
        <Input
          type="number"
          value={props.height || ''}
          onChange={(e) => actions.setProp((props: any) => (props.height = e.target.value))}
          placeholder="Auto"
        />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Aspect Ratio</p>
        <Segment
          items={[
            { label: 'Auto', value: 'aspect-auto' },
            { label: 'Square', value: 'aspect-square' },
            { label: 'Video', value: 'aspect-video' },
          ]}
          selected={props.aspectRatio || 'aspect-square'}
          onSelect={(item) => actions.setProp((props: any) => (props.aspectRatio = item.value))}
          size="sm"
          className="w-full"
        />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Object Fit</p>
        <Segment
          items={[
            { label: 'Cover', value: 'object-cover' },
            { label: 'Contain', value: 'object-contain' },
          ]}
          selected={props.objectFit || 'object-cover'}
          onSelect={(item) => actions.setProp((props: any) => (props.objectFit = item.value))}
          size="sm"
          className="w-full"
        />
      </div>
    </div>
  );
};

const HeroSettings = () => {
  const { actions, props } = useSettings();
  const state = useStoreManageLayout();
  const event = state.data as Event;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Title</p>
        <Input
          value={event?.title || ''}
          onChange={(e) => storeManageLayout.setData({ ...event, title: e.target.value })}
          placeholder="Enter event title..."
        />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Height (px)</p>
        <Input
          type="number"
          value={props.height || ''}
          onChange={(e) => actions.setProp((props: any) => (props.height = e.target.value))}
          placeholder="Auto"
        />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Width (px)</p>
          {props.width && (
            <button
              className="text-[10px] text-accent-400 hover:underline uppercase font-bold"
              onClick={() => actions.setProp((props: any) => (props.width = ''))}
            >
              Set Full
            </button>
          )}
        </div>
        <Input
          type="number"
          value={props.width || ''}
          onChange={(e) => actions.setProp((props: any) => (props.width = e.target.value))}
          placeholder="Leave empty for Full Screen"
        />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Alignment</p>
        <Segment
          items={[
            { label: 'Left', value: 'text-left' },
            { label: 'Center', value: 'text-center' },
            { label: 'Right', value: 'text-right' },
          ]}
          selected={props.align || 'text-left'}
          onSelect={(item) => actions.setProp((props: any) => (props.align = item.value))}
          size="sm"
          className="w-full"
        />
      </div>
    </div>
  );
};

const AboutSettings = () => {
  const state = useStoreManageLayout();
  const event = state.data as Event;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Description</p>
        <TextEditor
          content={event?.description || ''}
          onChange={(value) => storeManageLayout.setData({ ...event, description: value })}
          placeholder="Who should come? What's the event about?"
        />
      </div>
    </div>
  );
};

const RichTextSettings = () => {
  const { actions, props } = useSettings();
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Content</p>
        <TextEditor
          content={props.content || ''}
          onChange={(value) =>
            actions.setProp((props: any) => {
              props.content = value;
            })
          }
          placeholder="Type something here..."
        />
      </div>
    </div>
  );
};

const VideoEmbedSettings = () => {
  const { actions, props } = useSettings();
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Video URL</p>
        <Input
          value={props.url || ''}
          onChange={(e) =>
            actions.setProp((props: any) => {
              props.url = e.target.value;
            })
          }
          placeholder="YouTube or Vimeo URL"
        />
      </div>
    </div>
  );
};

const RegistrationSettings = () => {
  const { actions, props } = useSettings();
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Heading</p>
        <Input
          value={props.registration_heading || 'Registration'}
          onChange={(e) => actions.setProp((props: any) => (props.registration_heading = e.target.value))}
        />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Description</p>
        <Textarea
          value={
            props.registration_description ||
            'Ready to join us? Pick your ticket, grab your spot, and get ready for a weekend of music, art, and culture.'
          }
          onChange={(e) => actions.setProp((props: any) => (props.registration_description = e.target.value))}
          rows={3}
        />
      </div>
    </div>
  );
};

const ColSettings = () => {
  const { id, actions, props } = useSettings();
  const { device } = useStoreManageLayout();

  const isMobile = device === 'mobile';
  const widthKey = isMobile ? 'width_mobile' : 'width';
  const label = isMobile ? 'Width (Mobile)' : 'Width (Desktop)';

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">{label}</p>
        <Segment
          items={[
            { label: 'Auto', value: '' },
            { label: 'Sidebar (300px)', value: '300' },
            { label: '1/2', value: '1/2' },
            { label: '1/3', value: '1/3' },
            { label: '2/3', value: '2/3' },
          ]}
          selected={props[widthKey] || ''}
          onSelect={(item) => actions.setProp((props: any) => (props[widthKey] = item.value))}
          size="sm"
          className="w-full"
        />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Height (px)</p>
        <Input
          type="number"
          value={props.height || ''}
          onChange={(e) => actions.setProp((props: any) => (props.height = e.target.value))}
          placeholder="Auto"
        />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">{isMobile ? 'Width Mobile (px)' : 'Width Desktop (px)'}</p>
          {props[widthKey] && (
            <button
              className="text-[10px] text-accent-400 hover:underline uppercase font-bold"
              onClick={() => actions.setProp((props: any) => (props[widthKey] = ''))}
            >
              Set Full
            </button>
          )}
        </div>
        <Input
          id={`col-width-${id}`}
          type="number"
          value={props[widthKey] || ''}
          onChange={(e) => actions.setProp((props: any) => (props[widthKey] = e.target.value))}
          placeholder="Leave empty for Full Screen"
        />
      </div>
    </div>
  );
};

const DateTimeSettings = () => {
  const state = useStoreManageLayout();
  const event = state.data as Event;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <DateTimeGroup
          placement="bottom"
          start={event?.start}
          end={event?.end}
          timezone={event?.timezone ?? undefined}
          onSelect={(dateRange) => storeManageLayout.setData({ ...event, start: dateRange.start, end: dateRange.end })}
        />
        <Timezone
          placement="bottom-end"
          onSelect={(timezoneOption) => storeManageLayout.setData({ ...event, timezone: timezoneOption.value })}
          strategy="absolute"
          className="w-full"
          trigger={() => (
            <div className="flex items-center gap-2 p-3 border border-card-border rounded-md bg-card cursor-pointer hover:bg-card-hover transition-colors">
              <i aria-hidden="true" className="icon-globe size-5 text-tertiary" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{event?.timezone || 'Select Timezone'}</p>
              </div>
              <i className="icon-chevron-down size-4 text-quaternary" />
            </div>
          )}
        />
      </div>
    </div>
  );
};

const MapSettings = () => {
  const state = useStoreManageLayout();
  const event = state.data as Event;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Event Location</p>
        <PlaceAutoComplete
          value={event?.address?.title || ''}
          placeholder="What's the address?"
          onSelect={(addressData) =>
            storeManageLayout.setData({
              ...event,
              address: addressData,
              latitude: addressData?.latitude,
              longitude: addressData?.longitude,
            })
          }
        />
      </div>
    </div>
  );
};

const LocationSettings = () => {
  const state = useStoreManageLayout();
  const event = state.data as Event;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Event Location</p>
        <PlaceAutoComplete
          value={event?.address?.title || ''}
          placeholder="What's the address?"
          onSelect={(addressData) =>
            storeManageLayout.setData({
              ...event,
              address: addressData,
              latitude: addressData?.latitude,
              longitude: addressData?.longitude,
            })
          }
        />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Join URL</p>
        <Input
          value={event?.virtual_url || ''}
          onChange={(e) => storeManageLayout.setData({ ...event, virtual_url: e.target.value })}
          placeholder="https://example.com/join"
        />
      </div>
    </div>
  );
};

const Placeholder = ({ name, description }: { name: string; description?: string }) => {
  const { enabled } = usePageEditor();
  if (!enabled) return null;
  return (
    <div className="w-full p-6 bg-accent-400/5 border border-dashed border-accent-400/20 rounded-md text-center">
      <p className="text-accent-500 font-medium">{name} Section</p>
      <p className="text-tertiary text-xs">
        {description || `No data provided for this ${name.toLowerCase()} section.`}
      </p>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// CraftSection – the drag/drop wrapper for leaf nodes
// ─────────────────────────────────────────────────────────────────────────────

export const CraftSection = ({
  children,
  name,
  noPadding,
  ...props
}: {
  children?: React.ReactNode;
  name?: string;
  noPadding?: boolean;
  [key: string]: any;
}) => {
  const id = useNodeId();
  const { enabled, nodes, actions } = usePageEditor();
  const { nodeProps, selected, actions: nodeActions } = usePageNode();
  const [isResizing, setIsResizing] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragZone, setDragZone] = React.useState<'top' | 'bottom' | 'inline' | null>(null);
  const divRef = React.useRef<HTMLDivElement>(null);

  const setProp = (updater: (p: any) => void) => nodeActions.setProp(updater);

  const getPosition = () => {
    const nodeData = nodes[id];
    if (!nodeData) return { parentId: null, index: -1, total: 0 };
    const parentId = nodeData.parent;
    if (!parentId || !nodes[parentId]) return { parentId: null, index: -1, total: 0 };
    const siblings = nodes[parentId].nodes;
    return { parentId, index: siblings.indexOf(id), total: siblings.length };
  };

  const { index, total, parentId } = getPosition();
  const isFirst = index === 0;
  const isLast = index === total - 1;

  const moveUp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!parentId || isFirst) return;
    actions.moveNode(id, parentId, index - 1);
  };

  const moveDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!parentId || isLast) return;
    actions.moveNode(id, parentId, index + 2);
  };

  const remove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    actions.deleteNode(id);
  };

  const width = nodeProps.width || props.width;
  const height = nodeProps.height || props.height;
  const aspectRatio = nodeProps.aspectRatio || props.aspectRatio;
  const isNumericWidth = width && !isNaN(Number(width));
  const widthStyle = isNumericWidth ? '100%' : typeof width === 'string' && width.includes('/') ? width : '100%';
  const maxWidth = isNumericWidth ? `${width}px` : undefined;

  // ── Pragmatic DnD ──────────────────────────────────────────
  React.useEffect(() => {
    if (!enabled || !divRef.current) return;
    const el = divRef.current;

    return combine(
      draggable({
        element: el,
        getInitialData: () => ({ type: 'canvas-node', nodeId: id }),
        onDragStart: () => setIsDragging(true),
        onDrop: () => setIsDragging(false),
      }),
      dropTargetForElements({
        element: el,
        canDrop: ({ source }) =>
          (source.data.type === 'canvas-node' && source.data.nodeId !== id) || source.data.type === 'new-section',
        getData: ({ input }) => {
          const rect = el.getBoundingClientRect();
          const relY = input.clientY - rect.top;
          const threshold = rect.height * 0.25;
          let zone: 'top' | 'bottom' | 'inline';
          if (relY < threshold) zone = 'top';
          else if (relY > rect.height - threshold) zone = 'bottom';
          else zone = 'inline';
          return { nodeId: id, zone };
        },
        onDragEnter: ({ self }) => setDragZone((self.data as any).zone),
        onDrag: ({ self }) => setDragZone((self.data as any).zone),
        onDragLeave: () => setDragZone(null),
        onDrop: ({ self, source }) => {
          setDragZone(null);
          const zone = (self.data as any).zone as 'top' | 'bottom' | 'inline';
          const { index: curIndex, parentId: curParent } = getPosition();
          if (!curParent) return;

          if (zone === 'top' || zone === 'bottom') {
            const targetIndex = zone === 'top' ? curIndex : curIndex + 1;
            if (source.data.type === 'canvas-node') {
              actions.moveNode(source.data.nodeId as string, curParent, targetIndex);
            } else if (source.data.type === 'new-section') {
              const { componentName, displayName } = source.data as any;
              actions.addNode(curParent, componentName, displayName, {}, targetIndex);
            }
          } else {
            // inline: place side-by-side in an InlineGrid
            const parentIsInlineGrid = nodes[curParent]?.type?.resolvedName === 'InlineGrid';
            if (source.data.type === 'canvas-node') {
              const sourceId = source.data.nodeId as string;
              if (parentIsInlineGrid) {
                actions.moveNode(sourceId, curParent, Number.MAX_SAFE_INTEGER);
              } else {
                actions.wrapInInlineGrid(id, sourceId);
              }
            } else if (source.data.type === 'new-section') {
              const { componentName, displayName } = source.data as any;
              if (parentIsInlineGrid) {
                actions.addNode(curParent, componentName, displayName, {});
              } else {
                actions.wrapNewInInlineGrid(id, componentName, displayName);
              }
            }
          }
        },
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, id]);

  if (!enabled && !children) return null;

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      ref={divRef}
      data-node-id={id}
      onClick={(e) => {
        if (!enabled) return;
        e.stopPropagation();
        actions.selectNode(id);
      }}
      className={clsx(
        'relative group/section w-full flex flex-col overflow-visible rounded-2xl transition-all',
        aspectRatio,
        enabled && 'cursor-pointer hover:bg-primary/5',
        isResizing && 'z-[300]',
        isDragging && 'opacity-40',
      )}
      style={{
        height: height ? `${height}px` : aspectRatio && aspectRatio !== 'aspect-auto' ? undefined : 'auto',
        width: widthStyle,
        maxWidth: '100%',
      }}
    >
      {/* Drop indicators */}
      {dragZone === 'top' && enabled && (
        <div className="absolute -top-0.5 left-2 right-2 h-0.5 bg-accent-400 z-[110] rounded-full pointer-events-none" />
      )}
      {dragZone === 'bottom' && enabled && (
        <div className="absolute -bottom-0.5 left-2 right-2 h-0.5 bg-accent-400 z-[110] rounded-full pointer-events-none" />
      )}
      {dragZone === 'inline' && enabled && (
        <div className="absolute inset-0 border-2 border-accent-400 bg-accent-400/10 z-[110] rounded-2xl pointer-events-none flex items-center justify-center">
          <span className="bg-accent-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">Side by side</span>
        </div>
      )}

      {/* Selection border */}
      {enabled && selected && (
        <div className="absolute inset-0 z-50 pointer-events-none border-2 border-primary rounded-2xl shadow-[0_0_0_1px_rgba(255,255,255,0.2)]" />
      )}

      {/* Interaction blocker */}
      {enabled && <div className="absolute inset-0 z-40" />}

      {enabled && selected && (
        <>
          <div className="absolute -top-4 right-4 z-100 flex gap-1 bg-overlay-primary border border-card-border p-1 rounded-md shadow-lg">
            <Button
              size="xs"
              variant="tertiary-alt"
              icon="icon-arrow-back-sharp rotate-90"
              disabled={isFirst}
              onClick={moveUp}
              className="h-7 w-7 p-0"
            />
            <Button
              size="xs"
              variant="tertiary-alt"
              icon="icon-arrow-back-sharp -rotate-90"
              disabled={isLast}
              onClick={moveDown}
              className="h-7 w-7 p-0"
            />
            <Button
              size="xs"
              variant="tertiary-alt"
              icon="icon-delete"
              onClick={remove}
              className="h-7 w-7 p-0 hover:text-error!"
            />
          </div>

          {/* Top resize */}
          <div
            role="separator"
            aria-orientation="horizontal"
            aria-hidden="true"
            onMouseDown={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setIsResizing(true);
              const startY = e.pageY;
              const rect = (e.currentTarget.parentElement as HTMLElement).getBoundingClientRect();
              const startHeight = rect.height;
              const onMove = (ev: MouseEvent) =>
                setProp((p: any) => {
                  p.height = Math.max(50, Math.round(startHeight + (startY - ev.pageY)));
                });
              const onUp = () => {
                setIsResizing(false);
                document.removeEventListener('mousemove', onMove);
                document.removeEventListener('mouseup', onUp);
              };
              document.addEventListener('mousemove', onMove);
              document.addEventListener('mouseup', onUp);
            }}
            className="absolute top-0 left-0 right-0 h-2 z-90 cursor-ns-resize flex items-center justify-center group/handle-t bg-transparent"
          >
            <div className="w-12 h-1 bg-primary rounded-full opacity-0 group-hover/handle-t:opacity-100 transition-opacity shadow-sm" />
          </div>

          {/* Left resize */}
          <div
            role="separator"
            aria-orientation="vertical"
            aria-hidden="true"
            onMouseDown={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setIsResizing(true);
              const startX = e.pageX;
              const rect = (e.currentTarget.parentElement as HTMLElement).getBoundingClientRect();
              const startWidth = rect.width;
              const onMove = (ev: MouseEvent) =>
                setProp((p: any) => {
                  p.width = Math.max(100, Math.round(startWidth + (startX - ev.pageX)));
                });
              const onUp = () => {
                setIsResizing(false);
                document.removeEventListener('mousemove', onMove);
                document.removeEventListener('mouseup', onUp);
              };
              document.addEventListener('mousemove', onMove);
              document.addEventListener('mouseup', onUp);
            }}
            className="absolute left-0 top-0 bottom-0 w-2 z-110 cursor-ew-resize flex items-center justify-center group/handle-l bg-transparent"
          >
            <div className="h-12 w-1 bg-primary rounded-full opacity-0 group-hover/handle-l:opacity-100 transition-opacity shadow-sm" />
          </div>

          {/* Right resize */}
          <div
            role="separator"
            aria-orientation="vertical"
            aria-hidden="true"
            onMouseDown={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setIsResizing(true);
              const startX = e.pageX;
              const rect = (e.currentTarget.parentElement as HTMLElement).getBoundingClientRect();
              const startWidth = rect.width;
              const onMove = (ev: MouseEvent) =>
                setProp((p: any) => {
                  p.width = Math.max(100, Math.round(startWidth + (ev.pageX - startX)));
                });
              const onUp = () => {
                setIsResizing(false);
                document.removeEventListener('mousemove', onMove);
                document.removeEventListener('mouseup', onUp);
              };
              document.addEventListener('mousemove', onMove);
              document.addEventListener('mouseup', onUp);
            }}
            className="absolute right-0 top-0 bottom-0 w-2 z-110 cursor-ew-resize flex items-center justify-center group/handle-w bg-transparent"
          >
            <div className="h-12 w-1 bg-primary rounded-full opacity-0 group-hover/handle-w:opacity-100 transition-opacity shadow-sm" />
          </div>

          {/* Bottom resize */}
          <div
            role="separator"
            aria-orientation="horizontal"
            aria-hidden="true"
            onMouseDown={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setIsResizing(true);
              const startY = e.pageY;
              const rect = (e.currentTarget.parentElement as HTMLElement).getBoundingClientRect();
              const startHeight = rect.height;
              const onMove = (ev: MouseEvent) =>
                setProp((p: any) => {
                  p.height = Math.max(50, Math.round(startHeight + (ev.pageY - startY)));
                });
              const onUp = () => {
                setIsResizing(false);
                document.removeEventListener('mousemove', onMove);
                document.removeEventListener('mouseup', onUp);
              };
              document.addEventListener('mousemove', onMove);
              document.addEventListener('mouseup', onUp);
            }}
            className="absolute bottom-0 left-0 right-0 h-2 z-110 cursor-ns-resize flex items-center justify-center group/handle-h bg-transparent"
          >
            <div className="w-12 h-1 bg-primary rounded-full opacity-0 group-hover/handle-h:opacity-100 transition-opacity shadow-sm" />
          </div>

          {/* Corner: Bottom-Right */}
          <div
            role="separator"
            aria-hidden="true"
            onMouseDown={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setIsResizing(true);
              const sX = e.pageX;
              const sY = e.pageY;
              const rect = (e.currentTarget.parentElement as HTMLElement).getBoundingClientRect();
              const sW = rect.width;
              const sH = rect.height;
              const onMove = (ev: MouseEvent) =>
                setProp((p: any) => {
                  p.width = Math.max(100, Math.round(sW + (ev.pageX - sX)));
                  p.height = Math.max(50, Math.round(sH + (ev.pageY - sY)));
                });
              const onUp = () => {
                setIsResizing(false);
                document.removeEventListener('mousemove', onMove);
                document.removeEventListener('mouseup', onUp);
              };
              document.addEventListener('mousemove', onMove);
              document.addEventListener('mouseup', onUp);
            }}
            className="absolute bottom-0 right-0 w-4 h-4 z-120 cursor-nwse-resize bg-transparent hover:bg-primary/10 transition-colors rounded-br-xl border-r-2 border-b-2 border-primary/40"
          />
        </>
      )}

      <div
        className={clsx(
          'w-full rounded-2xl flex-1',
          !noPadding && 'p-3',
          height ? 'overflow-hidden' : 'overflow-visible',
        )}
      >
        {children || <Placeholder name={name || 'Section'} />}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Tabs
// ─────────────────────────────────────────────────────────────────────────────

const TabSettings = () => {
  const { actions, props } = useSettings();
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Tab Label</p>
        <Input
          value={props.label || ''}
          onChange={(e) => actions.setProp((props: any) => (props.label = e.target.value))}
          placeholder="Enter tab name..."
        />
      </div>
    </div>
  );
};

export const CraftTabs = ({ children, activeIndex = 0 }: any) => {
  const [selectedTab, setSelectedTab] = React.useState(activeIndex);
  const id = useNodeId();
  const { enabled, actions } = usePageEditor();
  const { selected } = usePageNode();
  const tabs = React.Children.toArray(children);

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      onClick={(e) => {
        if (!enabled || e.target !== e.currentTarget) return;
        e.stopPropagation();
        actions.selectNode(id);
      }}
      className={clsx(
        'w-full flex flex-col gap-4 p-4 rounded-lg',
        enabled && 'border border-dashed border-transparent hover:border-primary/20',
        enabled && selected && 'border-primary/50 bg-primary/5',
      )}
    >
      <div className="flex items-center border-b border-card-border overflow-x-auto no-scrollbar">
        {tabs.map((tab: any, index) => (
          <button
            key={index}
            onClick={() => setSelectedTab(index)}
            className={clsx(
              'px-6 py-3 text-sm font-medium transition-all border-b-2 shrink-0',
              selectedTab === index
                ? 'border-primary text-primary'
                : 'border-transparent text-tertiary hover:text-secondary',
            )}
          >
            {tab.props.label || `Tab ${index + 1}`}
          </button>
        ))}
        {enabled && (
          <Button
            size="xs"
            variant="tertiary"
            icon="icon-plus"
            className="ml-2 h-8 w-8 p-0"
            onClick={(e) => {
              e.stopPropagation();
              actions.addNode(id, 'Tab', `Tab ${tabs.length + 1}`, { label: `Tab ${tabs.length + 1}` });
            }}
          />
        )}
      </div>
      <div className="flex-1">
        {tabs.length > 0 ? (
          tabs[selectedTab]
        ) : (
          <div className="p-10 border-2 border-dashed border-primary/10 rounded-lg flex items-center justify-center text-tertiary/30 text-xs">
            Add a tab to get started
          </div>
        )}
      </div>
    </div>
  );
};
CraftTabs.craft = { isCanvas: true, displayName: 'Tabs' };

export const CraftTab = ({ children, label: _label }: any) => {
  const id = useNodeId();
  const { enabled, actions } = usePageEditor();
  const { selected } = usePageNode();
  const divRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!enabled || !divRef.current) return;
    return dropTargetForElements({
      element: divRef.current,
      canDrop: ({ source }) => source.data.type === 'canvas-node' || source.data.type === 'new-section',
      onDrop: ({ source, location }) => {
        // Only handle drops that land directly on this tab (not on a child section)
        if (location.current.dropTargets[0]?.element !== divRef.current) return;
        if (source.data.type === 'canvas-node') {
          actions.moveNode(source.data.nodeId as string, id, Number.MAX_SAFE_INTEGER);
        } else if (source.data.type === 'new-section') {
          const { componentName, displayName } = source.data as any;
          actions.addNode(id, componentName, displayName, {});
        }
      },
    });
  }, [enabled, id]);

  return (
    <div
      ref={divRef}
      className={clsx(
        'w-full min-h-[100px] relative transition-all',
        enabled && 'border border-dashed border-transparent hover:border-primary/10',
        enabled && selected && 'border-primary/30',
      )}
    >
      {enabled && selected && (
        <div className="absolute -top-4 right-0 z-100 flex gap-1 bg-overlay-primary border border-card-border p-1 rounded-md shadow-lg">
          <Button
            size="xs"
            variant="tertiary-alt"
            icon="icon-delete"
            onClick={(e) => {
              e.stopPropagation();
              actions.deleteNode(id);
            }}
            className="h-7 w-7 p-0 hover:text-error!"
          />
        </div>
      )}
      {children}
      {enabled && React.Children.count(children) === 0 && (
        <div className="flex-1 border-2 border-dashed border-primary/10 rounded-lg min-h-[100px] flex items-center justify-center text-tertiary/30 text-xs">
          Drop sections here
        </div>
      )}
    </div>
  );
};
CraftTab.craft = { isCanvas: true, displayName: 'Tab', related: { settings: TabSettings } };

// ─────────────────────────────────────────────────────────────────────────────
// Accordion
// ─────────────────────────────────────────────────────────────────────────────

const AccordionItemSettings = () => {
  const { actions, props } = useSettings();
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Item Title</p>
        <Input
          value={props.title || ''}
          onChange={(e) => actions.setProp((props: any) => (props.title = e.target.value))}
          placeholder="Enter item title..."
        />
      </div>
    </div>
  );
};

export const CraftAccordion = ({ children }: any) => {
  const id = useNodeId();
  const { enabled, actions } = usePageEditor();
  const { selected } = usePageNode();

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      onClick={(e) => {
        if (!enabled || e.target !== e.currentTarget) return;
        e.stopPropagation();
        actions.selectNode(id);
      }}
      className={clsx(
        'w-full flex flex-col gap-2 p-4 rounded-lg',
        enabled && 'border border-dashed border-transparent hover:border-primary/20',
        enabled && selected && 'border-primary/50 bg-primary/5',
      )}
    >
      <div className="flex flex-col divide-y divide-card-border border border-card-border rounded-lg overflow-hidden">
        {children}
      </div>
      {enabled && (
        <Button
          size="sm"
          variant="tertiary"
          icon="icon-plus"
          className="mt-2 w-full border-dashed"
          onClick={(e) => {
            e.stopPropagation();
            const count = React.Children.count(children) + 1;
            actions.addNode(id, 'AccordionItem', `Accordion Item ${count}`, { title: `Accordion Item ${count}` });
          }}
        >
          Add Item
        </Button>
      )}
    </div>
  );
};
CraftAccordion.craft = { isCanvas: true, displayName: 'Accordion' };

export const CraftAccordionItem = ({ children, title }: any) => {
  const id = useNodeId();
  const { enabled, actions } = usePageEditor();
  const { selected } = usePageNode();
  const divRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!enabled || !divRef.current) return;
    return dropTargetForElements({
      element: divRef.current,
      canDrop: ({ source }) => source.data.type === 'canvas-node' || source.data.type === 'new-section',
      onDrop: ({ source, location }) => {
        // Only handle drops that land directly on this accordion item (not on a child section)
        if (location.current.dropTargets[0]?.element !== divRef.current) return;
        if (source.data.type === 'canvas-node') {
          actions.moveNode(source.data.nodeId as string, id, Number.MAX_SAFE_INTEGER);
        } else if (source.data.type === 'new-section') {
          const { componentName, displayName } = source.data as any;
          actions.addNode(id, componentName, displayName, {});
        }
      },
    });
  }, [enabled, id]);

  return (
    <div
      ref={divRef}
      className={clsx(
        'w-full relative transition-all',
        enabled && 'border-2 border-dashed border-transparent hover:border-primary/20',
        enabled && selected && 'border-primary/30 bg-primary/5',
      )}
    >
      <Accordion.Root open={enabled || selected} className="border-none!">
        <Accordion.Header className="px-4 py-3 bg-card hover:bg-card-hover transition-colors">
          <p className="font-medium text-sm">{title || 'Accordion Item'}</p>
        </Accordion.Header>
        <Accordion.Content className="p-4 bg-background">
          {enabled && selected && (
            <div className="absolute -top-4 right-0 z-100 flex gap-1 bg-overlay-primary border border-card-border p-1 rounded-md shadow-lg">
              <Button
                size="xs"
                variant="tertiary-alt"
                icon="icon-delete"
                onClick={(e) => {
                  e.stopPropagation();
                  actions.deleteNode(id);
                }}
                className="h-7 w-7 p-0 hover:text-error!"
              />
            </div>
          )}
          {children}
          {enabled && React.Children.count(children) === 0 && (
            <div className="flex-1 border-2 border-dashed border-primary/10 rounded-lg min-h-[50px] flex items-center justify-center text-tertiary/30 text-xs">
              Drop sections here
            </div>
          )}
        </Accordion.Content>
      </Accordion.Root>
    </div>
  );
};
CraftAccordionItem.craft = {
  isCanvas: true,
  displayName: 'Accordion Item',
  related: { settings: AccordionItemSettings },
};

// ─────────────────────────────────────────────────────────────────────────────
// Container
// ─────────────────────────────────────────────────────────────────────────────

const ContainerSettings = () => {
  const { id, actions, props } = useSettings();
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Centered Content</p>
        <Toggle
          id={`centered-container-${id}`}
          checked={props.centered || false}
          onChange={(val) => actions.setProp((props: any) => (props.centered = val))}
        />
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Center Children</p>
        <Toggle
          id={`center-children-${id}`}
          checked={props.centerChildren || false}
          onChange={(val) => actions.setProp((props: any) => (props.centerChildren = val))}
        />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Padding (Vertical)</p>
        <Segment
          items={[
            { label: 'None', value: '0' },
            { label: 'Small', value: '8' },
            { label: 'Medium', value: '16' },
            { label: 'Large', value: '32' },
          ]}
          selected={props.padding || '0'}
          onSelect={(item) => actions.setProp((props: any) => (props.padding = item.value))}
          size="sm"
          className="w-full"
        />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Padding (Horizontal)</p>
        <Segment
          items={[
            { label: 'None', value: '0' },
            { label: 'Small', value: '1' },
            { label: 'Medium', value: '4' },
            { label: 'Large', value: '8' },
          ]}
          selected={props.px || '1'}
          onSelect={(item) => actions.setProp((props: any) => (props.px = item.value))}
          size="sm"
          className="w-full"
        />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Height (px)</p>
        <Input
          type="number"
          value={props.height || ''}
          onChange={(e) => actions.setProp((props: any) => (props.height = e.target.value))}
          placeholder="Auto"
        />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Width (px)</p>
          {props.width && (
            <button
              className="text-[10px] text-accent-400 hover:underline uppercase font-bold"
              onClick={() => actions.setProp((props: any) => (props.width = ''))}
            >
              Set Full
            </button>
          )}
        </div>
        <Input
          type="number"
          value={props.width || ''}
          onChange={(e) => actions.setProp((props: any) => (props.width = e.target.value))}
          placeholder="Leave empty for Full Screen"
        />
      </div>
    </div>
  );
};

export const Container = ({
  children,
  height,
  width,
  centered,
  centerChildren,
  padding = '0',
  px = '1',
  ...props
}: any) => {
  const id = useNodeId();
  const { enabled, actions } = usePageEditor();
  const { selected } = usePageNode();
  const isNumericWidth = width && !isNaN(Number(width));
  const widthStyle = isNumericWidth ? '100%' : typeof width === 'string' && width.includes('/') ? width : '100%';
  const maxWidth = isNumericWidth ? `${width}px` : undefined;
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [containerDropActive, setContainerDropActive] = React.useState(false);

  // Always-active drop target on the container div itself.
  // The empty space below children has no element covering it, so drags there
  // naturally hit the container div — no separate strip needed.
  React.useEffect(() => {
    if (!enabled || !containerRef.current) return;
    return dropTargetForElements({
      element: containerRef.current,
      canDrop: ({ source }) => source.data.type === 'canvas-node' || source.data.type === 'new-section',
      onDragEnter: () => setContainerDropActive(true),
      onDragLeave: () => setContainerDropActive(false),
      onDrop: ({ source, location }) => {
        setContainerDropActive(false);
        // Only handle drops that land directly on the container (not on a child section)
        if (location.current.dropTargets[0]?.element !== containerRef.current) return;
        if (source.data.type === 'canvas-node') {
          actions.moveNode(source.data.nodeId as string, id, Number.MAX_SAFE_INTEGER);
        } else if (source.data.type === 'new-section') {
          const { componentName, displayName } = source.data as any;
          actions.addNode(id, componentName, displayName, {});
        }
      },
    });
  }, [enabled, id]);

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      ref={containerRef}
      {...props}
      onClick={(e) => {
        if (!enabled || e.target !== e.currentTarget) return;
        e.stopPropagation();
        actions.selectNode(id);
      }}
      className={clsx(
        'flex flex-col gap-6 w-full transition-all relative flex-1',
        centered && 'page mx-auto',
        centerChildren && 'items-center',
        padding === '8' ? 'py-8' : padding === '16' ? 'py-16' : padding === '32' ? 'py-32' : 'py-4',
        px === '1' ? 'px-1 md:px-4' : px === '4' ? 'px-4' : px === '8' ? 'px-8' : 'px-0',
        enabled && 'min-h-screen border border-dashed border-transparent hover:border-primary/20',
        enabled && selected && 'ring-1 ring-primary/30',
        enabled && containerDropActive && 'bg-accent-400/5',
        !enabled && 'min-h-0',
        props.className,
      )}
      style={{ ...props.style, height: height ? `${height}px` : 'auto', width: widthStyle, maxWidth }}
    >
      {children}
    </div>
  );
};
Container.craft = { isCanvas: true, displayName: 'Container', related: { settings: ContainerSettings } };

// ─────────────────────────────────────────────────────────────────────────────
// Grid
// ─────────────────────────────────────────────────────────────────────────────

const GridSettings = () => {
  const { id, actions, props } = useSettings();
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Centered Content</p>
        <Toggle
          id={`centered-grid-${id}`}
          checked={props.centered || false}
          onChange={(val) => actions.setProp((props: any) => (props.centered = val))}
        />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Gap</p>
        <Segment
          items={[
            { label: 'None', value: '0' },
            { label: 'Small', value: '4' },
            { label: 'Medium', value: '8' },
            { label: 'Large', value: '18' },
          ]}
          selected={props.gap || '18'}
          onSelect={(item) => actions.setProp((props: any) => (props.gap = item.value))}
          size="sm"
          className="w-full"
        />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Height (px)</p>
        <Input
          type="number"
          value={props.height || ''}
          onChange={(e) => actions.setProp((props: any) => (props.height = e.target.value))}
          placeholder="Auto"
        />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Width (px)</p>
          {props.width && (
            <button
              className="text-[10px] text-accent-400 hover:underline uppercase font-bold"
              onClick={() => actions.setProp((props: any) => (props.width = ''))}
            >
              Set Full
            </button>
          )}
        </div>
        <Input
          type="number"
          value={props.width || ''}
          onChange={(e) => actions.setProp((props: any) => (props.width = e.target.value))}
          placeholder="Leave empty for Full Screen"
        />
      </div>
    </div>
  );
};

export const Grid = ({ children, gap = '18', height, width, centered, ...props }: any) => {
  const id = useNodeId();
  const { enabled, actions } = usePageEditor();
  const { selected } = usePageNode();
  const isNumericWidth = width && !isNaN(Number(width));
  const widthStyle = isNumericWidth ? '100%' : typeof width === 'string' && width.includes('/') ? width : '100%';
  const maxWidth = isNumericWidth ? `${width}px` : undefined;

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      ref={undefined}
      onClick={(e) => {
        if (!enabled || e.target !== e.currentTarget) return;
        e.stopPropagation();
        actions.selectNode(id);
      }}
      className={clsx(
        'flex flex-col md:flex-row w-full min-h-[50px] transition-all relative group/grid rounded-lg',
        centered && 'page mx-auto',
        gap === '18' ? 'md:gap-18' : gap === '8' ? 'md:gap-8' : gap === '4' ? 'md:gap-4' : 'md:gap-0',
        enabled && selected && 'ring-2 ring-primary/50 ring-offset-2',
        enabled && 'border-2 border-transparent hover:border-primary/20',
        enabled && React.Children.count(children) === 0 && 'p-4 min-h-[100px]!',
        !enabled && 'min-h-0',
      )}
      style={{ ...props.style, height: height ? `${height}px` : 'auto', width: widthStyle, maxWidth }}
      {...props}
    >
      {enabled && selected && (
        <div className="absolute -top-4 right-0 z-100 flex gap-1 bg-overlay-primary border border-card-border p-1 rounded-md shadow-lg">
          <Button
            size="xs"
            variant="tertiary-alt"
            icon="icon-delete"
            onClick={(e) => {
              e.stopPropagation();
              actions.deleteNode(id);
            }}
            className="h-7 w-7 p-0 hover:text-error!"
          />
        </div>
      )}

      {children}
      {enabled && React.Children.count(children) === 0 && (
        <div className="flex-1 border-2 border-dashed border-primary/20 rounded-lg p-10 flex items-center justify-center text-tertiary/40">
          Empty Grid
        </div>
      )}
    </div>
  );
};
Grid.craft = { isCanvas: true, displayName: 'Grid', related: { settings: GridSettings } };

// ─────────────────────────────────────────────────────────────────────────────
// Col – drop target for sections
// ─────────────────────────────────────────────────────────────────────────────

export const Col = ({ children, width, width_mobile, height, ...props }: any) => {
  const id = useNodeId();
  const { enabled, actions } = usePageEditor();
  const { selected } = usePageNode();
  const { device } = useStoreManageLayout();
  const colRef = React.useRef<HTMLDivElement>(null);
  const isEmpty = React.Children.count(children) === 0;

  const currentWidth = device === 'mobile' ? width_mobile || width : width;

  const isNumericWidth = currentWidth && !isNaN(Number(currentWidth));
  const widthStyle = isNumericWidth
    ? '100%'
    : typeof currentWidth === 'string' && currentWidth.includes('/')
      ? currentWidth
      : 'auto';
  const maxWidth = isNumericWidth ? `${currentWidth}px` : undefined;

  // Empty-container drop target: when the col has no sections, accept drops directly
  React.useEffect(() => {
    if (!enabled || !isEmpty || !colRef.current) return;
    return dropTargetForElements({
      element: colRef.current,
      canDrop: ({ source }) => source.data.type === 'canvas-node' || source.data.type === 'new-section',
      onDrop: ({ source }) => {
        if (source.data.type === 'canvas-node') {
          actions.moveNode(source.data.nodeId as string, id, 0);
        } else if (source.data.type === 'new-section') {
          const { componentName, displayName } = source.data as any;
          actions.addNode(id, componentName, displayName, {}, 0);
        }
      },
    });
  }, [enabled, id, isEmpty]);

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      ref={colRef}
      onClick={(e) => {
        if (!enabled || e.target !== e.currentTarget) return;
        e.stopPropagation();
        actions.selectNode(id);
      }}
      className={clsx(
        'flex flex-col gap-6 min-h-[50px] transition-all relative group/col rounded-lg p-4',
        currentWidth === '300'
          ? 'md:w-74'
          : currentWidth === '1/2'
            ? 'md:w-1/2'
            : currentWidth === '1/3'
              ? 'md:w-1/3'
              : currentWidth === '2/3'
                ? 'md:w-2/3'
                : isNumericWidth
                  ? ''
                  : 'flex-1 w-full',
        enabled && selected && 'ring-2 ring-primary/30',
        enabled && 'border border-dashed border-transparent hover:border-primary/10',
        enabled && isEmpty && 'min-h-[100px]!',
        !enabled && 'min-h-0',
      )}
      style={{
        ...props.style,
        height: height ? `${height}px` : 'auto',
        width: widthStyle === 'auto' ? undefined : widthStyle,
        maxWidth,
      }}
      {...props}
    >
      {enabled && selected && (
        <div className="absolute -top-4 right-0 z-100 flex gap-1 bg-overlay-primary border border-card-border p-1 rounded-md shadow-lg">
          <Button
            size="xs"
            variant="tertiary-alt"
            icon="icon-delete"
            onClick={(e) => {
              e.stopPropagation();
              actions.deleteNode(id);
            }}
            className="h-7 w-7 p-0 hover:text-error!"
          />
        </div>
      )}
      {children}
      {enabled && isEmpty && (
        <div className="flex-1 border-2 border-dashed border-primary/10 rounded-lg min-h-[100px] flex items-center justify-center text-tertiary/30 text-xs">
          Drop sections here
        </div>
      )}
    </div>
  );
};
Col.craft = { isCanvas: true, displayName: 'Column', related: { settings: ColSettings } };

// ─────────────────────────────────────────────────────────────────────────────
// InlineGrid – horizontal auto-column grid, created by dropping section onto section
// ─────────────────────────────────────────────────────────────────────────────

const InlineGridSettings = () => {
  const { actions, props } = useSettings();
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Gap</p>
        <Segment
          items={[
            { label: 'None', value: '0' },
            { label: 'Small', value: '4' },
            { label: 'Medium', value: '8' },
            { label: 'Large', value: '16' },
          ]}
          selected={props.gap || '8'}
          onSelect={(item) => actions.setProp((props: any) => (props.gap = item.value))}
          size="sm"
          className="w-full"
        />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Align Items</p>
        <Segment
          items={[
            { label: 'Start', value: 'start' },
            { label: 'Center', value: 'center' },
            { label: 'End', value: 'end' },
            { label: 'Stretch', value: 'stretch' },
          ]}
          selected={props.align || 'start'}
          onSelect={(item) => actions.setProp((props: any) => (props.align = item.value))}
          size="sm"
          className="w-full"
        />
      </div>
      <p className="text-xs text-tertiary">
        Drag more sections onto any column to add columns. Drag a column out to remove it.
      </p>
    </div>
  );
};

export const CraftInlineGrid = ({ children, gap = '8', align = 'start' }: any) => {
  const id = useNodeId();
  const { enabled, actions } = usePageEditor();
  const { selected } = usePageNode();
  const divRef = React.useRef<HTMLDivElement>(null);
  const [dropActive, setDropActive] = React.useState(false);
  const count = React.Children.count(children);

  React.useEffect(() => {
    if (!enabled || !divRef.current) return;
    return dropTargetForElements({
      element: divRef.current,
      canDrop: ({ source }) => source.data.type === 'canvas-node' || source.data.type === 'new-section',
      onDragEnter: () => setDropActive(true),
      onDragLeave: () => setDropActive(false),
      onDrop: ({ source, location }) => {
        setDropActive(false);
        // Only handle drops that land directly on this InlineGrid (not on a child section)
        if (location.current.dropTargets[0]?.element !== divRef.current) return;
        if (source.data.type === 'canvas-node') {
          actions.moveNode(source.data.nodeId as string, id, Number.MAX_SAFE_INTEGER);
        } else if (source.data.type === 'new-section') {
          const { componentName, displayName } = source.data as any;
          actions.addNode(id, componentName, displayName, {});
        }
      },
    });
  }, [enabled, id]);

  const gapStyle = gap === '16' ? '16px' : gap === '8' ? '8px' : gap === '4' ? '4px' : '0px';

  return (
    <div
      ref={divRef}
      className={clsx(
        'w-full grid transition-all relative pt-5',
        enabled && 'min-h-[50px] rounded-lg',
        enabled && selected && 'ring-2 ring-accent-400/50 ring-offset-1',
        enabled && dropActive && 'bg-accent-400/5',
      )}
      style={{ gridAutoFlow: 'column', gridAutoColumns: '1fr', gap: gapStyle, alignItems: align }}
    >
      {/* Floating label — z-[200] to sit above CraftSection's z-40 interaction blocker */}
      {enabled && (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        <div
          className="absolute top-0 left-0 right-0 z-[200] flex items-center justify-between px-1"
          onClick={(e) => {
            e.stopPropagation();
            actions.selectNode(id);
          }}
        >
          <span
            className={clsx(
              'text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border cursor-pointer select-none transition-colors',
              selected
                ? 'bg-accent-500 text-white border-accent-500'
                : 'bg-overlay-primary text-tertiary border-card-border hover:border-accent-400 hover:text-accent-400',
            )}
          >
            Inline Grid · {count} col{count !== 1 ? 's' : ''}
          </span>
          {selected && (
            <Button
              size="xs"
              variant="tertiary-alt"
              icon="icon-delete"
              onClick={(e) => {
                e.stopPropagation();
                actions.deleteNode(id);
              }}
              className="h-6 w-6 p-0 hover:text-error!"
            />
          )}
        </div>
      )}
      {children}
      {enabled && count === 0 && (
        <div className="border-2 border-dashed border-accent-400/20 rounded-lg min-h-[80px] flex items-center justify-center text-tertiary/40 text-xs col-span-full">
          Drop sections here to add columns
        </div>
      )}
    </div>
  );
};
CraftInlineGrid.craft = { isCanvas: true, displayName: 'Inline Grid', related: { settings: InlineGridSettings } };

// ─────────────────────────────────────────────────────────────────────────────
// Wrapped section components
// ─────────────────────────────────────────────────────────────────────────────

export const CraftRichText = (props: any) => {
  const { enabled } = usePageEditor();
  if (!props.content && !enabled) return null;
  return (
    <CraftSection name="Rich Text">
      {props.content ? (
        <div dangerouslySetInnerHTML={{ __html: props.content }} className="event-description" />
      ) : (
        <Placeholder name="Rich Text" description="Click to edit content" />
      )}
    </CraftSection>
  );
};
CraftRichText.craft = { displayName: 'RichText', related: { settings: RichTextSettings } };

export const CraftVideoEmbed = (props: any) => {
  const { enabled } = usePageEditor();
  const embedUrl = getEmbedUrl(props.url);
  if (!embedUrl && !enabled) return null;
  return (
    <CraftSection name="Video Embed">
      {embedUrl ? (
        <div className="aspect-video w-full overflow-hidden rounded-lg">
          <iframe
            title="Embedded video"
            src={embedUrl}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <Placeholder name="Video Embed" description="Add a video link in settings" />
      )}
    </CraftSection>
  );
};
CraftVideoEmbed.craft = { displayName: 'VideoEmbed', related: { settings: VideoEmbedSettings } };

export const CraftAboutSection = (props: any) => {
  const event = useEvent(props);
  const { enabled } = usePageEditor();
  const hasContent = event?.description;
  if (!hasContent && !enabled) return null;
  return (
    <CraftSection name="About">
      {hasContent ? (
        <AboutSection {...props} event={event} />
      ) : (
        <Placeholder name="About" description="No description provided for this event." />
      )}
    </CraftSection>
  );
};
CraftAboutSection.craft = { displayName: 'About', related: { settings: AboutSettings } };

export const CraftLocationSection = (props: any) => {
  const event = useEvent(props);
  const { enabled } = usePageEditor();
  const hasContent = event?.address;
  if (!hasContent && !enabled) return null;
  return (
    <CraftSection name="Map">
      {hasContent ? (
        <LocationSection {...props} event={event} />
      ) : (
        <Placeholder name="Map" description="No address provided for this event." />
      )}
    </CraftSection>
  );
};
CraftLocationSection.craft = { displayName: 'Location', related: { settings: MapSettings } };

export const CraftEventAccess = (props: any) => {
  const event = useEvent(props);
  return (
    <CraftSection name="CTA Block">
      <EventAccess {...props} event={event} />
    </CraftSection>
  );
};
CraftEventAccess.craft = { displayName: 'CTA Block', related: { settings: RegistrationSettings } };

export const CraftEventCollectibles = (props: any) => {
  const event = useEvent(props);
  return (
    <CraftSection name="Collectibles">
      <EventCollectibles {...props} event={event} />
    </CraftSection>
  );
};
CraftEventCollectibles.craft = { displayName: 'EventCollectibles' };

const SubEventSettings = () => {
  const { actions, props } = useSettings();
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Section Title</p>
        <Input
          value={props.title || 'Schedule'}
          onChange={(e) => actions.setProp((props: any) => (props.title = e.target.value))}
          placeholder="Schedule"
        />
      </div>
    </div>
  );
};

export const CraftSubEventSection = (props: any) => {
  const event = useEvent(props);
  const { enabled } = usePageEditor();
  const hasContent = event?.subevent_enabled;
  if (!hasContent && !enabled) return null;
  return (
    <CraftSection name="Schedule">
      {hasContent ? (
        <SubEventSection {...props} event={event} />
      ) : (
        <Placeholder name="Schedule" description="Sub-events are not enabled for this event." />
      )}
    </CraftSection>
  );
};
CraftSubEventSection.craft = { displayName: 'Schedule', related: { settings: SubEventSettings } };

const GallerySettings = () => {
  const { actions, props } = useSettings();
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Section Title</p>
        <Input
          value={props.title || 'Gallery'}
          onChange={(e) => actions.setProp((props: any) => (props.title = e.target.value))}
          placeholder="Gallery"
        />
      </div>
    </div>
  );
};

export const CraftGallerySection = (props: any) => {
  const event = useEvent(props);
  const { enabled } = usePageEditor();
  const hasContent = (event?.new_new_photos_expanded?.length ?? 0) > 1;
  if (!hasContent && !enabled) return null;
  return (
    <CraftSection name="Gallery">
      {hasContent ? (
        <GallerySection {...props} event={event} />
      ) : (
        <Placeholder name="Gallery" description="No photos provided for this event gallery." />
      )}
    </CraftSection>
  );
};
CraftGallerySection.craft = { displayName: 'Gallery', related: { settings: GallerySettings } };

export const CraftEventDateTimeBlock = (props: any) => {
  const event = useEvent(props);
  return (
    <CraftSection name="Date Time">
      <EventDateTimeBlock {...props} event={event} />
    </CraftSection>
  );
};
CraftEventDateTimeBlock.craft = { displayName: 'Date Time Block', related: { settings: DateTimeSettings } };

export const CraftEventLocationBlock = (props: any) => {
  const event = useEvent(props);
  const { enabled } = usePageEditor();
  const hasContent = event?.address || event?.virtual_url;
  if (!hasContent && !enabled) return null;
  return (
    <CraftSection name="Location">
      {hasContent ? (
        <EventLocationBlock {...props} event={event} />
      ) : (
        <Placeholder name="Location" description="No location or virtual URL provided." />
      )}
    </CraftSection>
  );
};
CraftEventLocationBlock.craft = { displayName: 'Location Info', related: { settings: LocationSettings } };

export const CraftCommunitySection = (props: any) => {
  const event = useEvent(props);
  const { enabled } = usePageEditor();
  const hasContent = event?.space;
  if (!hasContent && !enabled) return null;
  return (
    <CraftSection name="Community">
      {hasContent ? (
        <CommunitySection {...props} event={event} />
      ) : (
        <Placeholder name="Community" description="No community associated with this event." />
      )}
    </CraftSection>
  );
};
CraftCommunitySection.craft = { displayName: 'Community' };

export const CraftHostedBySection = (props: any) => {
  const event = useEvent(props);
  const { enabled } = usePageEditor();
  const hasContent = getEventCohosts(event).length > 0;
  if (!hasContent && !enabled) return null;
  return (
    <CraftSection name="HostedBy">
      {hasContent ? (
        <HostedBySection {...props} event={event} />
      ) : (
        <Placeholder name="Hosted By" description="No hosts information available." />
      )}
    </CraftSection>
  );
};
CraftHostedBySection.craft = { displayName: 'Hosted By' };

export const CraftAttendeesSection = (props: any) => {
  const event = useEvent(props);
  return (
    <CraftSection name="Attendees">
      <AttendeesSection {...props} event={event} />
    </CraftSection>
  );
};
CraftAttendeesSection.craft = { displayName: 'Attendees' };

export const CraftEventHero = (props: any) => {
  const event = useEvent(props);
  const align = props.align || 'text-left';
  const flexAlign = align === 'text-center' ? 'items-center' : align === 'text-right' ? 'items-end' : 'items-start';
  return (
    <CraftSection name="Event Hero">
      <div className={clsx('space-y-4 flex flex-col', flexAlign, align)}>
        <div className="space-y-2 w-full">
          <h3 className="text-xl md:text-3xl font-bold">{event?.title || 'Untitled Event'}</h3>
        </div>
      </div>
    </CraftSection>
  );
};
CraftEventHero.craft = { displayName: 'Event Hero', related: { settings: HeroSettings } };

export const CraftEventSidebarImage = (props: any) => {
  const event = useEvent(props);
  const aspectRatio = props.aspectRatio || 'aspect-square';
  const objectFit = props.objectFit || 'object-cover';
  return (
    <CraftSection name="Event Image" noPadding {...props} aspectRatio={aspectRatio} objectFit={objectFit}>
      <div
        className={clsx(
          'w-full h-full overflow-hidden rounded-2xl',
          aspectRatio === 'aspect-auto' || !aspectRatio ? '' : 'absolute inset-0',
        )}
      >
        {event?.new_new_photos_expanded?.[0] ? (
          <img
            src={generateUrl(event.new_new_photos_expanded[0], EDIT_KEY.EVENT_PHOTO)}
            alt={event.title}
            loading="lazy"
            className={clsx('w-full h-full border-none', objectFit)}
          />
        ) : (
          <img className={clsx('w-full h-full border-none', objectFit)} src={randomEventDP()} alt="Event cover" />
        )}
      </div>
    </CraftSection>
  );
};
CraftEventSidebarImage.craft = { displayName: 'Event Image', related: { settings: SidebarImageSettings } };

const BannerSettings = () => {
  const { actions, props } = useSettings();
  const [uploading, setUploading] = React.useState(false);

  const handleUpload = async (files: File[]) => {
    if (!files.length) return;
    try {
      setUploading(true);
      const res = (await uploadFiles([files[0]], 'event')) as BackendFile[];
      if (res.length > 0) {
        const url = generateUrl(res[0], EDIT_KEY.EVENT_PHOTO);
        actions.setProp((props: any) => (props.url = url));
        toast.success('Image uploaded successfully!');
      }
    } catch (_e) {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Banner Image</p>
        <FileInput onChange={handleUpload} multiple={false}>
          {(open) => (
            <button
              type="button"
              onClick={open}
              className="aspect-video w-full border-2 border-dashed border-card-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-card-hover transition-colors relative overflow-hidden"
            >
              {props.url ? (
                <img src={props.url} className="absolute inset-0 w-full h-full object-cover opacity-40" />
              ) : null}
              <div className="z-10 flex flex-col items-center gap-2">
                <i
                  className={clsx(uploading ? 'icon-loader animate-spin' : 'icon-upload-sharp', 'size-8 text-tertiary')}
                />
                <p className="text-xs text-tertiary">{uploading ? 'Uploading...' : 'Click to upload'}</p>
              </div>
            </button>
          )}
        </FileInput>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Image URL</p>
        <Input
          value={props.url || ''}
          onChange={(e) => actions.setProp((props: any) => (props.url = e.target.value))}
          placeholder="https://example.com/image.jpg"
        />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Height (px)</p>
        <Input
          type="number"
          value={props.height || ''}
          onChange={(e) => actions.setProp((props: any) => (props.height = e.target.value))}
          placeholder="Auto"
        />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Aspect Ratio</p>
        <Segment
          items={[
            { label: 'Auto', value: 'aspect-auto' },
            { label: 'Square', value: 'aspect-square' },
            { label: 'Video', value: 'aspect-video' },
          ]}
          selected={props.aspectRatio || 'aspect-auto'}
          onSelect={(item) => actions.setProp((props: any) => (props.aspectRatio = item.value))}
          size="sm"
          className="w-full"
        />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Object Fit</p>
        <Segment
          items={[
            { label: 'Cover', value: 'object-cover' },
            { label: 'Contain', value: 'object-contain' },
          ]}
          selected={props.objectFit || 'object-cover'}
          onSelect={(item) => actions.setProp((props: any) => (props.objectFit = item.value))}
          size="sm"
          className="w-full"
        />
      </div>
    </div>
  );
};

export const CraftImageBanner = (props: any) => {
  const { enabled } = usePageEditor();
  const { url, height, aspectRatio = 'aspect-auto', objectFit = 'object-cover' } = props;
  if (!url && !enabled) return null;
  return (
    <CraftSection name="Image Banner" noPadding>
      <div
        className={clsx(
          'w-full overflow-hidden rounded-2xl',
          aspectRatio !== 'aspect-auto' && aspectRatio,
          !url && 'bg-card/20 border border-dashed border-card-border',
        )}
        style={{ height: height ? `${height}px` : undefined, minHeight: !url ? '200px' : undefined }}
      >
        {url ? (
          <img src={url} alt="Banner" className={clsx('w-full h-full', objectFit)} />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Placeholder name="Image Banner" description="Add an image in settings" />
          </div>
        )}
      </div>
    </CraftSection>
  );
};
CraftImageBanner.craft = { displayName: 'Image Banner', related: { settings: BannerSettings } };

const SocialLinksSettings = () => {
  const { actions, props } = useSettings();
  const links = props.links || [];

  const addLink = () =>
    actions.setProp((props: any) => {
      if (!props.links) props.links = [];
      props.links.push('');
    });
  const updateLink = (index: number, value: string) =>
    actions.setProp((props: any) => {
      props.links[index] = value;
    });
  const removeLink = (index: number) =>
    actions.setProp((props: any) => {
      props.links.splice(index, 1);
    });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <p className="text-sm font-medium">Links</p>
        {links.map((link: string, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              value={link}
              onChange={(e) => updateLink(index, e.target.value)}
              placeholder="https://twitter.com/..."
              className="flex-1"
            />
            <Button
              size="xs"
              variant="tertiary"
              icon="icon-delete"
              onClick={() => removeLink(index)}
              className="shrink-0"
            />
          </div>
        ))}
        <Button size="sm" variant="tertiary" icon="icon-plus" onClick={addLink} className="w-full border-dashed">
          Add Link
        </Button>
      </div>
    </div>
  );
};

export const CraftSocialLinks = (props: any) => {
  const { enabled } = usePageEditor();
  const links = props.links || [];
  if (links.length === 0 && !enabled) return null;
  return (
    <CraftSection name="Social Links">
      <div className="flex flex-wrap gap-4 items-center">
        {links.length > 0 ? (
          links.map((link: string, index: number) => (
            <a
              key={index}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-card hover:bg-card-hover border border-card-border rounded-full transition-colors"
            >
              <i className="icon-link size-5 text-secondary" />
            </a>
          ))
        ) : (
          <Placeholder name="Social Links" description="Add links in settings" />
        )}
      </div>
    </CraftSection>
  );
};
CraftSocialLinks.craft = { displayName: 'Social Links', related: { settings: SocialLinksSettings } };

const CustomHTMLSettings = () => {
  const { actions, props } = useSettings();
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">HTML Content</p>
        <Textarea
          value={props.html || ''}
          onChange={(e) => actions.setProp((props: any) => (props.html = e.target.value))}
          placeholder="<div>Add your HTML code here...</div>"
          rows={10}
          className="font-mono text-xs"
        />
      </div>
    </div>
  );
};

export const CraftCustomHTML = (props: any) => {
  const { enabled } = usePageEditor();
  const { html } = props;
  if (!html && !enabled) return null;
  return (
    <CraftSection name="Custom HTML">
      {html ? (
        <div dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <Placeholder name="Custom HTML" description="Add your HTML code in settings" />
      )}
    </CraftSection>
  );
};
CraftCustomHTML.craft = { displayName: 'Custom HTML', related: { settings: CustomHTMLSettings } };

const SpacerSettings = () => {
  const { actions, props } = useSettings();
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Height (px)</p>
        <Input
          type="number"
          value={props.height || '40'}
          onChange={(e) => actions.setProp((props: any) => (props.height = e.target.value))}
          placeholder="40"
        />
      </div>
    </div>
  );
};

export const CraftSpacer = ({ height = '40' }: any) => {
  const { enabled } = usePageEditor();
  if (!enabled) return <div style={{ height: `${height}px` }} className="w-full" />;
  return (
    <div
      style={{ height: `${height}px` }}
      className="w-full flex items-center justify-center border border-dashed border-card-border rounded-md text-[10px] text-quaternary uppercase tracking-widest bg-card/20"
    >
      Spacer
    </div>
  );
};
CraftSpacer.craft = { displayName: 'Spacer', related: { settings: SpacerSettings } };

export const CraftHeader = (_props: any) => {
  const { enabled } = usePageEditor();
  if (!enabled) return null;
  return (
    <CraftSection name="Header">
      <Placeholder name="Header" description="Page header" />
    </CraftSection>
  );
};
CraftHeader.craft = { displayName: 'Header' };

export const CraftFooter = (_props: any) => {
  const { enabled } = usePageEditor();
  if (!enabled) return null;
  return (
    <CraftSection name="Footer">
      <Placeholder name="Footer" description="Page footer" />
    </CraftSection>
  );
};
CraftFooter.craft = { displayName: 'Footer' };

export const CraftMusicPlayer = (_props: any) => {
  const { enabled } = usePageEditor();
  if (!enabled) return null;
  return (
    <CraftSection name="Music Player">
      <Placeholder name="Music Player" description="Share your music" />
    </CraftSection>
  );
};
CraftMusicPlayer.craft = { displayName: 'Music Player' };

export const CraftWalletConnect = (_props: any) => {
  const { enabled } = usePageEditor();
  if (!enabled) return null;
  return (
    <CraftSection name="Wallet Connect">
      <Placeholder name="Wallet Connect" description="Web3 connectivity" />
    </CraftSection>
  );
};
CraftWalletConnect.craft = { displayName: 'Wallet Connect' };

export const CraftPassport = (_props: any) => {
  const { enabled } = usePageEditor();
  if (!enabled) return null;
  return (
    <CraftSection name="Passport">
      <Placeholder name="Passport" description="Digital identity" />
    </CraftSection>
  );
};
CraftPassport.craft = { displayName: 'Passport' };

export const CraftEventSpeakers = (_props: any) => {
  const { enabled } = usePageEditor();
  if (!enabled) return null;
  return (
    <CraftSection name="Speakers">
      <Placeholder name="Speakers" description="Event speakers section" />
    </CraftSection>
  );
};
CraftEventSpeakers.craft = { displayName: 'EventSpeakers' };

export const CraftEventSponsors = (_props: any) => {
  const { enabled } = usePageEditor();
  if (!enabled) return null;
  return (
    <CraftSection name="Sponsors">
      <Placeholder name="Sponsors" description="Event sponsors section" />
    </CraftSection>
  );
};
CraftEventSponsors.craft = { displayName: 'EventSponsors' };

// ─────────────────────────────────────────────────────────────────────────────
// Resolver – maps resolvedName → component (same format as before)
// ─────────────────────────────────────────────────────────────────────────────

export const resolver: Record<string, React.ComponentType<any>> = {
  Container,
  Grid,
  Col,
  InlineGrid: CraftInlineGrid,
  Tabs: CraftTabs,
  Tab: CraftTab,
  Accordion: CraftAccordion,
  AccordionItem: CraftAccordionItem,
  RichText: CraftRichText,
  VideoEmbed: CraftVideoEmbed,
  AboutSection: CraftAboutSection,
  LocationSection: CraftLocationSection,
  EventAccess: CraftEventAccess,
  EventCollectibles: CraftEventCollectibles,
  SubEventSection: CraftSubEventSection,
  GallerySection: CraftGallerySection,
  EventDateTimeBlock: CraftEventDateTimeBlock,
  EventLocationBlock: CraftEventLocationBlock,
  CommunitySection: CraftCommunitySection,
  HostedBySection: CraftHostedBySection,
  AttendeesSection: CraftAttendeesSection,
  EventHero: CraftEventHero,
  EventSidebarImage: CraftEventSidebarImage,
  ImageBanner: CraftImageBanner,
  SocialLinks: CraftSocialLinks,
  CustomHTML: CraftCustomHTML,
  Spacer: CraftSpacer,
  Header: CraftHeader,
  Footer: CraftFooter,
  MusicPlayer: CraftMusicPlayer,
  WalletConnect: CraftWalletConnect,
  Passport: CraftPassport,
  EventSpeakers: CraftEventSpeakers,
  EventSponsors: CraftEventSponsors,
};
