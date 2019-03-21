import supertest from 'supertest'
import { app } from '../../../server'
import { Teacher } from '../teacher.model'
import { getAll } from '../teacher.controller'

describe('Teacher router', () => {
  test('prefills req.teacher with found teacher based on params', async () => {
    expect.assertions(2)
    await Teacher.create({
      name: 'test-teacher',
      phoneNumber: '123456789',
      teaches: {
        language: 'English',
        level: 'A1'
      }
    })
    const req = { body: {} }
    const res = {
      status(status) {
        expect(status).toBe(200)
        return this
      },
      json(result) {
        expect(result.data[0].name).toBe('test-teacher')
      }
    }
    await getAll(req, res, () => {})
  })
})
