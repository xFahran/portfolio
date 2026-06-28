import js from '@eslint/js';

const browserGlobals = {
  document: 'readonly',
  window: 'readonly',
  Element: 'readonly',
  Error: 'readonly',
  HTMLAnchorElement: 'readonly',
  HTMLButtonElement: 'readonly',
  HTMLElement: 'readonly',
  HTMLInputElement: 'readonly',
  IntersectionObserver: 'readonly',
  Math: 'readonly',
  Node: 'readonly',
  Number: 'readonly',
  URL: 'readonly',
  console: 'readonly',
  navigator: 'readonly',
  performance: 'readonly'
};

const nodeGlobals = {
  console: 'readonly',
  process: 'readonly'
};

export default [
  js.configs.recommended,
  {
    files: ['src/**/*.js', 'tests/**/*.js'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: browserGlobals
    },
    rules: {
      eqeqeq: ['error', 'always'],
      'no-var': 'error',
      'prefer-const': 'error'
    }
  },
  {
    files: ['*.config.js', '.eleventy.js', 'scripts/**/*.js'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: nodeGlobals
    }
  }
];
