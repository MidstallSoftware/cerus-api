config.define_bool('dev', args=False)
cfg = config.parse()
dockerfile = './Dockerfile'

if cfg.get('dev'):
  docker_compose('./docker-compose.dev.yml')
  dockerfile = './Dockerfile.dev'
else:
  docker_compose('./docker-compose.yml')


docker_build('cerus-api', '.', live_update=[
  sync('src', '/usr/src/server/src'),
  sync('package-lock.json', '/usr/src/server/package-lock.json'),
  sync('package.json', '/usr/src/server/package.json'),
  run('npm i', trigger='package.json'),
  restart_container()
], dockerfile=dockerfile)

docker_build('cerus-api-prometheus', '.', live_update=[
  sync('prometheus.yml', '/etc/prometheus/prometheus.yml'),
  restart_container()
], dockerfile='./Dockerfile.prom')