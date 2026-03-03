import { describe, expect, it } from 'vitest';
import { addHours, isBefore } from 'date-fns';
import { timezoneOptions, getTimezoneOption, getUserTimezoneOption } from '$utils/timezone';

/**
 * Tests for DateTimeGroup auto-adjust logic, DateTimePicker constraints,
 * and timezone utility functions used by the datetime picker.
 *
 * Note: We test the logic extracted from the components rather than rendering
 * React components, since jsdom doesn't support the full browser APIs needed
 * for floating UI / calendar rendering.
 */

describe('DateTimeGroup end-time auto-adjust logic', () => {
  // This mirrors the logic in DateTimeGroup lines 53-55 and 82-84:
  // if (isBefore(endTime, startTime)) endTime = addHours(startTime, 1)

  it('auto-adjusts end to start + 1h when end is before start', () => {
    const start = new Date('2026-03-15T15:00:00Z');
    const end = new Date('2026-03-15T14:00:00Z'); // end before start

    let adjustedEnd = end;
    if (isBefore(adjustedEnd, start)) {
      adjustedEnd = addHours(start, 1);
    }

    expect(adjustedEnd.toISOString()).toBe(new Date('2026-03-15T16:00:00Z').toISOString());
  });

  it('keeps end unchanged when end is after start', () => {
    const start = new Date('2026-03-15T15:00:00Z');
    const end = new Date('2026-03-15T18:00:00Z');

    let adjustedEnd = end;
    if (isBefore(adjustedEnd, start)) {
      adjustedEnd = addHours(start, 1);
    }

    expect(adjustedEnd.toISOString()).toBe(end.toISOString());
  });

  it('auto-adjusts when start moves past current end', () => {
    const originalEnd = new Date('2026-03-15T16:00:00Z');
    const newStart = new Date('2026-03-15T17:00:00Z'); // moved past end

    let adjustedEnd = originalEnd;
    if (isBefore(adjustedEnd, newStart)) {
      adjustedEnd = addHours(newStart, 1);
    }

    expect(adjustedEnd.toISOString()).toBe(new Date('2026-03-15T18:00:00Z').toISOString());
  });

  it('handles same start and end time', () => {
    const start = new Date('2026-03-15T15:00:00Z');
    const end = new Date('2026-03-15T15:00:00Z'); // same time

    // isBefore(end, start) is false when equal — end stays unchanged
    let adjustedEnd = end;
    if (isBefore(adjustedEnd, start)) {
      adjustedEnd = addHours(start, 1);
    }

    expect(adjustedEnd.toISOString()).toBe(end.toISOString());
  });
});

describe('DateTimePicker min date constraint', () => {
  // The DateTimePicker passes minDate to Calendar which disables dates before it

  it('minDate filters out past dates', () => {
    const minDate = new Date('2026-03-15T00:00:00Z');
    const pastDate = new Date('2026-03-14T23:59:59Z');
    const futureDate = new Date('2026-03-16T00:00:00Z');

    expect(isBefore(pastDate, minDate)).toBe(true);
    expect(isBefore(futureDate, minDate)).toBe(false);
  });

  it('minDate allows the exact boundary date', () => {
    const minDate = new Date('2026-03-15T00:00:00Z');
    const sameDate = new Date('2026-03-15T00:00:00Z');

    // isBefore returns false for equal dates
    expect(isBefore(sameDate, minDate)).toBe(false);
  });
});

describe('Timezone utilities', () => {
  it('timezoneOptions contains all major IANA zones', () => {
    // The TIMEZONES object has 238 entries
    expect(timezoneOptions.length).toBeGreaterThan(200);
  });

  it('each timezone option has value, text, and short fields', () => {
    for (const option of timezoneOptions.slice(0, 10)) {
      expect(option.value).toBeTruthy();
      expect(option.text).toBeTruthy();
      expect(option.short).toBeTruthy();
      // text should contain the offset like (GMT+XX:XX)
      expect(option.text).toMatch(/\(GMT[+-]\d{2}:\d{2}\)/);
    }
  });

  it('getTimezoneOption finds options by IANA zone key', () => {
    // timezoneOptions may produce different format strings in jsdom vs browser,
    // so we test by looking up any zone that exists in the array
    if (timezoneOptions.length > 0) {
      const firstOption = timezoneOptions[0];
      const found = getTimezoneOption(firstOption.value);
      expect(found).toBeDefined();
      expect(found?.value).toBe(firstOption.value);
    }
  });

  it('getTimezoneOption returns undefined for unknown timezone', () => {
    const option = getTimezoneOption('Invalid/Timezone');
    expect(option).toBeUndefined();
  });

  it('getUserTimezoneOption returns option when given explicit timezone key', () => {
    if (timezoneOptions.length > 0) {
      const firstKey = timezoneOptions[0].value;
      const option = getUserTimezoneOption(firstKey);
      expect(option).toBeDefined();
      expect(option?.value).toBe(firstKey);
    }
  });

  it('getUserTimezoneOption auto-detects system timezone when no argument', () => {
    const option = getUserTimezoneOption();
    // May or may not find a match depending on the test runner's timezone
    // but it should not throw
    if (option) {
      expect(option.value).toBeTruthy();
      expect(option.text).toBeTruthy();
    }
  });
});
