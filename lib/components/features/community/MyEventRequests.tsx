import { Accordion, Divider } from '$lib/components/core';
import { GetMySpaceEventRequestsDocument } from '$lib/generated/backend/graphql';
import { useQuery } from '$lib/request';

export function MyEventRequests({ spaceId }: { spaceId?: string }) {
  const { data } = useQuery(GetMySpaceEventRequestsDocument, {
    variables: { space: spaceId, skip: 0, limit: 100 },
    skip: !spaceId,
    fetchPolicy: 'cache-and-network',
  });

  const eventRequests =
    data?.getMySpaceEventRequests.records.filter((item) => item.state === 'pending' && item.event_expanded) || [];

  if (!eventRequests.length) return null;

  return (
    <Accordion.Root color="warning">
      <Accordion.Header>
        <p className="text-sm md:text-base">
          You have {eventRequests.length} events pending approval by the community admin.
        </p>
        <span className="text-xs md:text-sm">They will show up on the schedule once approved</span>
      </Accordion.Header>
      <Accordion.Content>
        {eventRequests.map((item, idx) => (
          <div key={item._id}>
            <p>{item.event_expanded?.title}</p>
            {idx < eventRequests.length - 1 && <Divider className="my-2" />}
          </div>
        ))}
      </Accordion.Content>
    </Accordion.Root>
  );
}
