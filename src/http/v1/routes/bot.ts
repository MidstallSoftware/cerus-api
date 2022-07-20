import { Router } from 'express'
import { validateBody, validateQuery } from '../../middleware/validate'
import { Intents } from 'discord.js'

export default function genBotRoute() {
  const router = Router()
  return router
}
