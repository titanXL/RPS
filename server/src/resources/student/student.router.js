import { Student } from './student.model'
import { createStudent } from './student.controller'
import { Router } from 'express'

const router = Router()

router.post('/', createStudent)

export default router
