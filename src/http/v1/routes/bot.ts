import { Router } from 'express'
import genController from '../controllers/bot'
import { requireAuthHandler, tryAuthHandler } from '../../middleware/auth'
import { validateBody, validateQuery } from '~/http/middleware/validate'
import { Intents } from 'discord.js'

export default function genBotRoute() {
  const router = Router()
  const controller = genController()

  router.post(
    '/',
    requireAuthHandler,
    validateBody({
      type: 'object',
      properties: {
        token: { type: 'string', required: true },
        intents: {
          type: 'array',
          items: {
            type: 'string',
            enum: Object.keys(Intents.FLAGS),
          },
          uniqueItems: true,
          required: false,
        },
        isPublic: { type: 'boolean', required: false },
      },
    }),
    controller.create
  )

  router.delete('/:botId', requireAuthHandler, controller.delete)

  router.get(
    '/',
    tryAuthHandler,
    validateQuery({
      type: 'object',
      properties: {
        public: { type: 'string', required: false },
        offset: { type: 'string', pattern: /[0-9]+/, required: false },
        limit: { type: 'string', pattern: /[0-9]+/, required: false },
      },
    }),
    controller.list
  )
  return router
}
