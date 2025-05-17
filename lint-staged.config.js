module.exports = {
  // Type check TypeScript files
  '**/*.(ts|tsx)': () => 'yarn tsc --noEmit',

  // Lint then format TypeScript and JavaScript files
  '**/*.(ts|tsx|js)': [`eslint --fix`, `prettier --write`],

  // Format style files
  '**/*.(scss)': [`prettier --write`],

  // Format MarkDown and JSON
  '**/*.(md|json)': [`prettier --write`],
};
