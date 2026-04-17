'use client';
import React from 'react';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';

import {
  Event,
  GetEventDocument,
  GetEventQuery,
  GetPageConfigDocument,
  GetPageConfigQuery,
  PageConfigFragmentFragmentDoc,
  PageConfigOwnerType,
} from '$lib/graphql/generated/backend/graphql';
import { PageEditorProvider, usePageEditor } from '$lib/components/features/page-builder/context';
import { PageRenderer } from '$lib/components/features/page-builder/renderer';
import { useFragment } from '$lib/graphql/generated/backend/fragment-masking';
import { useQuery } from '$lib/graphql/request';
import { Badge, Button, Spacer } from '$lib/components/core';
import { EDIT_KEY, generateUrl } from '$lib/utils/cnd';
import { getEventCohosts, hosting, isAttending, isPromoter } from '$lib/utils/event';
import { useEventTheme } from '$lib/components/features/theme-builder/provider';

import { EventThemeBuilder } from '$lib/components/features/theme-builder/EventThemeBuilder';
import { randomEventDP } from '$lib/utils/user';

import { AboutSection } from './AboutSection';
import { LocationSection } from './LocationSection';
import { SubEventSection } from './SubEventSection';
import { GallerySection } from './GallerySection';
import { CommunitySection } from './CommunitySection';
import { HostedBySection } from './HostedBySection';

import { EventAccess } from '../event-access';
import { EventDateTimeBlock } from './EventDateTimeBlock';
import { EventLocationBlock } from './EventLocationBlock';
import { AttendeesSection } from './AttendeesSection';
import { PendingCohostRequest } from './PendingCohostRequest';
import { useMe } from '$lib/hooks/useMe';
import { useTracker } from '$lib/hooks/useTracker';
import { EventCollectibles } from '../event-collectibles';
import { DEFAULT_LAYOUT_SECTIONS } from '$lib/utils/constants';

import { CraftableEventSections } from '../ai/manage/craft/CraftableEventSections';
import { resolver } from '../ai/manage/craft/resolver';
import { storeManageLayout } from '../ai/manage/store';
import { sectionsToNodes, type PageSection } from '$utils/page-sections-mapper';

function ReadOnlyPageView({ data, className }: { data: Record<string, any>; className?: string }) {
  const { actions } = usePageEditor();
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    actions.deserialize(JSON.stringify(data));
    setReady(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!ready) return null;
  return (
    <div className={className}>
      <PageRenderer resolver={resolver} />
    </div>
  );
}

export function EventGuestSide({
  event: initEvent,
  pageConfig,
  autoSave = true,
  isEditable = false,
}: {
  event: Event;
  pageConfig?: GetPageConfigQuery['getPageConfig'];
  autoSave?: boolean;
  isEditable?: boolean;
}) {
  const { data } = useQuery(GetEventDocument, {
    variables: { id: initEvent._id },
    initData: { getEvent: initEvent } as unknown as GetEventQuery,
  });

  useTracker(initEvent._id);

  return (
    <EventGuestSideContent
      event={(data?.getEvent as Event) || initEvent}
      pageConfig={pageConfig}
      autoSave={autoSave}
      isEditable={isEditable}
    />
  );
}

