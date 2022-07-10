import * as k8s from '@pulumi/kubernetes'
import * as pulumi from '@pulumi/pulumi'
import { Configuration } from './config'

import adminer from './components/adminer'
import api from './components/api'
import cache from './components/cache'
import db from './components/db'
import grafana from './components/grafana'
import kafka from './components/kafka'
import kowl from './components/kowl'
import mailhog from './components/mailhog'
import namespace from './components/namespace'
import prometheus from './components/prometheus'

export function createKube(config: Configuration, provider?: k8s.Provider) {
  const dependsOn: pulumi.Resource[] = []
  if (!config.hasNamespace) dependsOn.push(namespace(config, provider))

  const prometheusRes = prometheus(config, provider, dependsOn)

  const cacheRes = cache(config, provider, [...dependsOn, ...prometheusRes])
  const dbRes = db(config, provider, [...dependsOn, ...prometheusRes])
  const kafkaRes = kafka(config, provider, dependsOn)

  const grafanaRes = grafana(config, provider, [...dependsOn, ...prometheusRes])
  const apiRes = api(config, provider, [
    ...dependsOn,
    ...prometheusRes,
    ...cacheRes,
    ...dbRes,
    ...kafkaRes,
  ])

  const baseRes = [
    ...prometheusRes,
    ...cacheRes,
    ...dbRes,
    ...kafkaRes,
    ...grafanaRes,
    ...apiRes,
  ]

  if (config.dev) {
    const adminerRes = adminer(config, provider, [...dependsOn, ...dbRes])
    const kowlRes = kowl(config, provider, [...dependsOn, ...kafkaRes])
    const mailhogRes = mailhog(config, provider, dependsOn)
    return [...baseRes, ...adminerRes, ...kowlRes, ...mailhogRes]
  }
  return baseRes
}
