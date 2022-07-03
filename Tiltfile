load('ext://pulumi', 'pulumi_resource')
load('ext://dotenv', 'dotenv')

dotenv()

update_settings(k8s_upsert_timeout_secs=240)

docker_build('ghcr.io/cerusbots/api:latest', '.', dockerfile='./Dockerfile.dev', live_update=[
  sync('data', '/usr/src/server/data'),
  sync('patches', '/usr/src/server/patches'),
  sync('src', '/usr/src/server/src'),
  sync('submodules', '/usr/src/server/submodules'),
  sync('package-lock.json', '/usr/src/server/package-lock.json'),
  sync('package.json', '/usr/src/server/package.json'),
  sync('tsconfig.json', '/usr/src/server/tsconfig.json'),
  run('npm i', trigger='package.json'),
  run('npm run build', trigger='submodules/common')
])

pulumi_resource('cerus-api', stack='dev', dir='deploy/pulumi', image_deps=['ghcr.io/cerusbots/api:latest'], image_configs=['image'], labels=['cerus-backend'], port_forwards=['3002:80'])