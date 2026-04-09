import React from 'react';
import { useNode, useEditor } from '@craftjs/core';
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
import { Button, Input, Toggle, Divider, Segment, Card, TextEditor, PlaceAutoComplete, FileInput } from '$lib/components/core';
import { getEventCohosts } from '$lib/utils/event';
import { randomEventDP } from '$lib/utils/user';
import { useSettings } from '../SettingsPanel';
import { generateUrl, EDIT_KEY } from '$lib/utils/cnd';
import { DateTimeGroup, Timezone } from '$lib/components/core/calendar';
import { useStoreManageLayout } from '../store';
import { Event } from '$lib/graphql/generated/backend/graphql';
import { uploadFiles } from '$lib/utils/file';
import { toast } from '$lib/components/core/toast';

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
  const [uploading, setUploading] = React.useState(false);

  const handleUpload = async (files: File[]) => {
    if (!files.length) return;
    try {
      setUploading(true);
      const res = await uploadFiles([files[0]], 'event');
      if (res.length > 0) {
        const newImageId = res[0]._id;
        actions.setProp((props: any) => {
          if (!props.event) props.event = {};
          if (!props.event.new_new_photos_expanded) props.event.new_new_photos_expanded = [];
          props.event.new_new_photos_expanded = [newImageId, ...props.event.new_new_photos_expanded.slice(1)];
          
          if (!props.event.new_new_photos) props.event.new_new_photos = [];
          props.event.new_new_photos = [newImageId, ...props.event.new_new_photos.slice(1)];
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
              {props.event?.new_new_photos_expanded?.[0] ? (
                <img 
                  src={generateUrl(props.event.new_new_photos_expanded[0], EDIT_KEY.EVENT_PHOTO)} 
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
    </div>
  );
};

const HeroSettings = () => {
  const { actions, props } = useSettings();
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Title</p>
        <Input 
          value={props.event?.title || ''} 
          onChange={(e) => actions.setProp((props: any) => {
            if (!props.event) props.event = {};
            props.event.title = e.target.value;
          })}
          placeholder="Enter event title..."
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
          onSelect={(item) => actions.setProp((props: any) => props.align = item.value)}
          size="sm"
          className="w-full"
        />
      </div>
    </div>
  );
};

const AboutSettings = () => {
  const { actions, props } = useSettings();
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Description</p>
        <TextEditor 
          content={props.event?.description || ''} 
          onChange={(value) => actions.setProp((props: any) => {
            if (!props.event) props.event = {};
            props.event.description = value;
          })}
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
          value={props.event?.registration_heading || 'Registration'} 
          onChange={(e) => actions.setProp((props: any) => props.event.registration_heading = e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Description</p>
        <Input 
          textarea
          value={props.event?.registration_description || 'Ready to join us? Pick your ticket, grab your spot, and get ready for a weekend of music, art, and culture.'} 
          onChange={(e) => actions.setProp((props: any) => props.event.registration_description = e.target.value)}
          rows={3}
        />
      </div>
    </div>
  );
};

const GridSettings = () => {
  const { actions, props } = useSettings();
  return (
    <div className="flex flex-col gap-4">
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
  );
};

const ColSettings = () => {
  const { actions, props } = useSettings();
  return (
    <div className="flex flex-col gap-4">
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
  );
};

const DateTimeSettings = () => {
  const { actions, props } = useSettings();
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <DateTimeGroup
          placement="bottom"
          start={props.event?.start}
          end={props.event?.end}
          timezone={props.event?.timezone}
          onSelect={(dateRange) => actions.setProp((props: any) => {
            if (!props.event) props.event = {};
            props.event.start = dateRange.start;
            props.event.end = dateRange.end;
          })}
        />
        <Timezone
          placement="bottom-end"
          onSelect={(timezoneOption) => actions.setProp((props: any) => {
            if (!props.event) props.event = {};
            props.event.timezone = timezoneOption.value;
          })}
          strategy="absolute"
          className="w-full"
          trigger={() => (
            <div className="flex items-center gap-2 p-3 border border-card-border rounded-md bg-card cursor-pointer hover:bg-card-hover transition-colors">
              <i aria-hidden="true" className="icon-globe size-5 text-tertiary" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{props.event?.timezone || 'Select Timezone'}</p>
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
  const { actions, props } = useSettings();
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Event Location</p>
        <PlaceAutoComplete
          value={props.event?.address?.title || ''}
          placeholder="What's the address?"
          onSelect={(addressData) => actions.setProp((props: any) => {
            if (!props.event) props.event = {};
            props.event.address = addressData;
            props.event.latitude = addressData?.latitude;
            props.event.longitude = addressData?.longitude;
          })}
        />
      </div>
    </div>
  );
};

const LocationSettings = () => {
  const { actions, props } = useSettings();
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Event Location</p>
        <PlaceAutoComplete
          value={props.event?.address?.title || ''}
          placeholder="What's the address?"
          onSelect={(addressData) => actions.setProp((props: any) => {
            if (!props.event) props.event = {};
            props.event.address = addressData;
            props.event.latitude = addressData?.latitude;
            props.event.longitude = addressData?.longitude;
          })}
        />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Join URL</p>
        <Input 
          value={props.event?.virtual_url || ''} 
          onChange={(e) => actions.setProp((props: any) => {
            if (!props.event) props.event = {};
            props.event.virtual_url = e.target.value;
          })}
          placeholder="https://example.com/join"
        />
      </div>
    </div>
  );
};

const Placeholder = ({ name, description }: { name: string; description?: string }) => (
  <div className="w-full p-6 bg-accent-400/5 border border-dashed border-accent-400/20 rounded-md text-center">
    <p className="text-accent-500 font-medium">{name} Section</p>
    <p className="text-tertiary text-xs">{description || `No data provided for this ${name.toLowerCase()} section.`}</p>
  </div>
);

export const CraftSection = ({ children, name }: { children: React.ReactNode; name?: string }) => {
  const {
    id,
    connectors: { connect, drag },
    selected,
    hovered,
  } = useNode((node) => ({
    selected: node.events.selected,
    hovered: node.events.hovered,
  }));

  const { actions, query } = useEditor();

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

  return (
    <div
      ref={(ref: any) => ref && connect(drag(ref))}
      onClick={() => actions.selectNode(id)}
      className="relative group/section w-full p-3 cursor-pointer"
    >
      {/* Interaction Blocker - Permanently prevents clicks on links/buttons inside sections while in editor */}
      <div className="absolute inset-0 z-40" />

      {selected && (
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
      )}

      {(selected || hovered) && (
        <div 
          className={`absolute inset-0 z-50 pointer-events-none border-2 rounded-lg transition-colors ${
            selected ? 'border-primary' : 'border-primary/20'
          }`}
        />
      )}
      
      <div className="w-full">
        {children || <Placeholder name={name || 'Section'} />}
      </div>
    </div>
  );
};

export const Container = ({ children, ...props }: any) => {
  const { connectors: { connect } } = useNode();
  return (
    <div 
      {...props} 
      ref={(ref: any) => connect(ref)} 
      className={`flex flex-col gap-6 w-full min-h-[500px] pb-20 px-1 ${props.className || ''}`}
      style={{ ...props.style }}
    >
      {children}
    </div>
  );
};
Container.craft = {
  isCanvas: true,
  rules: {
    canMoveIn: () => true,
    canSelect: () => false,
  },
};

export const Grid = ({ children, gap = '18', ...props }: any) => {
  const { id, connectors: { connect }, selected } = useNode((node) => ({
    selected: node.events.selected
  }));
  const { actions } = useEditor();
  return (
    <div 
      ref={(ref: any) => connect(ref)} 
      onClick={(e) => {
        if (e.target !== e.currentTarget) return;
        e.stopPropagation();
        actions.selectNode(id);
      }}
      className={clsx(
        'flex flex-col md:flex-row w-full min-h-[50px] transition-all relative group/grid',
        gap === '18' ? 'md:gap-18' : gap === '8' ? 'md:gap-8' : gap === '4' ? 'md:gap-4' : 'md:gap-0',
        selected && 'ring-2 ring-primary/50 ring-offset-2'
      )}
      {...props}
    >
      {selected && (
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
      {React.Children.count(children) === 0 && (
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
  related: {
    settings: GridSettings
  }
};

export const Col = ({ children, width, ...props }: any) => {
  const { id, connectors: { connect }, selected } = useNode((node) => ({
    selected: node.events.selected
  }));
  const { actions } = useEditor();
  return (
    <div 
      ref={(ref: any) => connect(ref)} 
      onClick={(e) => {
        if (e.target !== e.currentTarget) return;
        e.stopPropagation();
        actions.selectNode(id);
      }}
      className={clsx(
        'flex flex-col gap-6 min-h-[50px] transition-all relative group/col',
        width === '74' ? 'md:w-74' : width === '1/2' ? 'md:w-1/2' : width === '1/3' ? 'md:w-1/3' : width === '2/3' ? 'md:w-2/3' : 'flex-1 w-full',
        selected && 'ring-2 ring-primary/30'
      )}
      {...props}
    >
      {selected && (
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
      {React.Children.count(children) === 0 && (
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
  related: {
    settings: ColSettings
  }
};

// Wrapped Versions
export const CraftRichText = (props: any) => {
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
  const embedUrl = getEmbedUrl(props.url);
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
  const hasContent = event?.description;
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
  const hasContent = event?.address;
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

export const CraftEventAccess = (props: any) => (
  <CraftSection name="CTA Block">
    <EventAccess {...props} />
  </CraftSection>
);
CraftEventAccess.craft = { 
  displayName: 'CTA Block', 
  rules: { canDrag: () => true },
};

export const CraftEventCollectibles = (props: any) => {
  return (
    <CraftSection name="Collectibles">
      <EventCollectibles {...props} />
    </CraftSection>
  );
};
CraftEventCollectibles.craft = { displayName: 'EventCollectibles', rules: { canDrag: () => true } };

export const CraftSubEventSection = (props: any) => {
  const hasContent = props.event?.subevent_enabled;
  return (
    <CraftSection name="Schedule">
      {hasContent ? (
        <SubEventSection {...props} />
      ) : (
        <Placeholder name="Schedule" description="Sub-events are not enabled for this event." />
      )}
    </CraftSection>
  );
};
CraftSubEventSection.craft = { displayName: 'SubEventSection', rules: { canDrag: () => true } };

export const CraftGallerySection = (props: any) => {
  const hasContent = props.event?.new_new_photos_expanded?.length > 1;
  return (
    <CraftSection name="Gallery">
      {hasContent ? (
        <GallerySection {...props} />
      ) : (
        <Placeholder name="Gallery" description="No photos provided for this event gallery." />
      )}
    </CraftSection>
  );
};
CraftGallerySection.craft = { displayName: 'GallerySection', rules: { canDrag: () => true } };

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
  const hasContent = event?.address || event?.virtual_url;
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
  const hasContent = props.event?.space;
  return (
    <CraftSection name="Community">
      {hasContent ? (
        <CommunitySection {...props} />
      ) : (
        <Placeholder name="Community" description="No community associated with this event." />
      )}
    </CraftSection>
  );
};
CraftCommunitySection.craft = { displayName: 'CommunitySection', rules: { canDrag: () => true } };

export const CraftHostedBySection = (props: any) => {
  const hasContent = getEventCohosts(props.event).length > 0;
  return (
    <CraftSection name="HostedBy">
      {hasContent ? (
        <HostedBySection {...props} />
      ) : (
        <Placeholder name="Hosted By" description="No hosts information available." />
      )}
    </CraftSection>
  );
};
CraftHostedBySection.craft = { displayName: 'HostedBySection', rules: { canDrag: () => true } };

export const CraftAttendeesSection = (props: any) => (
  <CraftSection name="Attendees">
    <AttendeesSection {...props} />
  </CraftSection>
);
CraftAttendeesSection.craft = { displayName: 'AttendeesSection', rules: { canDrag: () => true } };

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
  return (
    <CraftSection name="Event Image">
       {event?.new_new_photos_expanded?.[0] ? (
            <img
              src={generateUrl(event.new_new_photos_expanded[0], EDIT_KEY.EVENT_PHOTO)}
              alt={event.title}
              loading="lazy"
              className="aspect-square object-contain border rounded-md"
            />
          ) : (
            <img className="aspect-square object-contain border rounded-md" src={randomEventDP()} alt="Event cover" />
          )}
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

export const resolver = {
  Container,
  Grid,
  Col,
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
};