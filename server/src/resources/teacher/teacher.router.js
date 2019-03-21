import { Router } from 'express'
import {
  getAll,
  getById,
  updateById,
  deleteById,
  createTeacher
} from './teacher.controller'
import { Teacher } from './teacher.model'
import { logger } from '../../config/logging'

const router = Router()

router.param('teacherid', async (req, res, next) => {
  try {
    const teacherid = req.params.teacherid
    const teacher = await Teacher.findById(teacherid)
      .lean()
      .exec()
    if (!teacher) {
      res.status(404).send({ message: 'Teacher not found', type: 'error' })
    }
    req.teacher = teacher
    next()
  } catch (error) {
    logger.error(error)
    error.customMessage = `Something went wrong fetching teacher with id ${
      req.params.teacherid
    }`
    next(error)
  }
})

router.get('/', getAll)
router.post('/', createTeacher)
router.get('/:teacherid', getById)
router.patch('/:teacherid', updateById)
router.delete('/:teacherid', deleteById)

export default router