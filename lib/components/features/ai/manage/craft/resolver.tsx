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
import { Button, Input, Toggle, Divider, Segment } from '$lib/components/core';
import { getEventCohosts } from '$lib/utils/event';
import { randomEventDP } from '$lib/utils/user';
import { useSettings } from '../SettingsPanel';
import { generateUrl, EDIT_KEY } from '$lib/utils/cnd';

const AboutSettings = () => {
  const { actions, props } = useSettings();
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Heading</p>
        <Input 
          value={props.event?.title || ''} 
          onChange={(e) => actions.setProp((props: any) => props.event.title = e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Description</p>
        <Input 
          textarea
          value={props.event?.description || ''} 
          onChange={(e) => actions.setProp((props: any) => props.event.description = e.target.value)}
          rows={5}
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

const DateTimeSettings = () => {
  const { props } = useSettings();
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="font-medium">Show Date & Time</p>
        <Toggle checked={true} onChange={() => {}} />
      </div>
      
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 opacity-60">
          <p className="text-[10px] text-tertiary uppercase font-bold tracking-wider">Starts</p>
          <div className="flex gap-2">
            <Input value="Wed, 14 May" readOnly className="flex-1" size="sm" />
            <Input value="07:00 PM" readOnly className="w-28" size="sm" />
          </div>
        </div>
        
        <div className="flex flex-col gap-2 opacity-60">
          <p className="text-[10px] text-tertiary uppercase font-bold tracking-wider">Ends</p>
          <div className="flex gap-2">
            <Input value="Wed, 14 May" readOnly className="flex-1" size="sm" />
            <Input value="08:00 PM" readOnly className="w-28" size="sm" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
           <p className="text-[10px] text-tertiary uppercase font-bold tracking-wider">Timezone</p>
           <div className="flex items-center gap-2 p-2 border border-card-border rounded-md bg-accent-400/5 cursor-not-allowed">
              <i className="icon-web size-4 text-tertiary" />
              <p className="text-sm truncate flex-1">{props.event?.timezone || 'GMT+0:00 UTC'}</p>
              <i className="icon-chevron-down size-4 text-quaternary" />
           </div>
        </div>
      </div>
    </div>
  );
};

const LocationSettings = () => {
  const { actions, props } = useSettings();
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Heading</p>
        <Input 
          value={props.event?.location_heading || 'Location'} 
          onChange={(e) => actions.setProp((props: any) => props.event.location_heading = e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Description</p>
        <Input 
          textarea
          value={props.event?.location_description || ''} 
          onChange={(e) => actions.setProp((props: any) => props.event.location_description = e.target.value)}
          rows={3}
        />
      </div>
      
      <Divider />
      
      <div className="flex flex-col gap-4">
        <p className="font-medium text-sm">Location</p>
        <div className="flex flex-col gap-2">
          <p className="text-xs text-tertiary">Event Location</p>
          <Input 
            value={props.event?.address?.title || ''} 
            iconLeft="icon-location-outline"
            readOnly
            size="sm"
            placeholder="Search for a location..."
          />
        </div>
        <Button variant="tertiary" size="sm" iconLeft="icon-add" className="justify-start h-9 text-xs">
          Add Additional Directions
        </Button>
        <div className="flex items-start gap-3 p-3 border border-card-border rounded-md bg-accent-400/5">
          <Toggle checked={!!props.event?.private} onChange={() => {}} className="mt-0.5" />
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-medium">Restrict Location to Guests</p>
            <p className="text-xs text-tertiary leading-relaxed">Only approved and invited guests can see the precise location of this event.</p>
          </div>
        </div>
      </div>

      <Divider />

      <div className="flex flex-col gap-4">
        <p className="font-medium text-sm">Graphic</p>
        <Segment
          items={[{ label: 'Map', value: 'map' }, { label: 'Image', value: 'image' }]}
          selected={props.event?.location_graphic_type || 'map'}
          onSelect={(item) => actions.setProp((props: any) => props.event.location_graphic_type = item.value)}
          size="sm"
          className="w-full"
        />
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">Google Maps Embed URL</p>
          <Input 
            value={props.event?.location_map_embed_url || ''} 
            onChange={(e) => actions.setProp((props: any) => props.event.location_map_embed_url = e.target.value)}
            placeholder='<iframe src="https://www.google.com/maps/embed...'
            size="sm"
          />
        </div>
      </div>
    </div>
  );
};

const Placeholder = ({ name, description }: { name: string; description?: string }) => (
  <div className="p-6 bg-accent-400/5 border border-dashed border-accent-400/20 rounded-md text-center">
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

  // Fetch real-time data from query to avoid stale closures
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
    // In Craft.js, to move a node "down" (forward in the array) within the same parent, 
    // we move it to index + 2 because the node is removed from the array before 
    // being re-inserted, and we want it to land after the next sibling.
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
      {/* Action Buttons Toolbar */}
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

      {/* Selection/Hover Indicator Overlay */}
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
  },
};

export const Grid = ({ children, gap = '18', ...props }: any) => {
  const { connectors: { connect } } = useNode();
  return (
    <div 
      ref={(ref: any) => connect(ref)} 
      className={clsx(
        'flex flex-col md:flex-row w-full min-h-[50px] transition-all',
        gap === '18' ? 'md:gap-18' : gap === '8' ? 'md:gap-8' : gap === '4' ? 'md:gap-4' : 'md:gap-0'
      )}
      {...props}
    >
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
  const { connectors: { connect } } = useNode();
  return (
    <div 
      ref={(ref: any) => connect(ref)} 
      className={clsx(
        'flex flex-col gap-6 min-h-[50px] transition-all relative',
        width === '74' ? 'md:w-74' : width === '1/2' ? 'md:w-1/2' : width === '1/3' ? 'md:w-1/3' : width === '2/3' ? 'md:w-2/3' : 'flex-1 w-full'
      )}
      {...props}
    >
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

// Craftable versions of components
export const CraftAboutSection = (props: any) => {
  const hasContent = props.event?.description;
  return (
    <CraftSection name="About">
      {hasContent ? (
        <AboutSection {...props} />
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
  const hasContent = props.event?.address;
  return (
    <CraftSection name="Location">
      {hasContent ? (
        <LocationSection {...props} />
      ) : (
        <Placeholder name="Location (Map)" description="No address provided for this event." />
      )}
    </CraftSection>
  );
};
CraftLocationSection.craft = { 
  displayName: 'LocationSection', 
  rules: { canDrag: () => true },
  related: {
    settings: LocationSettings
  }
};

export const CraftEventAccess = (props: any) => (
  <CraftSection name="Registration">
    <EventAccess {...props} />
  </CraftSection>
);
CraftEventAccess.craft = { 
  displayName: 'EventAccess', 
  rules: { canDrag: () => true },
  related: {
    settings: RegistrationSettings
  }
};

export const CraftEventCollectibles = (props: any) => {
  // We can't easily check poapDrops here without duplicating hook logic,
  // but we can always show the component and let it handle its own placeholder if we modify it,
  // or just show a generic placeholder if we want to guarantee visibility in the editor.
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

export const CraftEventDateTimeBlock = (props: any) => (
  <CraftSection name="DateTime">
    <EventDateTimeBlock {...props} />
  </CraftSection>
);
CraftEventDateTimeBlock.craft = { 
  displayName: 'EventDateTimeBlock', 
  rules: { canDrag: () => true },
  related: {
    settings: DateTimeSettings
  }
};

export const CraftEventLocationBlock = (props: any) => {
  const hasContent = props.event?.address || props.event?.virtual_url;
  return (
    <CraftSection name="LocationBlock">
      {hasContent ? (
        <EventLocationBlock {...props} />
      ) : (
        <Placeholder name="Location (Info)" description="No location or virtual URL provided." />
      )}
    </CraftSection>
  );
};
CraftEventLocationBlock.craft = { 
  displayName: 'EventLocationBlock', 
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
  return (
    <CraftSection name="Event Hero">
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-xl md:text-3xl font-bold">{props.event?.title || 'Untitled Event'}</h3>
        </div>
        
        <div className="flex flex-col gap-4 opacity-50 pointer-events-none">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-md bg-accent-400/10 border border-accent-400/20 flex flex-col items-center justify-center shrink-0">
               <span className="text-[10px] uppercase font-bold text-accent-500">Mar</span>
               <span className="text-sm font-bold">25</span>
            </div>
            <div className="flex flex-col">
               <p className="text-sm font-medium">Wednesday, March 25</p>
               <p className="text-xs text-tertiary">07:00 PM - 08:00 PM GMT+7</p>
            </div>
          </div>
        </div>
      </div>
    </CraftSection>
  );
};
CraftEventHero.craft = { 
  displayName: 'EventHero', 
  rules: { canDrag: () => true },
  related: {
    settings: AboutSettings
  }
};

export const CraftEventSidebarImage = (props: any) => {
  return (
    <CraftSection name="Event Image">
       {props.event?.new_new_photos_expanded?.[0] ? (
            <img
              src={generateUrl(props.event.new_new_photos_expanded[0], EDIT_KEY.EVENT_PHOTO)}
              alt={props.event.title}
              loading="lazy"
              className="aspect-square object-contain border rounded-md"
            />
          ) : (
            <img className="aspect-square object-contain border rounded-md" src={randomEventDP()} alt="Event cover" />
          )}
    </CraftSection>
  );
};
CraftEventSidebarImage.craft = { displayName: 'EventSidebarImage', rules: { canDrag: () => true } };

export const resolver = {
  Container,
  Grid,
  Col,
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
