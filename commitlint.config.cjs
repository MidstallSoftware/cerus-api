const baseScopes = ['cache', 'database', 'http', 'http/middleware', 'deploy']
const subScopes = ['staging', 'test']

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      ...baseScopes
        .map((baseScope) =>
          subScopes.map((subScope) => `${baseScope}:${subScope}`)
        )
        .flat(),
      ...baseScopes,
      'staging',
    ],
  },
}
