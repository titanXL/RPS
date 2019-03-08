import supertest from 'supertest'
import { app } from '../../../server'
import { User } from '../user.model'

describe('User router', () => {
  test('prefills req.user with found user based on params', async () => {
    const user = await User.create({
      username: 'test-user',
      password: 'test-password',
      confirmPassword: 'testing'
    })
    await supertest(app).get(`/api/users/${user._id}`)
  })
})
