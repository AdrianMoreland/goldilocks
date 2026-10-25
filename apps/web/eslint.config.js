import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      'dist',
      'eslint.config.js',
      // Unused template pages and the old admin scaffold (docs/ENGINEERING.md §1): not part of the product.
      'src/app/{mail,chat,calendar,tasks,dashboard-2,landing,users,faqs,pricing,errors,settings}/**',
      'src/app/auth/{sign-in-2,sign-in-3,sign-up,sign-up-2,sign-up-3,forgot-password,forgot-password-2,forgot-password-3}/**',
      'src/admin/**',
      // Dead files, listed in the roadmap for deletion (0.1).
      'src/dev/useInitial.ts',
      'src/hooks/use-metal-spot-prices.hook.ts',
      'src/hooks/use-metals.hook.ts',
      // shadcn-generated primitives.
      'src/components/ui/**',
    ],
  },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/no-explicit-any': 'warn',
      // `_name` marks an argument/variable that is deliberately unused.
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrors: 'none' },
      ],
      // React Compiler-era rules: they flag patterns that work today, and fixing them means refactoring
      // working product UI. Reported as warnings until each file is touched anyway (roadmap 0.14).
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/purity': 'warn',
      'react-hooks/refs': 'warn',
      'react-hooks/immutability': 'warn',
      'react-hooks/preserve-manual-memoization': 'warn',
      'react-hooks/static-components': 'warn',
      'react-hooks/incompatible-library': 'warn',
    },
  },
);
