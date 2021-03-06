import { newToken, verifyToken, signup, signin, protect, admin } from '../auth'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import config from '../../config'
import { User } from '../../resources/user/user.model'

describe('Authentication:', () => {
  describe('newToken', () => {
    test('creates new jwt from user', () => {
      const id = 123
      const token = newToken({ id })
      const user = jwt.verify(token, config.secrets.jwt)

      expect(user.id).toBe(id)
    })
  })

  describe('verifyToken', () => {
    test('validates jwt and returns payload', async () => {
      const id = 1234
      const token = jwt.sign({ id }, config.secrets.jwt)
      const user = await verifyToken(token)
      expect(user.id).toBe(id)
    })
  })

  describe('signup', () => {
    test('requires username and password', async () => {
      expect.assertions(2)

      const req = { body: {} }
      const res = {
        status(status) {
          expect(status).toBe(400)
          return this
        },
        send(result) {
          expect(typeof result.message).toBe('string')
        }
      }

      await signup(req, res)
    })

    test('creates user and and sends new token from user', async () => {
      expect.assertions(2)

      const req = {
        body: {
          username: 'testing',
          password: 'testing'
        }
      }
      const res = {
        status(status) {
          expect(status).toBe(201)
          return this
        },
        async send(result) {
          let user = await verifyToken(result.data)
          user = await User.findById(user.id)
            .lean()
            .exec()
          expect(user.username).toBe('testing')
        }
      }

      await signup(req, res)
    })

    test('returns status 400 if user already exists', async () => {
      expect.assertions(2)

      const user = await User.create({
        username: 'testing',
        password: 'testing'
      })

      const req = {
        body: user
      }

      const res = {
        status(status) {
          expect(status).toBe(400)
          return this
        },
        async send(result) {
          expect(typeof result.message).toBe('string')
        }
      }

      await signup(req, res, e => console.log(e))
    })
  })

  describe('signin', () => {
    test('requires username and password', async () => {
      expect.assertions(2)

      const req = { body: {} }
      const res = {
        status(status) {
          expect(status).toBe(400)
          return this
        },
        send(result) {
          expect(typeof result.message).toBe('string')
        }
      }

      await signin(req, res, () => {})
    })

    test('user must be real', async () => {
      expect.assertions(2)

      const req = {
        body: {
          username: 'testing',
          password: 'testing'
        }
      }
      const res = {
        status(status) {
          expect(status).toBe(401)
          return this
        },
        send(result) {
          expect(typeof result.message).toBe('string')
        }
      }

      await signin(req, res, () => {})
    })

    test('passwords must match', async () => {
      expect.assertions(2)

      await User.create({
        username: 'testing',
        password: 'testing'
      })

      const req = {
        body: {
          username: 'testing',
          password: 'wrong'
        }
      }
      const res = {
        status(status) {
          expect(status).toBe(401)
          return this
        },
        send(result) {
          expect(typeof result.message).toBe('string')
        }
      }

      await signin(req, res, e => console.log(e))
    })

    test('creates new token', async () => {
      expect.assertions(2)
      const fields = {
        username: 'testing',
        password: 'testing'
      }
      const savedUser = await User.create(fields)

      const req = { body: fields }
      const res = {
        status(status) {
          expect(status).toBe(201)
          return this
        },
        async send(result) {
          let user = await verifyToken(result.data)
          user = await User.findById(user.id)
            .lean()
            .exec()
          expect(user._id.toString()).toBe(savedUser._id.toString())
        }
      }

      await signin(req, res, e => console.log(e))
    })
  })

  describe('protect', () => {
    test('looks for Bearer token in headers', async () => {
      expect.assertions(2)

      const req = { headers: {} }
      const res = {
        status(status) {
          expect(status).toBe(401)
          return this
        },
        end() {
          expect(true).toBe(true)
        }
      }

      await protect(req, res)
    })

    test('token must have correct prefix', async () => {
      expect.assertions(2)

      let req = { headers: { authorization: newToken({ id: '123sfkj' }) } }
      let res = {
        status(status) {
          expect(status).toBe(401)
          return this
        },
        end() {
          expect(true).toBe(true)
        }
      }

      await protect(req, res)
    })

    test('must be a real user', async () => {
      const token = `Bearer ${newToken({ id: mongoose.Types.ObjectId() })}`
      const req = { headers: { authorization: token } }

      const res = {
        status(status) {
          expect(status).toBe(401)
          return this
        },
        async send(result) {
          expect(true).toBe(true)
        }
      }

      await protect(req, res)
    })

    test('finds user form token and passes on', async () => {
      const user = await User.create({
        username: 'testing',
        password: 'testing'
      })
      const token = `Bearer ${newToken(user)}`
      const req = { headers: { authorization: token } }

      const next = () => {}
      await protect(req, {}, next)
      expect(req.user._id.toString()).toBe(user._id.toString())
      expect(req.user).not.toHaveProperty('password')
    })
  })

  describe('admin', () => {
    test('unauthorized if user does not have admin rights', async () => {
      expect.assertions(2)

      const req = {
        user: {
          role: 'Test'
        }
      }

      const res = {
        status(status) {
          expect(status).toBe(403)
          return this
        },
        send(msg) {
          expect(typeof msg.message).toBe('string')
        }
      }
      const next = () => {}
      await admin(req, res, next)
    })
    test('proceeds if user has admin rights', async () => {
      const req = {
        user: {
          role: 'Admin'
        }
      }
      const next = jest.fn()
      await admin(req, {}, next)
      expect(next).toBeCalled()
    })
  })
})
