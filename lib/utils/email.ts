export const RECIPIENT_TYPE_MAP = new Map([
  ['assigned', 'Assigned'],
  ['registration', 'Registered'],
  ['invited', 'Invited'],
  ['join_requester', 'Pending applicants'],
  ['event_hosts', 'Hosts'],
  ['attending', 'Attending'],
  ['ticket_cancelled', 'Cancelled'],
  ['ticket_issued', 'Issued'],
  // News Letter
  ['space_subscribers', 'All Subscribers'],
  ['space_admins', 'Admins'],
  ['space_ambassadors', 'Brand Ambassadors'],
  ['space_event_hosts', 'Event Hosts'],
  ['space_event_attendees', 'Event Attendees'],
]);

export const JOIN_REQUEST_STATE_MAP = new Map([
  ['pending', 'Pending Applicants'],
  ['approved', 'Approved Applicants'],
  ['declined', 'Declined Applicants'],
]);
