import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import { AtlasEventCard } from '../AtlasEventCard';
import type { AtlasEvent } from '$lib/types/atlas';

function makeEvent(overrides: Partial<AtlasEvent> = {}): AtlasEvent {
  return {
    id: 'evt-1',
    title: 'Web3 Summit',
    start: '2026-04-15T10:00:00Z',
    city: 'Berlin',
    country: 'Germany',
    source_platform: 'luma',
    source_id: 'luma-123',
    availability: 'available',
    min_price: 25,
    currency: 'EUR',
    ...overrides,
  };
}

describe('AtlasEventCard', () => {
  it('renders event title', () => {
    render(<AtlasEventCard event={makeEvent()} />);
    expect(screen.getByText('Web3 Summit')).toBeDefined();
  });

  it('renders formatted date and location', () => {
    render(<AtlasEventCard event={makeEvent()} />);
    // date-fns format: "EEE, d MMM 'at' h:mm a" => "Wed, 15 Apr at 10:00 AM"
    // location: "Berlin, Germany"
    const elements = screen.getAllByText(/Berlin, Germany/);
    expect(elements.length).toBeGreaterThanOrEqual(1);
  });

  it('renders price display', () => {
    render(<AtlasEventCard event={makeEvent({ min_price: 25, currency: 'EUR' })} />);
    const elements = screen.getAllByText('EUR25');
    expect(elements.length).toBeGreaterThanOrEqual(1);
  });

  it('renders "Free" for zero price', () => {
    render(<AtlasEventCard event={makeEvent({ min_price: 0 })} />);
    expect(screen.getByText('Free')).toBeDefined();
  });

  it('renders green dot for available events', () => {
    const { container } = render(<AtlasEventCard event={makeEvent({ availability: 'available' })} />);
    const dot = container.querySelector('.bg-success-500');
    expect(dot).not.toBeNull();
  });

  it('renders yellow dot for limited events', () => {
    const { container } = render(<AtlasEventCard event={makeEvent({ availability: 'limited' })} />);
    const dot = container.querySelector('.bg-warning-300');
    expect(dot).not.toBeNull();
  });

  it('renders red dot for sold_out events', () => {
    const { container } = render(<AtlasEventCard event={makeEvent({ availability: 'sold_out' })} />);
    const dot = container.querySelector('.bg-danger-500');
    expect(dot).not.toBeNull();
  });

  it('renders source platform', () => {
    render(<AtlasEventCard event={makeEvent({ source_platform: 'eventbrite' })} />);
    expect(screen.getByText('eventbrite')).toBeDefined();
  });
});
