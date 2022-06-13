load('ext://restart_process', 'docker_build_with_restart')
load('ext://deployment', 'deployment_create')
load('ext://helm_resource', 'helm_resource', 'helm_repo')
load('ext://secret', 'secret_from_dict')
load('ext://dotenv', 'dotenv')

dotenv()

k8s_yaml(secret_from_dict('cerus-secrets', namespace='cerusbots', inputs = {
  'EMAIL_HOST': 'mailhog',
  'EMAIL_PORT': '1025',
  'EMAIL_USERNAME': 'noreply@cerusbots.com',
  'EMAIL_PASSWORD': 'empty',
  'REDIS_PASSWORD': os.getenv('REDIS_PASSWORD'),
  'MYSQL_DATABASE': os.getenv('MYSQL_DATABASE'),
  'MYSQL_PASSWORD': os.getenv('MYSQL_PASSWORD'),
  'MYSQL_USER': os.getenv('MYSQL_USER'),
  'STRIPE_KEY': os.getenv('STRIPE_KEY'),
  'SENTRY_DSN': os.getenv('SENTRY_DSN')
}))

k8s_yaml(secret_from_dict('grafana-datasources', namespace='cerusbots', inputs = {
  'datasources.yml': '\n'.join([
      'apiVersion: 1',
      'datasources:',
      ' - name: Prometheus',
      '   type: prometheus',
      '   orgId: 1',
      '   url: http://prometheus-kube-prometheus-prometheus.cerusbots.svc.cluster.local:9090',
      '   basicAuth: false',
      '   isDefault: true',
      '   editable: false'
    ])
}))

helm_repo('bitnami', 'https://charts.bitnami.com/bitnami', labels=['cerus-helm'])
helm_repo('cloudhut', 'https://raw.githubusercontent.com/cloudhut/charts/master/archives', labels=['cerus-helm'])
helm_repo('cetic', 'https://cetic.github.io/helm-charts', labels=['cerus-helm'])

helm_resource('redis', 'bitnami/redis', namespace='cerusbots', labels=['cerus-backend'], flags=[
  '--set', 'auth.existingSecret=cerus-secrets',
  '--set', 'auth.existingSecretPasswordKey=REDIS_PASSWORD',
  '--set', 'architecture=standalone',
  '--set', 'metrics.enabled=true',
  '--set', 'metrics.serviceMonitor.enabled=true'
])
helm_resource('mariadb', 'bitnami/mariadb', namespace='cerusbots', labels=['cerus-backend'], flags=[
  '--set', 'auth.password=' + os.getenv('MYSQL_PASSWORD'),
  '--set', 'auth.username=' + os.getenv('MYSQL_USER'),
  '--set', 'auth.database=' + os.getenv('MYSQL_DATABASE'),
  '--set', 'metrics.enabled=true',
  '--set', 'metrics.serviceMonitor.enabled=true'
])

helm_resource('kafka', 'bitnami/kafka', namespace='cerusbots', labels=['cerus-backend'], flags=[
  '--set', 'metrics.enabled=true',
  '--set', 'metrics.serviceMonitor.enabled=true'
])

helm_resource('prometheus', 'bitnami/kube-prometheus', namespace='cerusbots', labels=['cerus-monitoring'], flags=[
  '--set', 'coreDns.enabled=false',
  '--set', 'kubeProxy.enabled=true'
])
k8s_resource('prometheus', port_forwards='8080:9090')

helm_resource('grafana', 'bitnami/grafana', namespace='cerusbots', labels=['cerus-monitoring'], flags=[
  '--set', 'service.type=LoadBalancer',
  '--set', 'datasources.secretName=grafana-datasources'
])
k8s_resource('grafana', port_forwards='8081:3000')

helm_resource('kowl', 'cloudhut/kowl', namespace='cerusbots', labels=['cerus-monitoring'], flags=[
  '--set', 'kowl.config.kafka.brokers={kafka.cerusbots.svc.cluster.local:9092}'
])
k8s_resource('kowl', port_forwards='8082:8080')

helm_resource('adminer', 'cetic/adminer', namespace='cerusbots', labels=['cerus-monitoring'], flags=[
  '--set', 'config.design=dracula',
  '--set', 'config.externalserver=mariadb'
])
k8s_resource('adminer', port_forwards=['8083:8080'])

deployment_create('mailhog', 'mailhog/mailhog', namespace='cerusbots', ports=['8025:8025', '1025:1025'])
k8s_resource('mailhog', labels=['cerus-monitoring'], port_forwards=['8084:8025'])

docker_build('ghcr.io/cerusbots/api', '.', dockerfile='./Dockerfile.dev', live_update=[
  sync('data', '/usr/src/server/data'),
  sync('patches', '/usr/src/server/patches'),
  sync('src', '/usr/src/server/src'),
  sync('submodules', '/usr/src/server/submodules'),
  sync('package-lock.json', '/usr/src/server/package-lock.json'),
  sync('package.json', '/usr/src/server/package.json'),
  sync('tsconfig.json', '/usr/src/server/tsconfig.json'),
  run('npm i', trigger='package.json'),
  run('npm run build')
], extra_tag='master')

k8s_yaml('./kube/deploy.yml')
k8s_yaml('./kube/service.yml')
k8s_yaml('./kube/servicemonitor.yml')
k8s_resource('cerus-api', labels=['cerus-backend'], port_forwards=['3002:80'])
