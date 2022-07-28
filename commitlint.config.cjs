const baseScopes = [
  'http-middleware',
  'http-v1',
  'http-v1-controllers',
  'http-v1-routes',
  'kube',
  'deploy',
  'submodules',
]
const subbaseScopes = ['testing', 'staging']

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      2,
      'always',
      [
        ...baseScopes
          .map((scope) => [
            ...subbaseScopes.map((sub) => `${scope}:${sub}`),
            scope,
          ])
          .flat(),
        ...subbaseScopes,
      ],
    ],
  },
}
