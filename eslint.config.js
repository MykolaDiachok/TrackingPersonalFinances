module.exports = [
  {
    files: ['*.ts', '*.js'],
    plugins: {
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
      '@angular-eslint': require('@angular-eslint/eslint-plugin'),
      prettier: require('eslint-plugin-prettier'),
      import: require('eslint-plugin-import'),
    },
    rules: {
      semi: 'error',
      'prefer-const': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'error',
      'prettier/prettier': 'error',
    },
    ignores: ['node_modules/', 'dist/', 'src/**/*.spec.ts', 'docs/'],
  },
  {
    files: ['*.ts'],
    extends: [
      'airbnb-base',
      'airbnb-typescript/base',
      'plugin:@typescript-eslint/recommended',
      'plugin:@angular-eslint/recommended',
      'plugin:@angular-eslint/template/process-inline-templates',
    ],
    rules: {
      '@angular-eslint/component-class-suffix': 'error',
      '@angular-eslint/no-empty-lifecycle-method': 'warn',
    },
  },
  {
    files: ['*.html'],
    plugins: {
      '@angular-eslint/template': require('@angular-eslint/eslint-plugin-template'),
    },
    rules: {
      '@angular-eslint/template/no-any': 'error',
      '@angular-eslint/template/banana-in-box': 'warn',
    },
  },
];
