import { Student } from './student.model'
import asyncMiddleware from '../../middleware/async'

export const createStudent = asyncMiddleware(async (req, res, next) => {
  const { email } = req.body
  const found = await Student.find({ email }).exec()
  if (found.length) {
    return res
      .status(400)
      .json({ message: 'Student is already registered', type: 'error' })
  }
  const student = await Student.create(req.body)
  res.status(201).json({ data: student, type: 'success' })
})

export const enrollStudent = asyncMiddleware(async (req, res, next) => {
  const student = req.student
  student.courses.push(req.body)
  student.save()
  return res.status(200).json({ data: student, type: 'success' })
})

export const makePayment = asyncMiddleware(async (req, res, next) => {
  const user = req.user
})

export const getAllStudents = asyncMiddleware(async (req, res, next) => {
  const students = await Student.find({}).exec()
  res.status(200).json({ data: students, type: 'success' })
})

export const getStudent = asyncMiddleware(async (req, res, next) => {
  res.status(200).json({ data: req.student, type: 'success' })
})

export const updateStudent = asyncMiddleware(async (req, res, next) => {
  const student = await Student.findByIdAndUpdate(req.student._id, req.body, {
    new: true
  })
    .lean()
    .exec()

  res.status(200).json({ data: student, type: 'success' })
})

export const deleteStudent = asyncMiddleware(async (req, res, next) => {
  const updatedStudent = await Student.findByIdAndUpdate(
    req.student._id,
    {
      status: 'Deactivated'
    },
    {
      new: true
    }
  )
  res.status(200).json({ data: updatedStudent, type: 'success' })
})

export const getAllUnpaid = asyncMiddleware(async (req, res, next) => {
  const allUnpaindStudents = await Student.getUnpaid()
  return res.status(200).json({ data: allUnpaindStudents })
})
