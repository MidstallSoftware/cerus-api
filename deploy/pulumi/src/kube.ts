import * as k8s from '@pulumi/kubernetes'
import * as pulumi from '@pulumi/pulumi'
import { Configuration } from './config'

import adminer from './components/adminer'
import api from './components/api'
import cache from './components/cache'
import db from './components/db'
import mailhog from './components/mailhog'
import namespace from './components/namespace'

export function createKube(config: Configuration, provider?: k8s.Provider) {
  const dependsOn: pulumi.Resource[] = [
    new pulumi.StackReference(`CerusBots/runner/${config.name}`),
  ]
  if (!config.hasNamespace) dependsOn.push(namespace(config, provider))
  else dependsOn.push(new pulumi.StackReference(`CerusBots/k8s/${config.name}`))

  const cacheRes = cache(config, provider, dependsOn)
  const dbRes = db(config, provider, dependsOn)

  const apiRes = api(config, provider, [...dependsOn, ...cacheRes, ...dbRes])

  const baseRes = [...cacheRes, ...dbRes, ...apiRes]

  if (config.dev) {
    const adminerRes = adminer(config, provider, [...dependsOn, ...dbRes])
    const mailhogRes = mailhog(config, provider, dependsOn)
    return [...baseRes, ...adminerRes, ...mailhogRes]
  }
  return baseRes
}
