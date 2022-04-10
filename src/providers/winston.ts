import { createLogger, format, transports } from 'winston'
import { KafkaTransport } from 'winston-logger-kafka'
import TransportStream from 'winston-transport'
import { StackFrame, get as getStackTrace } from 'stack-trace'
import config from '../config'

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
  transports: [
    new transports.Console(),
    new KafkaTransport({
      clientConfig: config.kafka,
      producerConfig: { allowAutoTopicCreation: true },
      sinkTopic: 'cerus-winston',
    }) as unknown as TransportStream,
  ],
})
export default logger
