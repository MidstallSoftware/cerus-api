import { createLogger, format, transports } from 'winston'
import TransportStream from 'winston-transport'
import { StackFrame, get as getStackTrace } from 'stack-trace'
import { readFileSync } from 'fs'
import { SourceMapConsumer } from 'source-map-js'
import config from '../config'
import { DI } from '../di'
import { CompressionTypes, Producer } from 'kafkajs'

class KafkaTransport extends TransportStream {
  private producer?: Producer

  constructor(opts?: TransportStream.TransportStreamOptions) {
    super(opts)
  }

  log(info: object, next: () => void) {
    this.getProducer()
      .then((producer) => {
        if (typeof producer === 'object') {
          producer
            .send({
              topic: 'cerus-logger',
              messages: [{ value: JSON.stringify(info) }],
              compression: CompressionTypes.GZIP,
            })
            .then(() => next())
            .catch((e) => console.error(e))
        } else {
          next()
        }
      })
      .catch((e) => {
        console.error(e)
      })
  }

  private async getProducer() {
    if (typeof this.producer !== 'object') {
      if (typeof DI.kafka !== 'object') return undefined

      this.producer = DI.kafka.producer({
        allowAutoTopicCreation: true,
      })

      await this.producer.connect()
    }

    return this.producer
  }
}

const caller = format((info) => {
  const genSource = (trace: StackFrame) => ({
    function: trace.getFunctionName(),
    file: trace.getFileName(),
    lineno: trace.getLineNumber(),
    colno: trace.getColumnNumber(),
  })

  const stack = getStackTrace().filter((v) => {
    const fname = v.getFileName()
    if (typeof fname !== 'string') return false
    return (
      fname.startsWith(config.buildDir) || fname.startsWith(config.sourceDir)
    )
  })

  const source = genSource(stack[1])
  if (process.env.TS_NODE_DEV) {
    info.message = `${source.file}:${source.lineno}.${source.colno}: ${info.message}`
    return info
  }

  const consumer = new SourceMapConsumer(
    JSON.parse(readFileSync(source.file + '.map', 'utf8'))
  )
  const pos = consumer.originalPositionFor({
    line: source.lineno,
    column: source.colno,
  })

  info.message = `${source.file
    .replace(config.buildDir, '')
    .replace('.js', '.ts')
    .substring(1)}:${pos.line}.${pos.column}: ${info.message}`
  return info
})

const logger = createLogger({
  level: config.logLevels[config.env],
  format: format.combine(
    caller(),
    format.colorize(),
    format.splat(),
    format.simple()
  ),
  transports: [new transports.Console(), new KafkaTransport()],
})
export default logger
