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
