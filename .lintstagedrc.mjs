import path from 'path';

const toRelativePaths = (filenames) => filenames.map((f) => path.relative(process.cwd(), f));
const buildPrettierCommand = (filenames) => `prettier --write ${toRelativePaths(filenames).join(' ')}`;
const buildEslintCommand = (filenames) =>
  `next lint --fix --file ${toRelativePaths(filenames).join(' --file ')}`;

export default {
  '*.{js,jsx,ts,tsx}': [buildPrettierCommand, buildEslintCommand],
};
