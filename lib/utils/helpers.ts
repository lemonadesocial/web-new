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

export function copy(text: string, callback = () => {}) {
  if (!navigator.clipboard) {
    copyFallback(text);
    callback();
    return;
  }

  navigator.clipboard.writeText(text).then(callback);
}

function copyFallback(text: string) {
  const textArea = document.createElement('textarea');
  textArea.value = text;

  textArea.style.top = '-999px';
  textArea.style.left = '-999px';
  textArea.style.position = 'fixed';

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  document.execCommand('copy');

  document.body.removeChild(textArea);
}
