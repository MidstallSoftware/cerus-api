import * as k8s from '@pulumi/kubernetes'
import { Config, Output } from '@pulumi/pulumi'
import { githubImage } from './utils/image'
import { parse } from 'yaml'

export interface Configuration {
  kubeConfig: any
  name: string
  namespace: string
  dev: boolean
  mode: string
  version: string
  sha: string
  image: string
  hasNamespace: boolean
  domain: string
  auth0: {
    issuer: Output<string>
    secret: Output<string>
  }
  db: {
    root: {
      password: string | Output<string>
      name: string
    }
    user: {
      password: string | Output<string>
      name: string
    }
    name: string
    host: string
  }
  cache: {
    password: string | Output<string>
    storage: {
      class: string
      size: string
    }
  }
  prometheus: {
    host: string
  }
  mail: {
    host: string
    port: number
    username: string
    password: string | Output<string>
  }
  kafka: {
    brokers: string[]
  }
  stripe: {
    key: Output<string>
  }
  sentry: {
    dsn: Output<string>
  }
}

export function createConfig(config: Config): Configuration {
  const name = config.get('name') || 'dev'
  const mode = config.get('mode') || 'development'
  const dev = mode === 'development'
  const namespace = config.get('namespace') || 'cerusbots'
  const version = config.get('version') || 'latest'
  const sha = config.get('sha') || 'HEAD'
  const kubeConfigRaw = config.get('kubeconfig')
  const kubeConfig = kubeConfigRaw ? parse(kubeConfigRaw) : undefined
  const domain = config.get('host') || 'cerusbots.' + (dev ? 'test' : 'com')
  const storageClass = config.get('storage.class') || 'standard'
  const hasNamespaceRaw = config.getBoolean('hasNamespace')
  const hasNamespace =
    typeof hasNamespaceRaw === 'undefined' ? true : hasNamespaceRaw

  const cfg = {
    name,
    namespace,
    kubeConfig,
    dev,
    mode,
    version,
    sha,
    image: '',
    hasNamespace,
    domain: `api.${domain}`,
    auth0: {
      issuer: config.requireSecret('auth0.issuer'),
      secret: config.requireSecret('auth0.secret'),
    },
    db: {
      root: {
        name: config.get('db.root.name') || 'root',
        password: config.getSecret('db.root.password') || 'db',
      },
      user: {
        name: config.get('db.user.name') || 'api',
        password: config.getSecret('db.user.password') || 'db',
      },
      name: config.get('db.name') || 'api',
      host: config.get('db.host') || 'localhost:30000',
    },
    cache: {
      password: config.getSecret('env.REDIS_PASSWORD') || 'cache',
      storage: {
        class: config.get('cache.storage.class') || storageClass,
        size: config.get('cache.storage.size') || '1Gi',
      },
    },
    mail: {
      host: dev
        ? 'cerus-mailhog'
        : config.get('env.EMAIL_HOST') || `mail.${domain}`,
      port: dev ? 1025 : config.getNumber('env.EMAIL_PORT') || 25,
      username: dev
        ? `noreply@${domain}`
        : config.get('env.EMAIL_USERNAME') || `noreply@${domain}`,
      password: dev
        ? 'empty'
        : config.getSecret('env.EMAIL_PASSWORD') || 'empty',
    },
    kafka: {
      brokers: (
        config.get('env.KAFKA_BROKERS') ||
        `cerus-kafka.${namespace}.svc.cluster.local:9092`
      ).split(','),
    },
    prometheus: {
      host:
        config.get('prometheus.host') ||
        `cerus-prometheus-kube-prom-prometheus.${namespace}.svc.cluster.local`,
    },
    stripe: {
      key: config.requireSecret('env.STRIPE_KEY'),
    },
    sentry: {
      dsn: config.requireSecret('env.SENTRY_DSN'),
    },
  }
  return {
    ...cfg,
    image: config.get('image') || githubImage(cfg, 'api'),
  }
}
