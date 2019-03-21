import supertest from 'supertest'
import { app } from '../../../server'
import { Teacher } from '../teacher.model'

describe('Teacher router', () => {
  test('prefills req.teacher with found teacher based on params', async () => {
    const teacher = await Teacher.create({
      name: 'test-teacher',
      phoneNumber: '123456789',
      teaches: {
        language: 'English',
        level: 'A1'
      }
    })
    await supertest(app).get(`/api/teachers/${teacher._id}`)
  })
})
