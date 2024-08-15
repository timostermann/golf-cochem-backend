const isWIP = () => {
  return (
    typeof process.env.COMMIT_MESSAGE === 'string' &&
    process.env.COMMIT_MESSAGE.toLocaleLowerCase().startsWith('wip')
  );
};

module.exports = {
  '*.{json,js,jsx,ts,tsx}': 'prettier --write',
  '*.{js,jsx,ts,tsx}': 'npm run eslint -- --fix',
  '*.{ts,tsx}': () => {
    if (isWIP()) return 'true';
    return 'tsc --noEmit';
  },
  '*.{js,jsx,ts,tsx}': (filenames) => {
    if (isWIP()) return 'true';
    return `npm test -- --findRelatedTests --passWithNoTests ${filenames.map((filename) => `'${filename}'`)}`;
  },
};
