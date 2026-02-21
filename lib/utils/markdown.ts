import DOMPurify from 'dompurify';
import { marked } from 'marked';
import TurndownService from 'turndown';

const turndownService = new TurndownService({
  headingStyle: 'atx',
  bulletListMarker: '-',
  codeBlockStyle: 'fenced',
  emDelimiter: '*',
  strongDelimiter: '**',
});

export const markdownToHtml = (markdown: string): string => {
  if (!markdown) return '';
  const result = marked(markdown);
  const html = typeof result === 'string' ? result : result.toString();
  return DOMPurify.sanitize(html);
};

export const htmlToMarkdown = (html: string): string => {
  if (!html) return '';
  return turndownService.turndown(html);
};
