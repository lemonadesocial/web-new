import React from 'react';
import { useNode, useEditor, Element } from '@craftjs/core';
import clsx from 'clsx';
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
import { Button, Input, Textarea, Toggle, Divider, Segment, Card, TextEditor, PlaceAutoComplete, FileInput, Accordion } from '$lib/components/core';
import { getEventCohosts } from '$lib/utils/event';
import { randomEventDP } from '$lib/utils/user';
import { useSettings } from '../SettingsPanel';
import { generateUrl, EDIT_KEY } from '$lib/utils/cnd';
import { DateTimeGroup, Timezone } from '$lib/components/core/calendar';
import { useStoreManageLayout, storeManageLayout, aiManageLayoutStore, storeAtom } from '../store';
import { Event } from '$lib/graphql/generated/backend/graphql';
import { uploadFiles } from '$lib/utils/file';
import { toast } from '$lib/components/core/toast';
import { motion } from 'framer-motion';

const useEvent = (props: any) => {
  const layoutState = useStoreManageLayout();
  return (layoutState.data as Event) || props.event;
};

const getEmbedUrl = (url: string) => {
  if (!url) return null;
  // YouTube
  let match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  if (match) return `https://www.youtube.com/embed/${match[1]}`;
  
  // Vimeo
  match = url.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)([0-9]+)/);
  if (match) return `https://player.vimeo.com/video/${match[1]}`;
  
  return null;
};

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
    } catch (e) {
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
            <div 
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
                <i className={clsx(uploading ? "icon-loader animate-spin" : "icon-upload-sharp", "size-8 text-tertiary")} />
                <p className="text-xs text-tertiary">{uploading ? 'Uploading...' : 'Click to upload'}</p>
              </div>
            </div>
          )}
        </FileInput>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Height (px)</p>
        <Input 
          type="number"
          value={props.height || ''} 
          onChange={(e) => actions.setProp((props: any) => props.height = e.target.value)}
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
          onSelect={(item) => actions.setProp((props: any) => props.aspectRatio = item.value)}
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
          onSelect={(item) => actions.setProp((props: any) => props.objectFit = item.value)}
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
          onChange={(e) => actions.setProp((props: any) => props.height = e.target.value)}
          placeholder="Auto"
        />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Width (px)</p>
          {props.width && (
            <button 
              className="text-[10px] text-accent-400 hover:underline uppercase font-bold"
              onClick={() => actions.setProp((props: any) => props.width = '')}
            >
              Set Full
            </button>
          )}
        </div>
        <Input 
          type="number"
          value={props.width || ''} 
          onChange={(e) => actions.setProp((props: any) => props.width = e.target.value)}
          placeholder="Leave empty for Full Screen"
        />
      </div>      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Alignment</p>
        <Segment
          items={[
            { label: 'Left', value: 'text-left' },
            { label: 'Center', value: 'text-center' },
            { label: 'Right', value: 'text-right' },
          ]}
          selected={props.align || 'text-left'}
          onSelect={(item) => actions.setProp((props: any) => props.align = item.value)}
          size="sm"
          className="w-full"
        />
      </div>
    </div>
  );
};


const AboutSettings = () => {
  const { props } = useSettings();
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
          onChange={(value) => actions.setProp((props: any) => {
            props.content = value;
          })}
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
          onChange={(e) => actions.setProp((props: any) => {
            props.url = e.target.value;
          })}
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
          onChange={(e) => actions.setProp((props: any) => props.registration_heading = e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Description</p>
        <Textarea
          value={props.registration_description || 'Ready to join us? Pick your ticket, grab your spot, and get ready for a weekend of music, art, and culture.'}
          onChange={(e) => actions.setProp((props: any) => props.registration_description = e.target.value)}
          rows={3}
        />
      </div>
    </div>
  );
};

const ColSettings = () => {
  const { actions, props } = useSettings();
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Width (Desktop)</p>
        <Segment
          items={[
            { label: 'Auto', value: '' },
            { label: 'Sidebar (300px)', value: '74' },
            { label: '1/2', value: '1/2' },
            { label: '1/3', value: '1/3' },
            { label: '2/3', value: '2/3' },
          ]}
          selected={props.width || ''}
          onSelect={(item) => actions.setProp((props: any) => props.width = item.value)}
          size="sm"
          className="w-full"
        />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Height (px)</p>
        <Input 
          type="number"
          value={props.height || ''} 
          onChange={(e) => actions.setProp((props: any) => props.height = e.target.value)}
          placeholder="Auto"
        />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Width (px)</p>
          {props.width && (
            <button 
              className="text-[10px] text-accent-400 hover:underline uppercase font-bold"
              onClick={() => actions.setProp((props: any) => props.width = '')}
            >
              Set Full
            </button>
          )}
        </div>
        <Input 
          type="number"
          value={props.width || ''} 
          onChange={(e) => actions.setProp((props: any) => props.width = e.target.value)}
          placeholder="Leave empty for Full Screen"
        />
      </div>    </div>
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
          timezone={event?.timezone}
          onSelect={(dateRange) => storeManageLayout.setData({
            ...event,
            start: dateRange.start,
            end: dateRange.end,
          })}
        />
        <Timezone
          placement="bottom-end"
          onSelect={(timezoneOption) => storeManageLayout.setData({
            ...event,
            timezone: timezoneOption.value,
          })}
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
          onSelect={(addressData) => storeManageLayout.setData({
            ...event,
            address: addressData,
            latitude: addressData?.latitude,
            longitude: addressData?.longitude,
          })}
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
          onSelect={(addressData) => storeManageLayout.setData({
            ...event,
            address: addressData,
            latitude: addressData?.latitude,
            longitude: addressData?.longitude,
          })}
        />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Join URL</p>
        <Input 
          value={event?.virtual_url || ''} 
          onChange={(e) => storeManageLayout.setData({
            ...event,
            virtual_url: e.target.value,
          })}
          placeholder="https://example.com/join"
        />
      </div>
    </div>
  );
};

