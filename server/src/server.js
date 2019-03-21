import express from 'express'
import { json, urlencoded } from 'body-parser'
import morgan from 'morgan'
import config from './config'
import cors from 'cors'
import { signup, signin, protect, admin } from './utils/auth'
import { connect } from './utils/db'
import { seedAdmin } from './resources/user/user.model'
import userRouter from './resources/user/user.router'
import studentRouter from './resources/student/student.router'
import teacherRouter from './resources/teacher/teacher.router'
import error from './middleware/error'
import { logger } from './config/logging'

export const app = express()

app.disable('x-powered-by')
// TODO: install helmet

app.use(cors())
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(morgan('dev'))

app.post('/signup', protect, admin, signup)
app.post('/signin', signin)

app.use('/api', protect)
app.use('/api/users', userRouter)
app.use('/api/students', studentRouter)
app.use('/api/teachers', teacherRouter)
app.use(error)

export const start = async () => {
  try {
    await connect()
      .then(seedAdmin)
      .then(() => console.info('Connected to DB'))
    app.listen(config.port, () => {
      console.info(`REST API on http://localhost:${config.port}/api`)
    })
  } catch (e) {
    logger.error(e.message, e)
  }
}
