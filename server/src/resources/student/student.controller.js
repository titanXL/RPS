import { Student } from './student.model'
import { logger } from '../../config/logging'

export const createStudent = async (req, res, next) => {
  try {
    const { phoneNumber } = req.body
    const found = await Student.find({ phoneNumber }).exec()
    if (found.length) {
      logger.info({ error: 'Student is already registered' })
      return res.status(400).json({ error: 'Student is already registered' })
    }
    const student = await Student.create(req.body)
    res.status(201).json({ data: student })
  } catch (error) {
    logger.info(error)
    error.customMessage = 'Something went wrong creating student'
    next(error)
  }
}