const Placeholder = ({ name, description }: { name: string; description?: string }) => {
  const { enabled } = useEditor((state) => ({ enabled: state.options.enabled }));
  
  if (!enabled) return null;

  return (
    <div className="w-full p-6 bg-accent-400/5 border border-dashed border-accent-400/20 rounded-md text-center">
      <p className="text-accent-500 font-medium">{name} Section</p>
      <p className="text-tertiary text-xs">{description || `No data provided for this ${name.toLowerCase()} section.`}</p>
    </div>
  );
};

export const CraftTabs = ({ children, activeIndex = 0 }: any) => {
  const [selectedTab, setSelectedTab] = React.useState(activeIndex);
  const { id, connectors: { connect }, selected } = useNode((node) => ({
    selected: node.events.selected,
  }));
  const { enabled, actions, query } = useEditor((state) => ({ enabled: state.options.enabled }));

  const tabs = React.Children.toArray(children);

  return (
    <div 
      ref={(ref: any) => connect(ref)} 
      onClick={(e) => {
        if (!enabled || e.target !== e.currentTarget) return;
        e.stopPropagation();
        actions.selectNode(id);
      }}
      className={clsx("w-full flex flex-col gap-4 p-4 rounded-lg", enabled && "border border-dashed border-transparent hover:border-primary/20", enabled && selected && "border-primary/50 bg-primary/5")}
    >
      <div className="flex items-center border-b border-card-border overflow-x-auto no-scrollbar">
        {tabs.map((tab: any, index) => (
          <button
            key={index}
            onClick={() => setSelectedTab(index)}
            className={clsx(
              "px-6 py-3 text-sm font-medium transition-all border-b-2 shrink-0",
              selectedTab === index ? "border-primary text-primary" : "border-transparent text-tertiary hover:text-secondary"
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
               const nodeTree = query.parseReactElement(<Element is={CraftTab} label={`Tab ${tabs.length + 1}`} canvas />).toNodeTree();
               actions.addNodeTree(nodeTree, id);
             }}
           />
        )}
      </div>
      <div className="flex-1">
        {tabs.length > 0 ? tabs[selectedTab] : (
          <div className="p-10 border-2 border-dashed border-primary/10 rounded-lg flex items-center justify-center text-tertiary/30 text-xs">
            Add a tab to get started
          </div>
        )}
      </div>
    </div>
  );
};
CraftTabs.craft = {
  isCanvas: true,
  displayName: 'Tabs',
  rules: {
    canMoveIn: (incomingNodes: any) => incomingNodes.every((node: any) => node.data.displayName === 'Tab'),
  }
};

const TabSettings = () => {
  const { actions, props } = useSettings();
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Tab Label</p>
        <Input 
          value={props.label || ''} 
          onChange={(e) => actions.setProp((props: any) => props.label = e.target.value)}
          placeholder="Enter tab name..."
        />
      </div>
    </div>
  );
};
export const CraftTab = ({ children, label }: any) => {
  const { id, connectors: { connect }, selected } = useNode((node) => ({
    selected: node.events.selected,
  }));
  const { enabled, actions } = useEditor((state) => ({ enabled: state.options.enabled }));

  return (
    <div 
      ref={(ref: any) => connect(ref)} 
      className={clsx(
        "w-full min-h-[100px] relative transition-all",
        enabled && "border border-dashed border-transparent hover:border-primary/10",
        enabled && selected && "border-primary/30"
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
              actions.delete(id);
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
CraftTab.craft = {
  isCanvas: true,
  displayName: 'Tab',
  related: {
    settings: TabSettings
  }
};

export const CraftAccordion = ({ children }: any) => {
  const { id, connectors: { connect }, selected } = useNode((node) => ({
    selected: node.events.selected,
  }));
  const { enabled, actions, query } = useEditor((state) => ({ enabled: state.options.enabled }));

  return (
    <div 
      ref={(ref: any) => connect(ref)} 
      onClick={(e) => {
        if (!enabled || e.target !== e.currentTarget) return;
        e.stopPropagation();
        actions.selectNode(id);
      }}
      className={clsx("w-full flex flex-col gap-2 p-4 rounded-lg", enabled && "border border-dashed border-transparent hover:border-primary/20", enabled && selected && "border-primary/50 bg-primary/5")}
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
            const nodeTree = query.parseReactElement(<Element is={CraftAccordionItem} title={`Accordion Item ${React.Children.count(children) + 1}`} canvas />).toNodeTree();
            actions.addNodeTree(nodeTree, id);
          }}
        >
          Add Item
        </Button>
      )}
    </div>
  );
};
CraftAccordion.craft = {
  isCanvas: true,
  displayName: 'Accordion',
  rules: {
    canMoveIn: (incomingNodes: any) => incomingNodes.every((node: any) => node.data.displayName === 'Accordion Item'),
  }
};

