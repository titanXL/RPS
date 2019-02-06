import supertest from 'supertest'
import { app } from '../../../server'
import { User } from '../user.model'
import { getById } from '../user.controllers'

describe('User router', () => {
  test('prefills req.user with found user based on params', async () => {
    const user = await User.create({
      username: 'test-user',
      password: 'test-password'
    })
    const response = await supertest(app).get(`/api/users/${user._id}`)
    console.log(response)
  })
})
