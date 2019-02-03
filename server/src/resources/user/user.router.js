import { Router } from 'express'
import { getAll, getById, updateById, deleteById } from './user.controllers'

const router = Router()

router.get('/', getAll)

export default router
