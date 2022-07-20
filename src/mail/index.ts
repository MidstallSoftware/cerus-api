import { Data, compile } from 'ejs'
import { readFileSync, readdirSync } from 'fs'
import mjml from 'mjml'
import Mail from 'nodemailer/lib/mailer'
import { join } from 'path'
import { DI } from '../di'
import config from '../config'

const templateDir = join(config.dataDir, 'templates')
const templateNames = readdirSync(templateDir)
const templates = Object.fromEntries(
  templateNames.map((name) => [
    name.replace('.mjml.ejs', ''),
    compile(readFileSync(join(templateDir, name), 'utf8')),
  ])
)

interface TemplatedOptions extends Mail.Options {
  template: string
  vars: Data
}

interface RawTemplatedOptions extends Mail.Options {
  vars: Data
}

export async function sendRawTemplated(opts: RawTemplatedOptions) {
  if (!opts.from)
    opts.from = process.env.EMAIL_ADDRESS || process.env.EMAIL_USERNAME

  opts.html = mjml(compile(opts.html as string)(opts.vars), {
    validationLevel: 'strict',
  }).html
  return await DI.mail.sendMail(opts)
}

export async function sendTemplated(opts: TemplatedOptions) {
  if (!(opts.template in templates))
    throw new Error(`Template called ${opts.template} does not exist`)

  if (!opts.from)
    opts.from = process.env.EMAIL_ADDRESS || process.env.EMAIL_USERNAME

  opts.html = mjml(templates[opts.template](opts.vars), {
    validationLevel: 'strict',
  }).html
  return await DI.mail.sendMail(opts)
}
