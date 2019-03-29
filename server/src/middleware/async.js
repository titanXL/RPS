import { logger } from '../config/logging'

export default handler => {
  return async (req, res, next) => {
    try {
      await handler(req, res)
    } catch (error) {
      logger.info(error)
      next(error)
    }
  }
}
