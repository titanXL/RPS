import supertest from 'supertest'
import { app } from '../../../server'
import { User } from '../user.model'
import { newToken } from '../../../utils/auth'

describe('User controller', () => {
  let user
  let token = 'Bearer '
  beforeEach(async () => {
    user = await User.create({
      username: 'test-user',
      password: 'test-password'
    })
    token += await newToken(user)
  })

  afterEach(async () => {
    await User.findByIdAndDelete(user._id)
    user = null
    token = 'Bearer '
  })

  test('GET /:userid => return user', async () => {
    const response = await supertest(app)
      .get(`/api/users/${user._id}`)
      .set({ Authorization: token, Accept: 'application/json' })
    const text = JSON.parse(response.text)
    expect(text.data.username).toBe('test-user')
  })

  test('GET / return all users(not admin role)', async () => {
    const response = await supertest(app)
      .get(`/api/users`)
      .set({ Authorization: token, Accept: 'application/json' })
    const text = JSON.parse(response.text)
    expect(text.data).toHaveLength(1)
  })

  test('PATCH /:userid => returns updated user', async () => {
    const response = await supertest(app)
      .patch(`/api/users/${user._id}`)
      .send({
        username: 'TEST'
      })
      .set({ Authorization: token, Accept: 'application/json' })
    const text = JSON.parse(response.text)
    expect(text.data.username).toEqual('TEST')
  })

  test('DELETE /:userid => void', async () => {
    await supertest(app)
      .delete(`/api/users/${user._id}`)
      .set({ Authorization: token, Accept: 'application/json' })
    const deletedUser = await User.findById(user._id)
    expect(deletedUser).toBeNull()
  })

  test('DELETE /:userid => response status 500', async () => {
    const response = await supertest(app)
      .delete(`/api/users/12333`)
      .set({ Authorization: token, Accept: 'application/json' })
    expect(response.status).toBe(400)
  })
})
