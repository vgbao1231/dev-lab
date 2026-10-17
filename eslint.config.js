import js from '@eslint/js';
import astro from 'eslint-plugin-astro';
import jsxA11y from 'eslint-plugin-jsx-a11y-x';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    name: 'dev-lab/ignores',
    ignores: ['**/node_modules/**', '**/dist/**', '**/.astro/**'],
  },
  {
    name: 'dev-lab/language-options',
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  js.configs.recommended,
  tseslint.configs.recommended,

  // .astro: parser, biến toàn cục riêng của Astro và bộ rule cơ bản
  astro.configs.recommended,
  astro.configs['jsx-a11y-recommended'],

  {
    name: 'dev-lab/typescript',
    files: ['**/*.{ts,tsx,astro}'],
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      eqeqeq: ['error', 'always'],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },

  {
    name: 'dev-lab/react',
    files: ['**/*.{jsx,tsx}'],
    plugins: {
      ...reactHooks.configs.flat['recommended-latest'].plugins,
      ...jsxA11y.configs.recommended.plugins,
    },
    rules: {
      ...reactHooks.configs.flat['recommended-latest'].rules,
      ...jsxA11y.configs.recommended.rules,
    },
  },

  {
    name: 'dev-lab/config-files',
    files: ['**/*.config.{js,mjs,ts}', '**/astro.config.mjs'],
    rules: {
      'no-console': 'off',
    },
  },
);
