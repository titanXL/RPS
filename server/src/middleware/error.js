import { logger } from '../config/logging'
export default (err, req, res, next) => {
  logger.error(err.message, err)
  res.status(500).send('Something went wrong!')
}