export function EventGuestSideContent({
  event,
  pageConfig: initPageConfig,
  autoSave: _autoSave = true,
  isEditable = false,
}: {
  event: Event;
  pageConfig?: GetPageConfigQuery['getPageConfig'];
  autoSave?: boolean;
  isEditable?: boolean;
}) {
  const [state] = useEventTheme();
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  React.useEffect(() => {
    if (event) {
      storeManageLayout.setData(event);
    }
  }, [event]);

  const { data: pageConfigData } = useQuery(GetPageConfigDocument, {
    variables: { ownerType: PageConfigOwnerType.Event, ownerId: event._id },
    initData: { getPageConfig: initPageConfig } as GetPageConfigQuery,
    // Skip client-side refetch when SSR already provided the page config (including null = confirmed no config).
    // Prevents the client fetch from overwriting valid SSR data with a potentially unauthenticated null response.
    skip: !event?._id || isEditable || initPageConfig !== undefined,
  });
  const pageConfig = pageConfigData?.getPageConfig;
  const pageConfigFields = useFragment(PageConfigFragmentFragmentDoc, pageConfig);

  const formattedStructureData = React.useMemo(() => {
    const sections = pageConfigFields?.sections;
    if (!sections?.length) return null;
    try {
      return sectionsToNodes(sections as unknown as PageSection[]);
    } catch {
      return null;
    }
  }, [pageConfigFields]);

  React.useEffect(() => {
    if (formattedStructureData || isEditable) {
      storeManageLayout.setFullScreen(true);
    } else {
      storeManageLayout.setFullScreen(false);
    }

    // Reset fullScreen when component unmounts
    return () => storeManageLayout.setFullScreen(false);
  }, [formattedStructureData, isEditable]);

  const me = useMe();

  const isHost = me?._id && event && hosting(event, me._id);
  const isUserPromoter = me?._id && event && isPromoter(event, me._id);
  const attending = me?._id ? isAttending(event, me._id) : false;
  const hosts = getEventCohosts(event);

  const router = useRouter();

  const renderSections = () => {
    return (event.layout_sections || DEFAULT_LAYOUT_SECTIONS).map((item) => {
      switch (item.id) {
        case 'registration':
          return event ? <EventAccess key={item.id} event={event} /> : null;
        case 'about':
          return <AboutSection key={item.id} event={event} />;
        case 'collectibles':
          return attending ? <EventCollectibles key={item.id} event={event} /> : null;
        case 'location':
          return <LocationSection key={item.id} event={event} />;

        default:
          return null;
      }
    });
  };

  const renderContent = () => {
    if (isEditable && isClient && event && formattedStructureData) {
      return <CraftableEventSections data={formattedStructureData} />;
    }

    if (formattedStructureData && isClient) {
      return (
        <PageEditorProvider enabled={false}>
          <ReadOnlyPageView
            data={formattedStructureData}
            className={clsx(state.theme, state.config.name, state.config.color, state.config.mode)}
          />
        </PageEditorProvider>
      );
    }

    return (
      <div className={clsx('flex gap-18', state.theme, state.config.name, state.config.color, state.config.mode)}>
        <div className="hidden md:flex w-74 flex-col gap-6">
          <div className="flex flex-col gap-4">
            {event.new_new_photos_expanded?.[0] ? (
              <img
                src={generateUrl(event.new_new_photos_expanded[0], EDIT_KEY.EVENT_PHOTO)}
                alt={event.title}
                loading="lazy"
                className="aspect-square object-contain border rounded-md"
              />
            ) : (
              <img className="aspect-square object-contain border rounded-md" src={randomEventDP()} alt="Event cover" />
            )}

            {isHost && (
              <>
                <EventThemeBuilder eventId={event._id} autoSave={false} />
                <div className="flex gap-2 items-center px-3.5 py-2 border border-card-border bg-accent-400/16 rounded-md">
                  <p className="text-accent-500">You have manage access for this event.</p>
                  <Button
                    variant="primary"
                    size="sm"
                    iconRight="icon-arrow-outward"
                    className="rounded-full"
                    onClick={() => router.push(`/e/manage/${event.shortid}`)}
                  >
                    Manage
                  </Button>
                </div>
              </>
            )}

            {isUserPromoter && (
              <div className="flex gap-2 items-center px-3.5 py-2 border border-card-border bg-accent-400/16 rounded-md">
                <p className="text-accent-500">You have check in access for this event.</p>
                <Button
                  variant="primary"
                  size="sm"
                  iconRight="icon-arrow-outward"
                  className="rounded-full"
                  onClick={() => window.open(`/e/check-in/${event.shortid}`, '_blank')}
                >
                  Check In
                </Button>
              </div>
            )}
          </div>

          <PendingCohostRequest event={event} />
          <CommunitySection event={event} />
          <HostedBySection event={event} />
          <AttendeesSection event={event} />
        </div>

        <div className="flex-1 flex flex-col gap-6 w-full">
          <div className="block md:hidden">
            {event.new_new_photos_expanded?.[0] ? (
              <img
                src={generateUrl(event.new_new_photos_expanded[0], EDIT_KEY.EVENT_PHOTO)}
                alt={event.title}
                loading="lazy"
                className="aspect-square object-contain border rounded-md"
              />
            ) : (
              <img className="aspect-square object-contain border rounded-md" src={randomEventDP()} alt="Event cover" />
            )}

            {isHost && (
              <>
                <Spacer className="h-4" />
                <div className="flex flex-col gap-4">
                  <EventThemeBuilder eventId={event._id} autoSave={false} />
                  <div className="flex gap-2 items-center px-3.5 py-2 border border-card-border bg-accent-400/16 rounded-md">
                    <p className="text-accent-500">You have manage access for this event.</p>
                    <Button
                      variant="primary"
                      size="sm"
                      iconRight="icon-arrow-outward"
                      className="rounded-full"
                      onClick={() => router.push(`/e/manage/${event.shortid}`)}
                    >
                      Manage
                    </Button>
                  </div>
                </div>
              </>
            )}

            {isUserPromoter && (
              <div className="flex gap-2 items-center px-3.5 py-2 border border-card-border bg-accent-400/16 rounded-md">
                <p className="text-accent-500">You have check in access for this event.</p>
                <Button
                  variant="primary"
                  size="sm"
                  iconRight="icon-arrow-outward"
                  className="rounded-full"
                  onClick={() => window.open(`/e/check-in/${event.shortid}`, '_blank')}
                >
                  Check In
                </Button>
              </div>
            )}

            {event.private && (
              <>
                <Spacer className="h-6" />
                <Badge className="bg-gradient-to-r from-accent-500/16 to-warning-500/16">
                  <div className="bg-gradient-to-r from-accent-500 to-warning-500 bg-clip-text flex items-center gap-1">
                    <i
                      aria-hidden="true"
                      className="icon-sparkles size-3.5 bg-gradient-to-r from-accent-500 to-accent-500/70 "
                    />
                    <span className="text-transparent bg-clip-text">Private Event</span>
                  </div>
                </Badge>
              </>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="text-xl md:text-3xl font-bold">{event.title}</h3>

            {!!hosts.length && (
              <p className="md:hidden text-secondary text-sm">
                Hosted By{' '}
                {hosts
                  .map((p) => p.display_name || p.name)
                  .join(', ')
                  .replace(/,(?=[^,]*$)/, ' & ')}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <EventDateTimeBlock event={event} />
            <EventLocationBlock event={event} />
          </div>

          {renderSections()}

          <SubEventSection event={event} />
          <GallerySection event={event} />
          <div className="flex flex-col gap-6 md:hidden">
            <CommunitySection event={event} />
            <AttendeesSection event={event} />
          </div>
          <Spacer className="h-8" />
        </div>
      </div>
    );
  };

  return renderContent();
}
