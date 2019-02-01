import express from 'express'
import { json, urlencoded } from 'body-parser'
import morgan from 'morgan'
import config from './config'
import cors from 'cors'
import { signup, signin, protect, admin } from './utils/auth'
import { connect } from './utils/db'
import { seedAdmin } from './resources/user/user.model'

export const app = express()

app.disable('x-powered-by')

app.use(cors())
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(morgan('dev'))

app.post('/signup', protect, admin, signup)
app.post('/signin', signin)

app.use('/api', protect)

export const start = async () => {
  try {
    await connect().then(seedAdmin)
    app.listen(config.port, () => {
      console.log(`REST API on http://localhost:${config.port}/api`)
    })
  } catch (e) {
    console.error(e)
  }
}
