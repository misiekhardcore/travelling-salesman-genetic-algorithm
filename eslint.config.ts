import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import { defineConfig, globalIgnores } from 'eslint/config';
import tsParser from '@typescript-eslint/parser';
import testingLibrary from 'eslint-plugin-testing-library';
import prettier from 'eslint-plugin-prettier';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import type { Linter, ESLint } from 'eslint';
import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import globals from 'globals';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  {
    languageOptions: {
      parser: tsParser,
      sourceType: 'module',
      parserOptions: {
        project: ['tsconfig.json'],
      },
      globals: {
        ...globals.browser,
        ...globals.jest,
      },
    },

    plugins: {
      'testing-library': testingLibrary,
      prettier,
      '@typescript-eslint': typescriptEslint as unknown as ESLint.Plugin,
    },

    rules: {
      ...eslint.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      'prettier/prettier': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
  ...compat.extends(
    'next/core-web-vitals',
    'next/typescript',
    'next',
    'plugin:@typescript-eslint/recommended'
  ),
  globalIgnores([
    '**/jest.config.js',
    '**/cypress.config.ts',
    '**/jest.setup.js',
    '**/lint-staged.config.js',
    '**/next.config.js',
    '.next',
    '.yarn',
    '.swc',
    'node_modules',
  ]),
] satisfies Linter.Config[]);
