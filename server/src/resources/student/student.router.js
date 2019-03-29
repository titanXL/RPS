import { Student } from './student.model'
import {
  getAllStudents,
  createStudent,
  getStudent,
  updateStudent,
  deleteStudent,
  getAllUnpaid,
  enrollStudent
} from './student.controller'
import { Router } from 'express'
import { logger } from '../../config/logging'

const router = Router()

export const prefillStudent = async (req, res, next) => {
  try {
    const studentId = req.params.studentid
    const student = await Student.findById(studentId).exec()
    if (!student) {
      res.status(404).send({ message: 'student not found', type: 'error' })
    }
    req.student = student
    next()
  } catch (error) {
    logger.error(error)
    throw new Error('Something went wrong with the student')
  }
}

router.param('studentid', prefillStudent)

router.get('/', getAllStudents)
router.get('/unpaid', getAllUnpaid)
router.get('/:studentid', getStudent)
router.patch('/:studentid', updateStudent)
router.patch('/:studentid/delete', deleteStudent)
router.post('/', createStudent)
router.post('/:studentid/enroll', enrollStudent)

export default router
