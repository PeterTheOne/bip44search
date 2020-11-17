module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    'no-console': 0,
    'no-use-before-define': 0,
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        'ts': 'never'
      }
    ],
    'max-len': ["error", { "code": 120 }],
  },
  settings: {
    'import/resolver': {
      'node': {
        'extensions': [
          '.ts',
        ]
      },
    },
  }
};
