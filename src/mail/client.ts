import { createTransport } from 'nodemailer'
import config from '../config'
import winston from '../providers/winston'

export async function initMail() {
  winston.debug('Connecting to E-Mail')
  const transport = createTransport(config.mail)
  const verified = await transport.verify()

  if (!verified) throw new Error('Unable to connect to E-Mail server')

  winston.info('Connected to E-Mail')
  return transport
}
