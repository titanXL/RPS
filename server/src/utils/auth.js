import config from '../config'
import { User, validateUser } from '../resources/user/user.model'
import jwt from 'jsonwebtoken'

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

export const signup = async (req, res) => {
  const { error } = validateUser(req.body)
  if (error) {
    return res.status(400).send({ message: error.details[0].message })
  }

  try {
    const user = await User.create(req.body)
    const token = newToken(user)
    return res.status(201).send({ token })
  } catch (e) {
    console.log(e.errors)
    return res.status(500).end()
  }
}

export const signin = async (req, res) => {
  const { error } = validateUser(req.body)
  if (error) {
    return res.status(400).send({ message: error.details[0].message })
  }

  const invalid = { message: 'Invalid email and passoword combination' }

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
    console.error(e)
    res.status(500).end()
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
    return res.status(401).end()
  }

  const user = await User.findById(payload.id)
    .select('-password')
    .lean()
    .exec()

  if (!user) {
    return res.status(401).end()
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
