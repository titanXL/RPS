import supertest from 'supertest'
import { app } from '../../../server'
import { Student } from '../student.model'
import { User } from '../../user/user.model'
import { newToken } from '../../../utils/auth'

describe('Test student controller', () => {
  let token = 'Bearer '
  let user
  beforeEach(async () => {
    user = await User.create({
      username: 'test-user',
      password: 'test-password',
      confirmPassword: 'test-password'
    })
    token += await newToken(user)
  })

  afterEach(async () => {
    await User.findByIdAndDelete(user._id)
    user = null
    token = 'Bearer '
  })
  test('sets status 400 and returns an error object if student exists', async () => {
    await supertest(app)
      .post('/api/students')
      .send({
        name: 'test student',
        email: 'test-student@test.com',
        phoneNumber: '123123',
        pid: '123456789'
      })
      .set({ Authorization: token, Accept: 'application/json' })

    const response2 = await supertest(app)
      .post('/api/students')
      .send({
        name: 'test student',
        email: 'test-student@test.com',
        phoneNumber: '123123',
        pid: '123456789'
      })
      .set({ Authorization: token, Accept: 'application/json' })
    expect(response2.status).toBe(400)
    const errorMessage = JSON.parse(response2.text).error
    expect(errorMessage).toBeTruthy()
  })

  test('creates student and sets status 201', async () => {
    const response = await supertest(app)
      .post('/api/students')
      .send({
        name: 'test student',
        email: 'test-student@test.com',
        phoneNumber: '123123',
        pid: '123456789'
      })
      .set({ Authorization: token, Accept: 'application/json' })
    expect(response.status).toBe(201)
    const name = JSON.parse(response.text).data.name
    expect(name).toBe('test student')
  })
})
