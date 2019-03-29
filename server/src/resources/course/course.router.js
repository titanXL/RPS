import { Course } from './course.model'
import {} from './course.controller'
import { Router } from 'express'
import { logger } from '../../config/logging'

const router = Router()

export const prefillCourse = async (req, res, next) => {
  try {
    const courseId = req.params.courseid
    const course = await Course.findById(courseId).exec()
    if (!course) {
      res.status(404).send({ message: 'course not found', type: 'error' })
    }
    req.course = course
    next()
  } catch (error) {
    logger.error(error)
    throw new Error('Something went wrong with the course')
  }
}

router.param('courseid', prefillCourse)

export default router
