import React from 'react';
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
  <div className="w-full p-6 bg-accent-400/5 border border-dashed border-accent-400/20 rounded-md text-center">
    <p className="text-accent-500 font-medium">{name} Section</p>
    <p className="text-tertiary text-xs">{description || `No data provided for this ${name.toLowerCase()} section.`}</p>
  </div>
);

// Wrapped Versions
export const CraftAboutSection = (props: any) => {
  const hasContent = props.event?.description;
  return hasContent ? <AboutSection {...props} /> : <Placeholder name="About" description="No description provided for this event." />;
};
CraftAboutSection.craft = { displayName: 'AboutSection', related: { settings: AboutSettings } };

export const CraftLocationSection = (props: any) => {
  const hasContent = props.event?.address;
  return hasContent ? <LocationSection {...props} /> : <Placeholder name="Location (Map)" description="No address provided for this event." />;
};
CraftLocationSection.craft = { displayName: 'LocationSection', related: { settings: LocationSettings } };

export const CraftEventAccess = (props: any) => <EventAccess {...props} />;
CraftEventAccess.craft = { displayName: 'EventAccess', related: { settings: RegistrationSettings } };

export const CraftEventCollectibles = (props: any) => <EventCollectibles {...props} />;
CraftEventCollectibles.craft = { displayName: 'EventCollectibles' };

export const CraftSubEventSection = (props: any) => {
  const hasContent = props.event?.subevent_enabled;
  return hasContent ? <SubEventSection {...props} /> : <Placeholder name="Schedule" description="Sub-events are not enabled for this event." />;
};
CraftSubEventSection.craft = { displayName: 'SubEventSection' };

export const CraftGallerySection = (props: any) => {
  const hasContent = props.event?.new_new_photos_expanded?.length > 1;
  return hasContent ? <GallerySection {...props} /> : <Placeholder name="Gallery" description="No photos provided for this event gallery." />;
};
CraftGallerySection.craft = { displayName: 'GallerySection' };

export const CraftEventDateTimeBlock = (props: any) => <EventDateTimeBlock {...props} />;
CraftEventDateTimeBlock.craft = { displayName: 'EventDateTimeBlock', related: { settings: DateTimeSettings } };

export const CraftEventLocationBlock = (props: any) => {
  const hasContent = props.event?.address || props.event?.virtual_url;
  return hasContent ? <EventLocationBlock {...props} /> : <Placeholder name="Location (Info)" description="No location or virtual URL provided." />;
};
CraftEventLocationBlock.craft = { displayName: 'EventLocationBlock', related: { settings: LocationSettings } };

export const CraftCommunitySection = (props: any) => {
  const hasContent = props.event?.space;
  return hasContent ? <CommunitySection {...props} /> : <Placeholder name="Community" description="No community associated with this event." />;
};
CraftCommunitySection.craft = { displayName: 'CommunitySection' };

export const CraftHostedBySection = (props: any) => {
  const hasContent = getEventCohosts(props.event).length > 0;
  return hasContent ? <HostedBySection {...props} /> : <Placeholder name="Hosted By" description="No hosts information available." />;
};
CraftHostedBySection.craft = { displayName: 'HostedBySection' };

export const CraftAttendeesSection = (props: any) => <AttendeesSection {...props} />;
CraftAttendeesSection.craft = { displayName: 'AttendeesSection' };

export const CraftEventHero = (props: any) => {
  return (
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
  );
};
CraftEventHero.craft = { displayName: 'EventHero', related: { settings: AboutSettings } };

export const CraftEventSidebarImage = (props: any) => {
  return (
    <React.Fragment>
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
    </React.Fragment>
  );
};
CraftEventSidebarImage.craft = { displayName: 'EventSidebarImage' };

export const resolver = {
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
