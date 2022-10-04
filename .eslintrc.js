// eslint-disable-next-line no-undef
module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:@typescript-eslint/recommended', 'next'],
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
}
