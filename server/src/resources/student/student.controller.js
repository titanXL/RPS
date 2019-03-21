import { Student } from './student.model'
import { logger } from '../../config/logging'

export const createStudent = async (req, res, next) => {
  try {
    const { name } = req.body
    const found = await Student.find({ name }).exec()
    if (found.length) {
      logger.info({ error: 'Student is already registered' })
      return res
        .status(400)
        .json({ message: 'Student is already registered', type: 'error' })
    }
    const student = await Student.create(req.body)
    res.status(201).json({ data: student, type: 'success' })
  } catch (error) {
    logger.info(error)
    error.customMessage = 'Something went wrong creating student'
    next(error)
  }
}

export const getAllStudents = async (req, res, next) => {
  try {
    const students = await Student.find({}).exec()
    res.status(200).json({ data: students, type: 'success' })
  } catch (error) {
    logger.info(error)
    error.customMessage = 'Something went wrong getting all students'
    next(error)
  }
}

export const getStudent = async (req, res, next) => {
  res.status(200).json({ data: req.student, type: 'success' })
}

export const updateStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndUpdate(req.student._id, req.body, {
      new: true
    })
      .lean()
      .exec()

    res.status(200).json({ data: student, type: 'success' })
  } catch (error) {
    logger.info(error)
    error.customMessage = `Something went wrong updating student ${
      req.student.name
    }`
    next(error)
  }
}

export const deleteStudent = async (req, res, next) => {
  try {
    await Student.findByIdAndDelete(req.student._id)
    res.status(200).end()
  } catch (error) {
    logger.info(error)
    error.customMessage = `Something went wrong deleting student ${
      req.student.name
    }`
    next(error)
  }
}
