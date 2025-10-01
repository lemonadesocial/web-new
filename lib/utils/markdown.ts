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
  return typeof result === 'string' ? result : result.toString();
};

export const htmlToMarkdown = (html: string): string => {
  if (!html) return '';
  return turndownService.turndown(html);
};
