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
    issuerBaseURL: string
    secret: Output<string>
  }
  db: {
    password: string | Output<string>
    username: string
    name: string
    storage: {
      class: string
      size: string
    }
  }
  cache: {
    password: string | Output<string>
    storage: {
      class: string
      size: string
    }
  }
  mail: {
    host: string
    port: number
    username: string
    password: string | Output<string>
  }
  kafka: {
    brokers: string[]
    storage: {
      class: string
      size: string
    }
  }
  zookeeper: {
    storage: {
      class: string
      size: string
    }
  }
  grafana: {
    storage: {
      class: string
      size: string
    }
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
      issuerBaseURL: config.require('auth0.issuerBaseURL'),
      secret: config.requireSecret('auth0.secret'),
    },
    db: {
      username: config.get('env.MYSQL_USER') || 'db',
      password: config.getSecret('env.MYSQL_PASSWORD') || 'db',
      name: config.get('env.MYSQL_DATABASE') || 'db',
      storage: {
        class: config.get('db.storage.class') || storageClass,
        size: config.get('db.storage.size') || '4Gi',
      },
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
      storage: {
        class: config.get('kafka.storage.class') || storageClass,
        size: config.get('kafka.storage.size') || '4Gi',
      },
    },
    zookeeper: {
      storage: {
        class: config.get('zookeeper.storage.class') || storageClass,
        size: config.get('zookeeper.storage.size') || '1Gi',
      },
    },
    grafana: {
      storage: {
        class: config.get('grafana.storage.class') || storageClass,
        size: config.get('grafana.storage.size') || '1Gi',
      },
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
