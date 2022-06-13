import { install } from 'source-map-support'
if (!process.env.TS_NODE_DEV) {
  install()
}

import 'reflect-metadata'

import makeApp from './http'
import { init } from './di'
import winston from './providers/winston'
import config from './config'

const { app } = makeApp()

init()
  .then(() => {
    winston.info('Server is now connected')
    app.listen(config.port, () => {
      winston.info('Server is fully online')
    })
  })
  .catch((err) => {
    console.log(err)
    winston.error(err)
    process.exit(1)
  })