const AccordionItemSettings = () => {
  const { actions, props } = useSettings();
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Item Title</p>
        <Input 
          value={props.title || ''} 
          onChange={(e) => actions.setProp((props: any) => props.title = e.target.value)}
          placeholder="Enter item title..."
        />
      </div>
    </div>
  );
};
export const CraftAccordionItem = ({ children, title }: any) => {
  const { id, connectors: { connect }, selected } = useNode((node) => ({
    selected: node.events.selected,
  }));
  const { enabled, actions } = useEditor((state) => ({ enabled: state.options.enabled }));

  return (
    <div 
      ref={(ref: any) => connect(ref)} 
      className={clsx(
        "w-full relative transition-all",
        enabled && "border-2 border-dashed border-transparent hover:border-primary/20",
        enabled && selected && "border-primary/30 bg-primary/5"
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
                  actions.delete(id);
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
  related: {
    settings: AccordionItemSettings
  }
};

export const CraftSection = ({ children, name, noPadding }: { children: React.ReactNode; name?: string; noPadding?: boolean; [key: string]: any }) => {
  const {
    id,
    connectors: { connect, drag },
    selected,
    hovered,
    nodeProps,
    actions: { setProp },
  } = useNode((node) => ({
    selected: node.events.selected,
    hovered: node.events.hovered,
    nodeProps: node.data.props,
  }));

  const { actions, query, enabled } = useEditor((state) => ({
    enabled: state.options.enabled
  }));
  const [isResizing, setIsResizing] = React.useState(false);

  const getPosition = () => {
    const node = query.node(id).get();
    const parentId = node.data.parent;
    if (!parentId) return { parentId: null, index: -1, total: 0 };
    
    const siblings = query.node(parentId).get().data.nodes;
    return {
      parentId,
      index: siblings.indexOf(id),
      total: siblings.length
    };
  };

  const { index, total, parentId } = getPosition();
  const isFirst = index === 0;
  const isLast = index === total - 1;

  const moveUp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!parentId || isFirst) return;
    actions.move(id, parentId, index - 1);
  };

  const moveDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!parentId || isLast) return;
    actions.move(id, parentId, index + 2);
  };

  const remove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    actions.delete(id);
  };

  const width = nodeProps.width;
  const height = nodeProps.height;
  const widthStyle = typeof width === 'string' && width.includes('/') ? width : (width ? `${width}px` : '100%');

  // If not enabled and no children, don't render anything
  if (!enabled && !children) return null;

  return (
    <div
      ref={(ref: any) => ref && connect(isResizing || !enabled ? ref : drag(ref))}
      onClick={(e) => {
        if (!enabled) return;
        e.stopPropagation();
        actions.selectNode(id);
      }}
      className={clsx(
        "relative group/section w-full flex flex-col overflow-visible rounded-2xl transition-all",
        enabled && "cursor-pointer hover:bg-primary/5",
        isResizing && "z-[300]"
      )}
      style={{ 
        height: height ? `${height}px` : 'auto',
        width: widthStyle,
        maxWidth: '100%'
      }}
    >
      {/* Selection Border */}
      {enabled && selected && (
        <div className="absolute inset-0 z-50 pointer-events-none border-2 border-primary rounded-2xl shadow-[0_0_0_1px_rgba(255,255,255,0.2)]" />
      )}

      {/* Interaction Blocker - Permanently prevents clicks on links/buttons inside sections while in editor */}
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

          {/* Top Resize Handle */}
          <div
            onMouseDown={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setIsResizing(true);
              const startY = e.pageY;
              const rect = (e.currentTarget.parentElement as HTMLElement).getBoundingClientRect();
              const startHeight = rect.height;

              const onMouseMove = (moveEvent: MouseEvent) => {
                const deltaY = startY - moveEvent.pageY;
                setProp((props: any) => {
                  props.height = Math.max(50, Math.round(startHeight + deltaY));
                });
              };

              const onMouseUp = () => {
                setIsResizing(false);
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
              };

              document.addEventListener('mousemove', onMouseMove);
              document.addEventListener('mouseup', onMouseUp);
            }}
            className="absolute top-0 left-0 right-0 h-2 z-110 cursor-ns-resize flex items-center justify-center group/handle-t bg-transparent"
          >
            <div className="w-12 h-1 bg-primary rounded-full opacity-0 group-hover/handle-t:opacity-100 transition-opacity shadow-sm" />
          </div>

          {/* Left Resize Handle */}
          <div
            onMouseDown={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setIsResizing(true);
              const startX = e.pageX;
              const rect = (e.currentTarget.parentElement as HTMLElement).getBoundingClientRect();
              const startWidth = rect.width;

              const onMouseMove = (moveEvent: MouseEvent) => {
                const deltaX = startX - moveEvent.pageX;
                setProp((props: any) => {
                  props.width = Math.max(100, Math.round(startWidth + deltaX));
                });
              };

              const onMouseUp = () => {
                setIsResizing(false);
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
              };

              document.addEventListener('mousemove', onMouseMove);
              document.addEventListener('mouseup', onMouseUp);
            }}
            className="absolute left-0 top-0 bottom-0 w-2 z-110 cursor-ew-resize flex items-center justify-center group/handle-l bg-transparent"
          >
             <div className="h-12 w-1 bg-primary rounded-full opacity-0 group-hover/handle-l:opacity-100 transition-opacity shadow-sm" />
          </div>

          {/* Width Resize Handle (Right) */}
          <div
            onMouseDown={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setIsResizing(true);
              const startX = e.pageX;
              const rect = (e.currentTarget.parentElement as HTMLElement).getBoundingClientRect();
              const startWidth = rect.width;

              const onMouseMove = (moveEvent: MouseEvent) => {
                const deltaX = moveEvent.pageX - startX;
                setProp((props: any) => {
                  props.width = Math.max(100, Math.round(startWidth + deltaX));
                });
              };

              const onMouseUp = () => {
                setIsResizing(false);
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
              };

              document.addEventListener('mousemove', onMouseMove);
              document.addEventListener('mouseup', onMouseUp);
            }}
            className="absolute right-0 top-0 bottom-0 w-2 z-110 cursor-ew-resize flex items-center justify-center group/handle-w bg-transparent"
          >
             <div className="h-12 w-1 bg-primary rounded-full opacity-0 group-hover/handle-w:opacity-100 transition-opacity shadow-sm" />
          </div>

          {/* Height Resize Handle (Bottom) */}
          <div
            onMouseDown={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setIsResizing(true);
              const startY = e.pageY;
              const rect = (e.currentTarget.parentElement as HTMLElement).getBoundingClientRect();
              const startHeight = rect.height;

              const onMouseMove = (moveEvent: MouseEvent) => {
                const deltaY = moveEvent.pageY - startY;
                setProp((props: any) => {
                  props.height = Math.max(50, Math.round(startHeight + deltaY));
                });
              };

              const onMouseUp = () => {
                setIsResizing(false);
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
              };

              document.addEventListener('mousemove', onMouseMove);
              document.addEventListener('mouseup', onMouseUp);
            }}
            className="absolute bottom-0 left-0 right-0 h-2 z-110 cursor-ns-resize flex items-center justify-center group/handle-h bg-transparent"
          >
            <div className="w-12 h-1 bg-primary rounded-full opacity-0 group-hover/handle-h:opacity-100 transition-opacity shadow-sm" />
          </div>

          {/* Corner Resize Handle (Bottom-Right) */}
          <div
            onMouseDown={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setIsResizing(true);
              const startX = e.pageX;
              const startY = e.pageY;
              const rect = (e.currentTarget.parentElement as HTMLElement).getBoundingClientRect();
              const startWidth = rect.width;
              const startHeight = rect.height;

              const onMouseMove = (moveEvent: MouseEvent) => {
                const deltaX = moveEvent.pageX - startX;
                const deltaY = moveEvent.pageY - startY;
                setProp((props: any) => {
                  props.width = Math.max(100, Math.round(startWidth + deltaX));
                  props.height = Math.max(50, Math.round(startHeight + deltaY));
                });
              };

              const onMouseUp = () => {
                setIsResizing(false);
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
              };

              document.addEventListener('mousemove', onMouseMove);
              document.addEventListener('mouseup', onMouseUp);
            }}
            className="absolute bottom-0 right-0 w-4 h-4 z-120 cursor-nwse-resize bg-transparent hover:bg-primary/10 transition-colors rounded-br-xl border-r-2 border-b-2 border-primary/40"
          />

          {/* Corner Resize Handle (Top-Left) */}
          <div
            onMouseDown={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setIsResizing(true);
              const startX = e.pageX;
              const startY = e.pageY;
              const rect = (e.currentTarget.parentElement as HTMLElement).getBoundingClientRect();
              const startWidth = rect.width;
              const startHeight = rect.height;

              const onMouseMove = (moveEvent: MouseEvent) => {
                const deltaX = startX - moveEvent.pageX;
                const deltaY = startY - moveEvent.pageY;
                setProp((props: any) => {
                  props.width = Math.max(100, Math.round(startWidth + deltaX));
                  props.height = Math.max(50, Math.round(startHeight + deltaY));
                });
              };

              const onMouseUp = () => {
                setIsResizing(false);
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
              };

              document.addEventListener('mousemove', onMouseMove);
              document.addEventListener('mouseup', onMouseUp);
            }}
            className="absolute top-0 left-0 w-4 h-4 z-120 cursor-nwse-resize bg-transparent hover:bg-primary/10 transition-colors rounded-tl-xl border-l-2 border-t-2 border-primary/40"
          />

          {/* Corner Resize Handle (Top-Right) */}
          <div
            onMouseDown={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setIsResizing(true);
              const startX = e.pageX;
              const startY = e.pageY;
              const rect = (e.currentTarget.parentElement as HTMLElement).getBoundingClientRect();
              const startWidth = rect.width;
              const startHeight = rect.height;

              const onMouseMove = (moveEvent: MouseEvent) => {
                const deltaX = moveEvent.pageX - startX;
                const deltaY = startY - moveEvent.pageY;
                setProp((props: any) => {
                  props.width = Math.max(100, Math.round(startWidth + deltaX));
                  props.height = Math.max(50, Math.round(startHeight + deltaY));
                });
              };

              const onMouseUp = () => {
                setIsResizing(false);
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
              };

              document.addEventListener('mousemove', onMouseMove);
              document.addEventListener('mouseup', onMouseUp);
            }}
            className="absolute top-0 right-0 w-4 h-4 z-120 cursor-nesw-resize bg-transparent hover:bg-primary/10 transition-colors rounded-tr-xl border-r-2 border-t-2 border-primary/40"
          />

          {/* Corner Resize Handle (Bottom-Left) */}
          <div
            onMouseDown={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setIsResizing(true);
              const startX = e.pageX;
              const startY = e.pageY;
              const rect = (e.currentTarget.parentElement as HTMLElement).getBoundingClientRect();
              const startWidth = rect.width;
              const startHeight = rect.height;

              const onMouseMove = (moveEvent: MouseEvent) => {
                const deltaX = startX - moveEvent.pageX;
                const deltaY = moveEvent.pageY - startY;
                setProp((props: any) => {
                  props.width = Math.max(100, Math.round(startWidth + deltaX));
                  props.height = Math.max(50, Math.round(startHeight + deltaY));
                });
              };

              const onMouseUp = () => {
                setIsResizing(false);
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
              };

              document.addEventListener('mousemove', onMouseMove);
              document.addEventListener('mouseup', onMouseUp);
            }}
            className="absolute bottom-0 left-0 w-4 h-4 z-120 cursor-nesw-resize bg-transparent hover:bg-primary/10 transition-colors rounded-bl-xl border-l-2 border-b-2 border-primary/40"
          />
        </>
      )}

      <div className={clsx(
        "w-full rounded-2xl flex-1", 
        !noPadding && "p-3",
        height ? "overflow-hidden" : "overflow-visible"
      )}>
        {children || <Placeholder name={name || 'Section'} />}
      </div>
    </div>
  );
};

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
          onSelect={(item) => actions.setProp((props: any) => props.padding = item.value)}
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
          onSelect={(item) => actions.setProp((props: any) => props.px = item.value)}
          size="sm"
          className="w-full"
        />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Height (px)</p>
        <Input 
          type="number"
          value={props.height || ''} 
          onChange={(e) => actions.setProp((props: any) => props.height = e.target.value)}
          placeholder="Auto"
        />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Width (px)</p>
          {props.width && (
            <button 
              className="text-[10px] text-accent-400 hover:underline uppercase font-bold"
              onClick={() => actions.setProp((props: any) => props.width = '')}
            >
              Set Full
            </button>
          )}
        </div>
        <Input 
          type="number"
          value={props.width || ''} 
          onChange={(e) => actions.setProp((props: any) => props.width = e.target.value)}
          placeholder="Leave empty for Full Screen"
        />
      </div>    </div>
  );
};

