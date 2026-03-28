import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import prettier from 'eslint-plugin-prettier';
import react from 'eslint-plugin-react';
import globals from 'globals';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: [
      'commitlint.config.js',
      'eslint.config.js',
      'node_modules/**',
      'dist/**',
      'build/**',
    ],
  },

  ...compat.extends(
    'airbnb',
    'airbnb/hooks',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
  ),

  {
    files: ['**/*.{js,mjs,cjs,jsx}'],

    plugins: {
      react,
      prettier,
    },

    settings: {
      react: {
        version: '19',
      },
    },

    languageOptions: {
      globals: {
        ...globals.browser,
      },

      ecmaVersion: 'latest',
      sourceType: 'module',

      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    rules: {
      'import/no-extraneous-dependencies': 0,
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 0,
      'react/forbid-prop-types': 0,
      'no-underscore-dangle': 0,
      'react/jsx-props-no-spreading': 0,
      'react/jsx-no-bind': 0,
      'import/prefer-default-export': 'off',
      'import/no-unresolved': 'off',
      'no-unused-vars': 2,
      'import/no-named-as-default-member': 'off',
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal'],
          pathGroups: [
            {
              pattern: 'react',
              group: 'external',
              position: 'before',
            },
          ],
          pathGroupsExcludedImportTypes: ['react'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
    },
  },
];
