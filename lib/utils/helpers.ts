export function isObjectId(_id: string) {
  return _id.match(/^[a-f\d]{24}$/);
}

export const log = {
  warn: ({ message }: { message: string }) => {
    console.warn('\x1b[33m', `[WARN] - ${message}`);
  },
  error: ({ message }: { message: string; exit?: boolean }) => {
    console.error('\x1b[31m', `[ERROR] - ${message}`);
    // if (exit && !process.env.NODE_ENV) process.exit(0);
  },
};

export function getEventAddress(address?: Address | undefined, short?: boolean) {
  if (!address) return;

  if (short) return [address.title, address.city || address.region, address.country].filter(Boolean).join(', ');

  return [
    address.title,
    address.street_1,
    address.street_2,
    address.postal,
    address.city,
    address.region,
    address.country,
    address.additional_directions,
  ]
    .filter(Boolean)
    .join(', \n');
}
