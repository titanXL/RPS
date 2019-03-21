import supertest from 'supertest'
import { app } from '../../../server'
import { User } from '../../user/user.model'
import { newToken } from '../../../utils/auth'
import { Teacher } from '../teacher.model'

describe('Teacher controller', () => {
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

  test('GET /:teacherid => return teacher', async () => {
    expect.assertions(2)
    const res = await supertest(app)
      .post('/api/teachers')
      .send({
        name: 'test teaher',
        phoneNumber: '123123',
        teaches: {
          language: 'English',
          level: 'A1'
        }
      })
      .set({ Authorization: token, Accept: 'application/json' })
    const teacherid = JSON.parse(res.text).data._id
    const response = await supertest(app)
      .get(`/api/teachers/${teacherid}`)
      .set({ Authorization: token, Accept: 'application/json' })
    const teacher = JSON.parse(response.text).data
    expect(response.status).toBe(200)
    expect(teacher.teaches.language).toBe('English')
  })

  test('GET / returns all teachers', async () => {
    await supertest(app)
      .post('/api/teachers')
      .send({
        name: 'test teaher',
        phoneNumber: '123123',
        teaches: {
          language: 'English',
          level: 'A1'
        }
      })
      .set({ Authorization: token, Accept: 'application/json' })
    const response = await supertest(app)
      .get(`/api/teachers`)
      .set({ Authorization: token, Accept: 'application/json' })
    const text = JSON.parse(response.text)
    expect(text.data).toHaveLength(1)
  })

  test('PATCH /:teacherid => returns updated teacher', async () => {
    expect.assertions(3)
    const res = await supertest(app)
      .post('/api/teachers')
      .send({
        name: 'test teaher',
        phoneNumber: '123123',
        teaches: {
          language: 'English',
          level: 'A1'
        }
      })
      .set({ Authorization: token, Accept: 'application/json' })
    const teacherid = JSON.parse(res.text).data._id
    const response = await supertest(app)
      .patch(`/api/teachers/${teacherid}`)
      .send({ teaches: { language: 'Spanish', level: 'B2' } })
      .set({ Authorization: token, Accept: 'application/json' })
    const teacher = JSON.parse(response.text).data
    expect(response.status).toBe(200)
    expect(teacher.teaches.language).toBe('Spanish')
    expect(teacher.teaches.level).toBe('B2')
  })

  test('DELETE /:teacherid => void', async () => {
    const res = await supertest(app)
      .post('/api/teachers')
      .send({
        name: 'test teaher',
        phoneNumber: '123123',
        teaches: {
          language: 'English',
          level: 'A1'
        }
      })
      .set({ Authorization: token, Accept: 'application/json' })
    const teacherid = JSON.parse(res.text).data._id
    await supertest(app)
      .delete(`/api/teachers/${teacherid}`)
      .set({ Authorization: token, Accept: 'application/json' })
    const deletedTeacher = await Teacher.findById(teacherid)
    expect(deletedTeacher).toBeNull()
  })
})
