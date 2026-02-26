import path from 'path';

const toRelativePaths = (filenames) => filenames.map((f) => path.relative(process.cwd(), f));
const shellQuote = (value) => `'${value.replace(/'/g, `'\\''`)}'`;
const toQuotedRelativePaths = (filenames) => toRelativePaths(filenames).map(shellQuote);
const buildPrettierCommand = (filenames) => `prettier --write ${toQuotedRelativePaths(filenames).join(' ')}`;
const buildOxlintCommand = (filenames) => `oxlint --fix ${toQuotedRelativePaths(filenames).join(' ')}`;

export default {
  '*.{js,jsx,ts,tsx}': [buildPrettierCommand, buildOxlintCommand],
};
