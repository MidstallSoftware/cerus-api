import * as k8s from '@pulumi/kubernetes'
import { Configuration } from '../config'

export const serviceMonitor = (
  config: Configuration,
  provider?: k8s.Provider
) =>
  new k8s.yaml.ConfigFile(
    'cerus-api',
    {
      file: 'src/manifest/servicemonitor-cerus-api.yaml',
      transformations: [
        (obj: any) => {
          obj.metadata.namespace = config.namespace
        },
      ],
    },
    { provider }
  )

export const secret = (config: Configuration, provider?: k8s.Provider) =>
  new k8s.core.v1.Secret(
    'cerus-api-secrets',
    {
      metadata: {
        labels: {
          app: 'cerus-api',
        },
        name: 'cerus-api-secrets',
        namespace: config.namespace,
      },
      stringData: {
        MYSQL_USER: config.db.username,
        MYSQL_PASSWORD: config.db.password,
        MYSQL_DATABASE: config.db.name,
        REDIS_PASSWORD: config.cache.password,
        SENTRY_DSN: config.sentry.dsn,
        STRIPE_KEY: config.stripe.key,
      },
    },
    { provider }
  )

export const deployment = (config: Configuration, provider?: k8s.Provider) =>
  new k8s.apps.v1.Deployment(
    'cerus-api',
    {
      metadata: {
        labels: {
          app: 'cerus-api',
        },
        name: 'cerus-api',
        namespace: config.namespace,
      },
      spec: {
        selector: {
          matchLabels: {
            app: 'cerus-api',
          },
        },
        template: {
          metadata: {
            labels: {
              app: 'cerus-api',
            },
          },
          spec: {
            containers: [
              {
                image: config.image,
                imagePullPolicy: 'Always',
                name: 'cerus-api',
                ports: [{ containerPort: 80 }],
                readinessProbe: {
                  httpGet: {
                    path: '/v1/service/stats',
                    port: 80,
                  },
                },
                livenessProbe: {
                  httpGet: {
                    path: '/v1/service/stats',
                    port: 80,
                  },
                },
                envFrom: [{ secretRef: { name: 'cerus-api-secrets' } }],
                env: [
                  {
                    name: 'KAFKA_BROKERS',
                    value: config.kafka.brokers.join(','),
                  },
                  { name: 'MYSQL_HOST', value: 'cerus-api-db' },
                  { name: 'REDIS_HOST', value: 'cerus-api-cache' },
                ],
              },
            ],
          },
        },
      },
    },
    { provider }
  )

export const service = (config: Configuration, provider?: k8s.Provider) =>
  new k8s.core.v1.Service(
    'cerus-api',
    {
      metadata: {
        labels: {
          app: 'cerus-api',
        },
        name: 'cerus-api',
        namespace: config.namespace,
      },
      spec: {
        clusterIP: 'None',
        ports: [{ port: 80 }],
        selector: {
          app: 'cerus-api',
        },
      },
    },
    { provider }
  )
