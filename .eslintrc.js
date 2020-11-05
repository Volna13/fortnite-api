module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: ['airbnb-base', 'prettier'],
  parserOptions: {
    ecmaVersion: 12,
  },
  plugins: ['eslint-plugin-prettier'],
  rules: {
    'prettier/prettier': ['error'],
    'no-use-before-define': ['error', { functions: false, classes: false }],
    // 'no-shadow': ['error', { builtinGlobals: false, hoist: 'functions', allow: [] }],
    'no-shadow': [1, { builtinGlobals: false, hoist: 'functions', allow: [] }],
  },
};
