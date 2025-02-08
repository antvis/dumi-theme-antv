module.exports = {
  extends: require.resolve('@umijs/lint/dist/config/eslint'),
  rules: {
    'no-unused-vars': ['error', { varsIgnorePattern: 'React' }],
  },
};