export const Container = ({ children, height, width, centered, centerChildren, padding = '0', px = '1', ...props }: any) => {
  const { id, connectors: { connect } } = useNode();
  const { actions, enabled } = useEditor((state) => ({ enabled: state.options.enabled }));
  const widthStyle = typeof width === 'string' && width.includes('/') ? width : (width ? `${width}px` : '100%');
  
  return (
    <div 
      {...props} 
      ref={(ref: any) => connect(ref)} 
      onClick={(e) => {
        if (!enabled || e.target !== e.currentTarget) return;
        e.stopPropagation();
        actions.selectNode(id);
      }}
      className={clsx(
        "flex flex-col gap-6 w-full transition-all relative",
        centered && "page mx-auto",
        centerChildren && "items-center",
        padding === '8' ? 'py-8' : padding === '16' ? 'py-16' : padding === '32' ? 'py-32' : 'py-0',
        px === '1' ? 'px-1' : px === '4' ? 'px-4' : px === '8' ? 'px-8' : 'px-0',
        enabled && "min-h-[100px] border border-dashed border-transparent hover:border-primary/20",
        !enabled && "min-h-0",
        props.className
      )}
      style={{ 
        ...props.style, 
        height: height ? `${height}px` : 'auto',
        width: widthStyle
      }}
    >
      {children}
    </div>
  );
};
Container.craft = {
  isCanvas: true,
  displayName: 'Container',
  rules: {
    canMoveIn: (incomingNodes: any) => incomingNodes.every((node: any) => node.data.displayName === 'Grid'),
    canSelect: () => true,
  },
  related: {
    settings: ContainerSettings
  }
};

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
          onSelect={(item) => actions.setProp((props: any) => props.gap = item.value)}
          size="sm"
          className="w-full"
        />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Height (px)</p>
        <Input 
          type="number"
          value={props.height || ''} 
          onChange={(e) => actions.setProp((props: any) => props.height = e.target.value)}
          placeholder="Auto"
        />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Width (px)</p>
          {props.width && (
            <button 
              className="text-[10px] text-accent-400 hover:underline uppercase font-bold"
              onClick={() => actions.setProp((props: any) => props.width = '')}
            >
              Set Full
            </button>
          )}
        </div>
        <Input 
          type="number"
          value={props.width || ''} 
          onChange={(e) => actions.setProp((props: any) => props.width = e.target.value)}
          placeholder="Leave empty for Full Screen"
        />
      </div>    </div>
  );
};

