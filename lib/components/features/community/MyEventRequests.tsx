import { Accordion, Alert, Collapsible } from '$lib/components/core';
import { GetMySpaceEventRequestsDocument } from '$lib/generated/backend/graphql';
import { useQuery } from '$lib/request';

export function MyEventRequests({ spaceId }: { spaceId?: string }) {
  const { data } = useQuery(GetMySpaceEventRequestsDocument, {
    variables: { space: spaceId, skip: 0, limit: 100 },
    skip: !spaceId,
  });

  const eventRequests =
    data?.getMySpaceEventRequests.records.filter((item) => item.state === 'pending' && item.event_expanded) || [];
  console.log(eventRequests);

  if (!eventRequests.length) return null;

  return (
    <Accordion.Root color="warning">
      <Accordion.Header>
        <p>You have ${eventRequests.length} events pending approval by the community admin.</p>
        <span>They will show up on the schedule once approved</span>
      </Accordion.Header>
      <Accordion.Content>
        {eventRequests.map((item) => (
          <div>
            <p>{item.event_expanded?.title}</p>
          </div>
        ))}
      </Accordion.Content>
    </Accordion.Root>
  );
}
