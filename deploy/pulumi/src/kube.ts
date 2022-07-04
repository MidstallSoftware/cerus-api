import * as k8s from '@pulumi/kubernetes'
import { Configuration } from './config'

import * as adminer from './components/adminer'
import * as api from './components/api'
import * as cache from './components/cache'
import * as db from './components/db'
import * as grafana from './components/grafana'
import * as kafka from './components/kafka'
import * as kowl from './components/kowl'
import * as mailhog from './components/mailhog'
import namespace from './components/namespace'
import * as prometheus from './components/prometheus'

export function createKube(config: Configuration, provider?: k8s.Provider) {
  if (!config.hasNamespace) namespace(config, provider)

  prometheus.crd(config, provider)

  cache.chart(config, provider)
  db.chart(config, provider)
  kafka.chart(config, provider)

  prometheus.chart(config, provider)

  grafana.dataSources(config, provider)
  grafana.chart(config, provider)

  api.secret(config, provider)
  api.deployment(config, provider)
  api.service(config, provider)
  api.serviceMonitor(config, provider)

  if (config.dev) {
    adminer.chart(config, provider)
    kowl.chart(config, provider)
    mailhog.deployment(config, provider)
    mailhog.service(config, provider)
  }
}
