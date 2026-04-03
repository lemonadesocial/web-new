import React from 'react';
import { useNode } from '@craftjs/core';
import { AboutSection } from '$lib/components/features/event/AboutSection';
import { LocationSection } from '$lib/components/features/event/LocationSection';
import { EventAccess } from '$lib/components/features/event-access/EventAccess';
import { EventCollectibles } from '$lib/components/features/event-collectibles/EventCollectibles';
import { SubEventSection } from '$lib/components/features/event/SubEventSection';
import { GallerySection } from '$lib/components/features/event/GallerySection';

export const CraftSection = ({ children, name }: { children: React.ReactNode; name?: string }) => {
  const {
    connectors: { connect, drag },
    selected,
    hovered,
  } = useNode((state) => ({
    selected: state.events.selected,
    hovered: state.events.hovered,
  }));

  return (
    <div
      ref={(ref: any) => ref && connect(drag(ref))}
      className="relative group/section w-full p-3"
    >
      {/* Selection/Hover Indicator Overlay */}
      {(selected || hovered) && (
        <div 
          className={`absolute inset-0 z-50 pointer-events-none border-2 rounded-lg transition-colors ${
            selected ? 'border-primary' : 'border-primary/20'
          }`}
        />
      )}
      
      <div className="w-full">
        {children}
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

// Craftable versions of components
export const CraftAboutSection = (props: any) => {
  const hasContent = props.event?.description;
  return (
    <CraftSection name="About">
      {hasContent ? (
        <AboutSection {...props} />
      ) : (
        <div className="p-6 bg-accent-400/5 border border-dashed border-accent-400/20 rounded-md text-center">
          <p className="text-accent-500 font-medium">About Section</p>
          <p className="text-tertiary text-xs">No description provided for this event.</p>
        </div>
      )}
    </CraftSection>
  );
};
CraftAboutSection.craft = { displayName: 'AboutSection', rules: { canDrag: () => true } };

export const CraftLocationSection = (props: any) => (
  <CraftSection name="Location">
    <LocationSection {...props} />
  </CraftSection>
);
CraftLocationSection.craft = { displayName: 'LocationSection', rules: { canDrag: () => true } };

export const CraftEventAccess = (props: any) => (
  <CraftSection name="Registration">
    <EventAccess {...props} />
  </CraftSection>
);
CraftEventAccess.craft = { displayName: 'EventAccess', rules: { canDrag: () => true } };

export const CraftEventCollectibles = (props: any) => (
  <CraftSection name="Collectibles">
    <EventCollectibles {...props} />
  </CraftSection>
);
CraftEventCollectibles.craft = { displayName: 'EventCollectibles', rules: { canDrag: () => true } };

export const CraftSubEventSection = (props: any) => (
  <CraftSection name="Schedule">
    <SubEventSection {...props} />
  </CraftSection>
);
CraftSubEventSection.craft = { displayName: 'SubEventSection', rules: { canDrag: () => true } };

export const CraftGallerySection = (props: any) => (
  <CraftSection name="Gallery">
    <GallerySection {...props} />
  </CraftSection>
);
CraftGallerySection.craft = { displayName: 'GallerySection', rules: { canDrag: () => true } };

export const resolver = {
  Container,
  AboutSection: CraftAboutSection,
  LocationSection: CraftLocationSection,
  EventAccess: CraftEventAccess,
  EventCollectibles: CraftEventCollectibles,
  SubEventSection: CraftSubEventSection,
  GallerySection: CraftGallerySection,
};
