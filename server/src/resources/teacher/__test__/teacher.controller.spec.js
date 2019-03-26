import supertest from 'supertest'
import { app } from '../../../server'
import { User } from '../../user/user.model'
import { newToken } from '../../../utils/auth'
import { Teacher } from '../teacher.model'

describe('Teacher controller', () => {
  let user
  let teacher
  let token = 'Bearer '
  beforeEach(async () => {
    user = await User.create({
      username: 'test-user',
      password: 'test-password'
    })
    token += await newToken(user)
    teacher = await Teacher.create({
      name: 'test teaher',
      phoneNumber: '123123'
    })
  })

  afterEach(async () => {
    await User.findByIdAndDelete(user._id)
    await Teacher.findByIdAndDelete(teacher.id)
    teacher = null
    user = null
    token = 'Bearer '
  })

  test('GET /:teacherid => return teacher', async () => {
    expect.assertions(2)
    const response = await supertest(app)
      .get(`/api/teachers/${teacher.id}`)
      .set({ Authorization: token, Accept: 'application/json' })
    const t = JSON.parse(response.text).data
    expect(response.status).toBe(200)
    expect(t.name).toBe('test teaher')
  })

  test('GET / returns all teachers', async () => {
    const response = await supertest(app)
      .get(`/api/teachers`)
      .set({ Authorization: token, Accept: 'application/json' })
    const text = JSON.parse(response.text)
    expect(text.data).toHaveLength(1)
  })

  // TODO: Test teaches content/courses
  test('PATCH /:teacherid => returns updated teacher', async () => {
    expect.assertions(2)
    const response = await supertest(app)
      .patch(`/api/teachers/${teacher.id}`)
      .send({ name: 'John' })
      .set({ Authorization: token, Accept: 'application/json' })
    const t = JSON.parse(response.text).data
    expect(response.status).toBe(200)
    expect(t.name).toBe('John')
  })

  test('Deactivate /:teacherid/deactivate => void', async () => {
    await supertest(app)
      .patch(`/api/teachers/${teacher.id}/deactivate`)
      .set({ Authorization: token, Accept: 'application/json' })
    const deactivatedTeacher = await Teacher.findById(teacher.id)
    expect(deactivatedTeacher.status).toBe('Unactive')
  })
})
