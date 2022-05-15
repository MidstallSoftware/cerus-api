import { createLogger, format, transports } from 'winston'
import TransportStream from 'winston-transport'
import { StackFrame, get as getStackTrace } from 'stack-trace'
import config from '../config'
import { DI } from '../di'
import { CompressionTypes, Producer } from 'kafkajs'

class KafkaTransport extends TransportStream {
  private producer?: Producer

  constructor(opts?: TransportStream.TransportStreamOptions) {
    super(opts)
  }

  log(info: any, next: () => void) {
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

  // TODO: if error, provide full stack trace
  const stack = getStackTrace()
  const i = stack.findIndex(
    (v) =>
      v.getFileName().startsWith(config.buildDir) ||
      v.getFileName().startsWith(config.sourceDir)
  )
  info.source = genSource(stack[i + 4])
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
