import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['**/dist/**', '**/coverage/**'] },
  eslintConfigPrettier,
  {
    extends: [eslint.configs.recommended, tseslint.configs.recommended],
    files: [
      './src/**/*.ts',
      './src/**/*.mts',
      './src/**/*.js',
      './src/**/*.mjs',
    ],
    ignores: ['eslint.config.mjs'],
    plugins: { '@typescript-eslint': tseslint.plugin },
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.node },
      parserOptions: { project: './tsconfig.json' },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-require-imports': 'warn',
      '@typescript-eslint/ban-ts-comment': 'warn',
      'prefer-const': 'warn',
      quotes: ['warn', 'single', { avoidEscape: true }],
    },
  },
);
