import jwt from 'jsonwebtoken'
import config from '../config'
import { User, validateUser } from '../resources/user/user.model'
import { logger } from '../config/logging'

export const newToken = user => {
  return jwt.sign({ id: user.id, role: user.role }, config.secrets.jwt, {
    expiresIn: config.secrets.jwtExp
  })
}

export const verifyToken = token =>
  new Promise((resolve, reject) => {
    jwt.verify(token, config.secrets.jwt, (err, payload) => {
      if (err) return reject(err)
      resolve(payload)
    })
  })

export const signup = async (req, res, next) => {
  const { error } = validateUser(req.body)
  if (error) {
    return res.status(400).send({ message: error.details[0].message })
  }

  try {
    const user = await User.create(req.body)
    const token = newToken(user)
    return res.status(201).send({ token })
  } catch (e) {
    logger.info(e.errors)
    next(e)
  }
}

export const signin = async (req, res, next) => {
  const { error } = validateUser(req.body)
  if (error) {
    return res.status(400).send({ message: error.details[0].message })
  }

  const invalid = { message: 'Invalid email and password combination' }

  try {
    const user = await User.findOne({ username: req.body.username })
      .select('username password role')
      .exec()
    if (!user) {
      return res.status(401).send(invalid)
    }

    const match = await user.checkPassword(req.body.password)
    if (!match) {
      return res.status(401).send(invalid)
    }

    const token = newToken(user)
    return res.status(201).send({ token })
  } catch (e) {
    logger.info(e)
    next(e)
  }
}

export const protect = async (req, res, next) => {
  const bearer = req.headers.authorization

  if (!bearer || !bearer.startsWith('Bearer ')) {
    return res.status(401).end()
  }

  const token = bearer.split('Bearer ')[1].trim()
  let payload
  try {
    payload = await verifyToken(token)
  } catch (e) {
    next(e)
  }

  const user = await User.findById(payload.id)
    .select('-password')
    .lean()
    .exec()

  if (!user) {
    return res.status(401).send({ message: 'User not found' })
  }

  req.user = user
  next()
}

export const admin = async (req, res, next) => {
  if (req.user.role !== 'Admin') {
    return res
      .status(403)
      .send({ message: 'You need to be an administrator to proceed' })
  }
  next()
}
