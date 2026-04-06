import React from 'react';
import { useNode, useEditor } from '@craftjs/core';
import { AboutSection } from '$lib/components/features/event/AboutSection';
import { LocationSection } from '$lib/components/features/event/LocationSection';
import { EventAccess } from '$lib/components/features/event-access/EventAccess';
import { EventCollectibles } from '$lib/components/features/event-collectibles/EventCollectibles';
import { SubEventSection } from '$lib/components/features/event/SubEventSection';
import { GallerySection } from '$lib/components/features/event/GallerySection';
import { Button } from '$lib/components/core';

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
      className="relative group/section w-full p-3"
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
