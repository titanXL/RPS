import { Router } from 'express'
import { getAll, getById, updateById, deleteById } from './user.controllers'
import { User } from './user.model'
import { logger } from '../../config/logging'

const router = Router()

router.param('userid', async (req, res, next) => {
  try {
    const userId = req.params.userid
    const user = await User.findById(userId)
      .lean()
      .exec()
    if (!user) {
      res.status(404).send({ message: 'User not found', type: 'error' })
    }
    req.user = user
    next()
  } catch (error) {
    logger.error(error)
    error.customMessage = `Something went wrong fetching user with id ${
      req.params.userid
    }`
    next(error)
  }
})

router.get('/', getAll)
router.get('/:userid', getById)
router.patch('/:userid', updateById)
router.delete('/:userid', deleteById)

export default router
