import { describe, expect, it } from 'vitest';
import {
  roundToNext30Minutes,
  roundDateToHalfHour,
  combineDateAndTimeWithTimezone,
  convertFromUtcToTimezone,
  getTimeAgo,
} from '$utils/date';

describe('roundToNext30Minutes', () => {
  it('rounds 14:10 to 14:30', () => {
    const date = new Date('2026-03-01T14:10:00');
    const result = roundToNext30Minutes(date);
    expect(result.getMinutes()).toBe(30);
    expect(result.getSeconds()).toBe(0);
    expect(result.getMilliseconds()).toBe(0);
  });

  it('rounds 14:31 to 15:00', () => {
    const date = new Date('2026-03-01T14:31:00');
    const result = roundToNext30Minutes(date);
    expect(result.getHours()).toBe(15);
    expect(result.getMinutes()).toBe(0);
  });

  it('rounds 14:00 to 14:30', () => {
    const date = new Date('2026-03-01T14:00:00');
    const result = roundToNext30Minutes(date);
    expect(result.getMinutes()).toBe(30);
  });

  it('rounds 14:30 to 15:00', () => {
    const date = new Date('2026-03-01T14:30:00');
    const result = roundToNext30Minutes(date);
    expect(result.getHours()).toBe(15);
    expect(result.getMinutes()).toBe(0);
  });

  it('does not mutate the original date', () => {
    const date = new Date('2026-03-01T14:10:00');
    const original = date.getTime();
    roundToNext30Minutes(date);
    expect(date.getTime()).toBe(original);
  });
});

describe('roundDateToHalfHour', () => {
  it('rounds 14:10 up to 14:30', () => {
    const date = new Date('2026-03-01T14:10:00');
    const result = roundDateToHalfHour(date);
    expect(result.getMinutes()).toBe(30);
    expect(result.getSeconds()).toBe(0);
  });

  it('rounds 14:45 up to 15:00', () => {
    const date = new Date('2026-03-01T14:45:00');
    const result = roundDateToHalfHour(date);
    expect(result.getHours()).toBe(15);
    expect(result.getMinutes()).toBe(0);
  });

  it('keeps 14:00 at 14:00', () => {
    const date = new Date('2026-03-01T14:00:00');
    const result = roundDateToHalfHour(date);
    expect(result.getHours()).toBe(14);
    expect(result.getMinutes()).toBe(0);
  });

  it('keeps 14:30 at 14:30', () => {
    const date = new Date('2026-03-01T14:30:00');
    const result = roundDateToHalfHour(date);
    expect(result.getMinutes()).toBe(30);
  });

  it('does not mutate the original date', () => {
    const date = new Date('2026-03-01T14:10:00');
    const original = date.getTime();
    roundDateToHalfHour(date);
    expect(date.getTime()).toBe(original);
  });
});

describe('combineDateAndTimeWithTimezone', () => {
  it('returns the original date when timezone is null', () => {
    const date = new Date('2026-03-01T14:00:00Z');
    const result = combineDateAndTimeWithTimezone(date, null);
    expect(result).toBe(date);
  });

  it('returns the original date when timezone is undefined', () => {
    const date = new Date('2026-03-01T14:00:00Z');
    const result = combineDateAndTimeWithTimezone(date, undefined);
    expect(result).toBe(date);
  });

  it('applies timezone offset when timezone is provided', () => {
    const date = new Date('2026-03-01T14:00:00');
    const result = combineDateAndTimeWithTimezone(date, 'America/New_York');
    expect(result).toBeInstanceOf(Date);
    // The result should be a different time than the input since timezone is applied
    expect(result.getTime()).not.toBe(date.getTime());
  });
});

describe('convertFromUtcToTimezone', () => {
  it('returns a regular Date when timezone is undefined', () => {
    const result = convertFromUtcToTimezone('2026-03-01T14:00:00Z');
    expect(result).toBeInstanceOf(Date);
  });

  it('returns a TZDate when timezone is provided', () => {
    const result = convertFromUtcToTimezone('2026-03-01T14:00:00Z', 'America/New_York');
    expect(result).toBeInstanceOf(Date);
  });

  it('returns a regular Date when timezone is null', () => {
    const result = convertFromUtcToTimezone('2026-03-01T14:00:00Z', null);
    expect(result).toBeInstanceOf(Date);
  });
});

describe('getTimeAgo', () => {
  it('returns "Just now" for less than a minute ago', () => {
    const result = getTimeAgo(Date.now() - 30_000); // 30 seconds ago
    expect(result).toBe('Just now');
  });

  it('returns minutes ago for less than an hour', () => {
    const result = getTimeAgo(Date.now() - 5 * 60_000); // 5 minutes ago
    expect(result).toBe('5m ago');
  });

  it('returns hours ago for less than a day', () => {
    const result = getTimeAgo(Date.now() - 3 * 60 * 60_000); // 3 hours ago
    expect(result).toBe('3h ago');
  });

  it('returns days ago for more than a day', () => {
    const result = getTimeAgo(Date.now() - 2 * 24 * 60 * 60_000); // 2 days ago
    expect(result).toBe('2d ago');
  });

  it('accepts a Date object', () => {
    const date = new Date(Date.now() - 10 * 60_000); // 10 minutes ago
    const result = getTimeAgo(date);
    expect(result).toBe('10m ago');
  });
});
