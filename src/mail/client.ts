import { createTransport } from 'nodemailer'
import config from '../config'

export async function initMail() {
  const transport = createTransport(config.mail)
  const verified = await transport.verify()

  if (!verified) throw new Error('Unable to connect to E-Mail server')

  return transport
}
