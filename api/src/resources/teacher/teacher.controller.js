import { Teacher } from './teacher.model'
import { Course } from '../course/course.model'
import { logger } from '../../config/logging'
import asyncMiddleware from '../../middleware/async'

export const getAll = asyncMiddleware(async (req, res, next) => {
  const teachers = await Teacher.find({})
    .lean()
    .exec()

  res.status(200).json({ data: teachers, type: 'success' })
})

export const getById = asyncMiddleware(async (req, res, next) => {
  const teacher = req.teacher
  res.status(200).json({ data: teacher, type: 'success' })
})

export const createTeacher = asyncMiddleware(async (req, res, next) => {
  const { name } = req.body
  const found = await Teacher.find({ name }).exec()
  if (found.length) {
    logger.info({ error: 'Teacher is already registered' })
    return res
      .status(400)
      .json({ message: 'Teacher is already registered', type: 'error' })
  }
  const teacher = await Teacher.create(req.body)
  res.status(201).json({ data: teacher, type: 'success' })
})

export const updateById = asyncMiddleware(async (req, res, next) => {
  const teacher = await Teacher.findByIdAndUpdate(req.teacher._id, req.body, {
    new: true
  })
    .lean()
    .exec()

  res.status(200).json({ data: teacher, type: 'success' })
})

export const deactivateById = asyncMiddleware(async (req, res, next) => {
  const deactivatedTeacher = await Teacher.findByIdAndUpdate(
    req.teacher._id,
    {
      status: 'Deactivated'
    },
    { new: true }
  ).exec()
  res.status(200).json({ data: deactivatedTeacher, type: 'success' })
})

export const teachCourse = asyncMiddleware(async (req, res, next) => {
  const courseId = req.params.courseid
  const course = await Course.findById(courseId).exec()
  if (!course) {
    return res.status(400).json({ data: 'Course not found', type: 'error' })
  }
  const teacher = req.teacher
  teacher.teaches.push({ _id: courseId })
  await teacher.save()
  return res.status(200).json({ data: teacher, type: 'success' })
})