export const Grid = ({ children, gap = '18', height, width, centered, ...props }: any) => {
  const { id, connectors: { connect }, selected } = useNode((node) => ({
    selected: node.events.selected
  }));
  const { actions, enabled } = useEditor((state) => ({
    enabled: state.options.enabled
  }));
  const widthStyle = typeof width === 'string' && width.includes('/') ? width : (width ? `${width}px` : '100%');

  return (
    <div 
      ref={(ref: any) => connect(ref)} 
      onClick={(e) => {
        if (!enabled || (e.target !== e.currentTarget && !e.currentTarget.contains(e.target as Node))) return;
        
        // Only select grid if clicking on the grid itself (gutters/padding)
        // or if it's explicitly intended.
        if (e.target === e.currentTarget) {
          e.stopPropagation();
          actions.selectNode(id);
        }
      }}
      className={clsx(
        'flex flex-col md:flex-row w-full min-h-[50px] transition-all relative group/grid rounded-lg',
        centered && "page mx-auto",
        gap === '18' ? 'md:gap-18' : gap === '8' ? 'md:gap-8' : gap === '4' ? 'md:gap-4' : 'md:gap-0',
        enabled && selected && 'ring-2 ring-primary/50 ring-offset-2',
        enabled && 'border-2 border-transparent hover:border-primary/20',
        enabled && React.Children.count(children) === 0 && 'p-4 min-h-[100px]!',
        !enabled && 'min-h-0'
      )}
      style={{ 
        ...props.style, 
        height: height ? `${height}px` : 'auto',
        width: widthStyle
      }}
      {...props}
    >
      {children}
      {enabled && React.Children.count(children) === 0 && (
        <div className="flex-1 border-2 border-dashed border-primary/20 rounded-lg p-10 flex items-center justify-center text-tertiary/40">
           Empty Grid
        </div>
      )}
    </div>
  );
};
Grid.craft = {
  isCanvas: true,
  displayName: 'Grid',
  rules: {
    canMoveIn: (incomingNodes: any) => incomingNodes.every((node: any) => node.data.displayName !== 'Grid'),
  },
  related: {
    settings: GridSettings
  }
};

