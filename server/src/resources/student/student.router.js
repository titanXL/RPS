import { Student } from './student.model'
import { createStudent } from './student.controller'
import { Router } from 'express'
import { logger } from '../../config/logging'

const router = Router()

router.param('studentid', async (req, res, next) => {
  try {
    const studentId = req.params.studentid
    const student = await Student.findById(studentId)
      .lean()
      .exec()
    if (!student) {
      res.status(404).send({ message: 'student not found' })
    }
    req.student = student
    next()
  } catch (error) {
    logger.error(error)
    throw new Error('Something went wrong with the student')
  }
})

router.post('/', createStudent)

export default router
