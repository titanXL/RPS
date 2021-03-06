import { Router } from 'express'
import { getAll, getById, updateById, deleteById } from './user.controller'
import { User } from './user.model'
import { logger } from '../../config/logging'

const router = Router()

export const prefillUser = async (req, res, next) => {
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
    error.customMessage = `Something went wrong fetching user`
    next(error)
  }
}

router.param('userid', prefillUser)

router.get('/', getAll)
router.get('/:userid', getById)
router.patch('/:userid', updateById)
router.delete('/:userid', deleteById)

export default router
