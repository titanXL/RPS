import { Teacher } from './teacher.model'
import { logger } from '../../config/logging'

export const getAll = async (req, res, next) => {
  try {
    const teachers = await Teacher.find({})
      .lean()
      .exec()

    res.status(200).json({ data: teachers, type: 'success' })
  } catch (error) {
    logger.info(error)
    error.customMessage = 'Something went wrong fetching teachers'
    next(error)
  }
}

export const getById = async (req, res, next) => {
  try {
    const teacher = req.teacher
    res.status(200).json({ data: teacher, type: 'success' })
  } catch (error) {
    logger.info(error)
    error.customMessage = `Something went wrong fetching teacher ${
      req.teacher.name
    }`
    next(error)
  }
}

export const createTeacher = async (req, res, next) => {
  try {
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
  } catch (error) {
    logger.info(error)
    error.customMessage = 'Something went wrong creating teacher'
    next(error)
  }
}

export const updateById = async (req, res, next) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(req.teacher._id, req.body, {
      new: true
    })
      .lean()
      .exec()

    res.status(200).json({ data: teacher, type: 'success' })
  } catch (error) {
    logger.info(error)
    error.customMessage = `Something went wrong updating teacher ${
      req.teacher.name
    }`
    next(error)
  }
}

// TODO: implement deactivate

export const deactivateById = async (req, res, next) => {
  try {
    await Teacher.findByIdAndUpdate(req.teacher._id, {
      status: 'Unactive'
    })
    res.status(200).end()
  } catch (error) {
    logger.info(error)
    error.customMessage = `Something went wrong deleting teacher ${
      req.teacher.username
    }`
    next(error)
  }
}
