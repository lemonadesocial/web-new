import path from 'path';

const toRelativePaths = (filenames) => filenames.map((f) => path.relative(process.cwd(), f));
const shellQuote = (value) => `'${value.replace(/'/g, `'\\''`)}'`;
const toQuotedRelativePaths = (filenames) => toRelativePaths(filenames).map(shellQuote);
const buildPrettierCommand = (filenames) => `prettier --write ${toQuotedRelativePaths(filenames).join(' ')}`;
const buildEslintCommand = (filenames) =>
  `next lint --fix --file ${toQuotedRelativePaths(filenames).join(' --file ')}`;

export default {
  '*.{js,jsx,ts,tsx}': [buildPrettierCommand, buildEslintCommand],
};
