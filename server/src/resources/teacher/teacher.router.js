import { Router } from 'express'
import {
  getAll,
  getById,
  updateById,
  createTeacher,
  deactivateById,
  teachCourse
} from './teacher.controller'
import { Teacher } from './teacher.model'
import { logger } from '../../config/logging'

const router = Router()

export const prefillTeacher = async (req, res, next) => {
  try {
    const teacherid = req.params.teacherid
    const teacher = await Teacher.findById(teacherid).exec()
    if (!teacher) {
      res.status(404).send({ message: 'Teacher not found', type: 'error' })
    }
    req.teacher = teacher
    next()
  } catch (error) {
    logger.error(error)
    error.customMessage = `Something went wrong fetching teacher`
    next(error)
  }
}

router.param('teacherid', prefillTeacher)

router.get('/', getAll)
router.get('/:teacherid', getById)
router.post('/', createTeacher)
router.post('/:teacherid/teach/:courseid', teachCourse)
router.patch('/:teacherid', updateById)
router.patch('/:teacherid/deactivate', deactivateById)

export default router