export const Col = ({ children, width, height, ...props }: any) => {
  const { id, connectors: { connect }, selected } = useNode((node) => ({
    selected: node.events.selected
  }));
  const { actions, enabled } = useEditor((state) => ({
    enabled: state.options.enabled
  }));
  
  // Only apply inline width if it's a numeric value (e.g. "300"). 
  // For presets like "74", "1/2", etc., we use Tailwind classes.
  const isNumericWidth = width && !isNaN(Number(width)) && width !== '74';
  const widthStyle = isNumericWidth ? `${width}px` : (typeof width === 'string' && width.includes('/') ? width : 'auto');

  return (
    <div 
      ref={(ref: any) => connect(ref)} 
      onClick={(e) => {
        if (!enabled || e.target !== e.currentTarget) return;
        e.stopPropagation();
        actions.selectNode(id);
      }}
      className={clsx(
        'flex flex-col gap-6 min-h-[50px] transition-all relative group/col rounded-lg p-4',
        width === '74' ? 'md:w-74' : width === '1/2' ? 'md:w-1/2' : width === '1/3' ? 'md:w-1/3' : width === '2/3' ? 'md:w-2/3' : (isNumericWidth ? '' : 'flex-1 w-full'),
        enabled && selected && 'ring-2 ring-primary/30',
        enabled && 'border border-dashed border-transparent hover:border-primary/10',
        enabled && React.Children.count(children) === 0 && 'min-h-[100px]!',
        !enabled && 'min-h-0'
      )}
      style={{ 
        ...props.style, 
        height: height ? `${height}px` : 'auto',
        width: widthStyle === 'auto' ? undefined : widthStyle
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
              actions.delete(id);
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
Col.craft = {
  isCanvas: true,
  displayName: 'Column',
  rules: {
    canMoveIn: (incomingNodes: any) => incomingNodes.every((node: any) => node.data.displayName !== 'Grid' && node.data.displayName !== 'Column'),
  },
  related: {
    settings: ColSettings
  }
};

// Wrapped Versions
export const CraftRichText = (props: any) => {
  const { enabled } = useEditor((state) => ({ enabled: state.options.enabled }));
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
CraftRichText.craft = { 
  displayName: 'RichText', 
  rules: { canDrag: () => true },
  related: {
    settings: RichTextSettings
  }
};

export const CraftVideoEmbed = (props: any) => {
  const { enabled } = useEditor((state) => ({ enabled: state.options.enabled }));
  const embedUrl = getEmbedUrl(props.url);

  if (!embedUrl && !enabled) return null;

  return (
    <CraftSection name="Video Embed">
      {embedUrl ? (
        <div className="aspect-video w-full overflow-hidden rounded-lg">
          <iframe 
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
CraftVideoEmbed.craft = { 
  displayName: 'VideoEmbed', 
  rules: { canDrag: () => true },
  related: {
    settings: VideoEmbedSettings
  }
};

export const CraftAboutSection = (props: any) => {
  const event = useEvent(props);
  const { enabled } = useEditor((state) => ({ enabled: state.options.enabled }));
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
CraftAboutSection.craft = { 
  displayName: 'AboutSection', 
  rules: { canDrag: () => true },
  related: {
    settings: AboutSettings
  }
};

export const CraftLocationSection = (props: any) => {
  const event = useEvent(props);
  const { enabled } = useEditor((state) => ({ enabled: state.options.enabled }));
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
CraftLocationSection.craft = { 
  displayName: 'Map', 
  rules: { canDrag: () => true },
  related: {
    settings: MapSettings
  }
};

export const CraftEventAccess = (props: any) => {
  const event = useEvent(props);
  return (
    <CraftSection name="CTA Block">
      <EventAccess {...props} event={event} />
    </CraftSection>
  );
};
CraftEventAccess.craft = { 
  displayName: 'CTA Block', 
  rules: { canDrag: () => true },
  related: {
    settings: RegistrationSettings
  }
};

export const CraftEventCollectibles = (props: any) => {
  const event = useEvent(props);
  return (
    <CraftSection name="Collectibles">
      <EventCollectibles {...props} event={event} />
    </CraftSection>
  );
};
CraftEventCollectibles.craft = { 
  displayName: 'EventCollectibles', 
  rules: { canDrag: () => true },
  // No specific settings for collectibles yet, but we could add them if needed
};

export const CraftSubEventSection = (props: any) => {
  const event = useEvent(props);
  const { enabled } = useEditor((state) => ({ enabled: state.options.enabled }));
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
CraftSubEventSection.craft = { 
  displayName: 'SubEventSection', 
  rules: { canDrag: () => true },
  // No specific settings yet
};

export const CraftGallerySection = (props: any) => {
  const event = useEvent(props);
  const { enabled } = useEditor((state) => ({ enabled: state.options.enabled }));
  const hasContent = event?.new_new_photos_expanded?.length > 1;

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
CraftGallerySection.craft = { 
  displayName: 'GallerySection', 
  rules: { canDrag: () => true },
  // No specific settings yet
};

export const CraftEventDateTimeBlock = (props: any) => {
  const event = useEvent(props);
  return (
    <CraftSection name="Date Time">
      <EventDateTimeBlock {...props} event={event} />
    </CraftSection>
  );
};
CraftEventDateTimeBlock.craft = { 
  displayName: 'Date Time Block', 
  rules: { canDrag: () => true },
  related: {
    settings: DateTimeSettings
  }
};

export const CraftEventLocationBlock = (props: any) => {
  const event = useEvent(props);
  const { enabled } = useEditor((state) => ({ enabled: state.options.enabled }));
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
CraftEventLocationBlock.craft = { 
  displayName: 'Location', 
  rules: { canDrag: () => true },
  related: {
    settings: LocationSettings
  }
};

export const CraftCommunitySection = (props: any) => {
  const event = useEvent(props);
  const { enabled } = useEditor((state) => ({ enabled: state.options.enabled }));
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
CraftCommunitySection.craft = { 
  displayName: 'CommunitySection', 
  rules: { canDrag: () => true },
  // No specific settings yet
};

export const CraftHostedBySection = (props: any) => {
  const event = useEvent(props);
  const { enabled } = useEditor((state) => ({ enabled: state.options.enabled }));
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
CraftHostedBySection.craft = { 
  displayName: 'HostedBySection', 
  rules: { canDrag: () => true },
  // No specific settings yet
};

export const CraftAttendeesSection = (props: any) => {
  const event = useEvent(props);
  return (
    <CraftSection name="Attendees">
      <AttendeesSection {...props} event={event} />
    </CraftSection>
  );
};
CraftAttendeesSection.craft = { 
  displayName: 'AttendeesSection', 
  rules: { canDrag: () => true },
  // No specific settings yet
};

export const CraftEventHero = (props: any) => {
  const event = useEvent(props);
  const align = props.align || 'text-left';
  const flexAlign = align === 'text-center' ? 'items-center' : align === 'text-right' ? 'items-end' : 'items-start';

  return (
    <CraftSection name="Event Hero">
      <div className={clsx("space-y-4 flex flex-col", flexAlign, align)}>
        <div className="space-y-2 w-full">
          <h3 className="text-xl md:text-3xl font-bold">{event?.title || 'Untitled Event'}</h3>
        </div>
      </div>
    </CraftSection>
  );
};
CraftEventHero.craft = { 
  displayName: 'Event Title', 
  rules: { canDrag: () => true },
  related: {
    settings: HeroSettings
  }
};

export const CraftEventSidebarImage = (props: any) => {
  const event = useEvent(props);
  const aspectRatio = props.aspectRatio || 'aspect-square';
  const objectFit = props.objectFit || 'object-cover';

  return (
    <CraftSection name="Event Image" noPadding {...props}>
      <div className={clsx("w-full overflow-hidden rounded-2xl", aspectRatio, aspectRatio === 'aspect-auto' && "h-full")}>
       {event?.new_new_photos_expanded?.[0] ? (
            <img
              src={generateUrl(event.new_new_photos_expanded[0], EDIT_KEY.EVENT_PHOTO)}
              alt={event.title}
              loading="lazy"
              className={clsx("w-full h-full border-none", objectFit)}
            />
          ) : (
            <img className={clsx("w-full h-full border-none", objectFit)} src={randomEventDP()} alt="Event cover" />
          )}
      </div>
    </CraftSection>
  );
};
CraftEventSidebarImage.craft = { 
  displayName: 'Event Image', 
  rules: { canDrag: () => true },
  related: {
    settings: SidebarImageSettings
  }
};

export const CraftImageBanner = (props: any) => {
  const { enabled } = useEditor((state) => ({ enabled: state.options.enabled }));
  if (!enabled) return null;
  return (
    <CraftSection name="Image Banner">
      <Placeholder name="Image Banner" description="Drop your image here" />
    </CraftSection>
  );
};
CraftImageBanner.craft = { displayName: 'Image Banner' };

export const CraftCardsGrid = (props: any) => {
  const { enabled } = useEditor((state) => ({ enabled: state.options.enabled }));
  if (!enabled) return null;
  return (
    <CraftSection name="Cards Grid">
      <Placeholder name="Cards Grid" description="Feature your content in cards" />
    </CraftSection>
  );
};
CraftCardsGrid.craft = { displayName: 'Cards Grid' };

export const CraftTestimonials = (props: any) => {
  const { enabled } = useEditor((state) => ({ enabled: state.options.enabled }));
  if (!enabled) return null;
  return (
    <CraftSection name="Testimonials">
      <Placeholder name="Testimonials" description="What people are saying" />
    </CraftSection>
  );
};
CraftTestimonials.craft = { displayName: 'Testimonials' };

export const CraftSocialLinks = (props: any) => {
  const { enabled } = useEditor((state) => ({ enabled: state.options.enabled }));
  if (!enabled) return null;
  return (
    <CraftSection name="Social Links">
      <Placeholder name="Social Links" description="Connect your social media" />
    </CraftSection>
  );
};
CraftSocialLinks.craft = { displayName: 'Social Links' };

export const CraftCustomHTML = (props: any) => {
  const { enabled } = useEditor((state) => ({ enabled: state.options.enabled }));
  if (!enabled) return null;
  return (
    <CraftSection name="Custom HTML">
      <Placeholder name="Custom HTML" description="Add your custom code" />
    </CraftSection>
  );
};
CraftCustomHTML.craft = { displayName: 'Custom HTML' };

const SpacerSettings = () => {
  const { actions, props } = useSettings();
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Height (px)</p>
        <Input 
          type="number"
          value={props.height || '40'} 
          onChange={(e) => actions.setProp((props: any) => props.height = e.target.value)}
          placeholder="40"
        />
      </div>
    </div>
  );
};

export const CraftSpacer = ({ height = '40' }: any) => {
  const { enabled } = useEditor((state) => ({ enabled: state.options.enabled }));
  
  if (!enabled) {
    return <div style={{ height: `${height}px` }} className="w-full" />;
  }

  return (
    <div 
      style={{ height: `${height}px` }}
      className="w-full flex items-center justify-center border border-dashed border-card-border rounded-md text-[10px] text-quaternary uppercase tracking-widest bg-card/20"
    >
      Spacer
    </div>
  );
};
CraftSpacer.craft = { 
  displayName: 'Spacer',
  rules: { canDrag: () => true },
  related: {
    settings: SpacerSettings
  }
};

export const CraftHeader = (props: any) => {
  const { enabled } = useEditor((state) => ({ enabled: state.options.enabled }));
  if (!enabled) return null;
  return (
    <CraftSection name="Header">
      <Placeholder name="Header" description="Page header" />
    </CraftSection>
  );
};
CraftHeader.craft = { displayName: 'Header' };

export const CraftFooter = (props: any) => {
  const { enabled } = useEditor((state) => ({ enabled: state.options.enabled }));
  if (!enabled) return null;
  return (
    <CraftSection name="Footer">
      <Placeholder name="Footer" description="Page footer" />
    </CraftSection>
  );
};
CraftFooter.craft = { displayName: 'Footer' };

export const CraftMusicPlayer = (props: any) => {
  const { enabled } = useEditor((state) => ({ enabled: state.options.enabled }));
  if (!enabled) return null;
  return (
    <CraftSection name="Music Player">
      <Placeholder name="Music Player" description="Share your music" />
    </CraftSection>
  );
};
CraftMusicPlayer.craft = { displayName: 'Music Player' };

export const CraftWalletConnect = (props: any) => {
  const { enabled } = useEditor((state) => ({ enabled: state.options.enabled }));
  if (!enabled) return null;
  return (
    <CraftSection name="Wallet Connect">
      <Placeholder name="Wallet Connect" description="Web3 connectivity" />
    </CraftSection>
  );
};
CraftWalletConnect.craft = { displayName: 'Wallet Connect' };

export const CraftPassport = (props: any) => {
  const { enabled } = useEditor((state) => ({ enabled: state.options.enabled }));
  if (!enabled) return null;
  return (
    <CraftSection name="Passport">
      <Placeholder name="Passport" description="Digital identity" />
    </CraftSection>
  );
};
CraftPassport.craft = { displayName: 'Passport' };

export const resolver = {
  Container,
  Grid,
  Col,
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
  CardsGrid: CraftCardsGrid,
  Testimonials: CraftTestimonials,
  SocialLinks: CraftSocialLinks,
  CustomHTML: CraftCustomHTML,
  Spacer: CraftSpacer,
  Header: CraftHeader,
  Footer: CraftFooter,
  MusicPlayer: CraftMusicPlayer,
  WalletConnect: CraftWalletConnect,
  Passport: CraftPassport,
};