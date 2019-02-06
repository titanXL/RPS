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
      res.status(404).send({ message: 'User not found' })
    }
    req.user = user
    next()
  } catch (error) {
    logger.error(error)
    res.status(400).send({ message: 'Something went wrong with the user' })
  }
})

router.get('/', getAll)
router.get('/:userid', getById)
router.patch('/:userid', updateById)
router.delete('/:userid', deleteById)

export default router
