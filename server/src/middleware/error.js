import { logger } from '../config/logging'
export default (err, req, res, next) => {
  logger.error(err.message, err)
  res.status(400).send({ message: err.customMessage || err.message })
}
