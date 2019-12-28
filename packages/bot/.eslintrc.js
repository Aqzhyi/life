module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier',
  ],
  env: {
    node: true,
  },
  ecmaFeatures: {
    jsx: true,
    modules: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {},
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parserOptions: {
        extraFileExtensions: ['.ts', '.tsx'],
        project: './tsconfig.json',
      },
    },
    {
      files: ['webpack.config.ts'],
      parserOptions: {
        extraFileExtensions: ['.ts', '.tsx'],
        project: './tsconfig-webpack.json',
      },
    },
    {
      files: ['**/*.test.js'],
      env: {
        jest: true,
      },
    },
  ],
}
