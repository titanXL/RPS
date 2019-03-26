import supertest from 'supertest'
import { app } from '../../../server'
import { Student } from '../student.model'
import { User } from '../../user/user.model'
import { newToken } from '../../../utils/auth'

describe('Student controller', () => {
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
    expect.assertions(3)
    await supertest(app)
      .post('/api/students')
      .send({
        name: 'test student',
        email: 'test-student@test.com',
        phoneNumber: '123123',
        pid: '1234567890'
      })
      .set({ Authorization: token, Accept: 'application/json' })

    const response2 = await supertest(app)
      .post('/api/students')
      .send({
        name: 'test student',
        email: 'test-student@test.com',
        phoneNumber: '123123',
        pid: '1234567890'
      })
      .set({ Authorization: token, Accept: 'application/json' })
    expect(response2.status).toBe(400)
    const errorMessage = JSON.parse(response2.text).message
    const type = JSON.parse(response2.text).type
    expect(errorMessage).toBeTruthy()
    expect(type).toBe('error')
  })

  test('creates student and sets status 201', async () => {
    const response = await supertest(app)
      .post('/api/students')
      .send({
        name: 'test student',
        email: 'test-student@test.com',
        phoneNumber: '123123',
        pid: '1234567890'
      })
      .set({ Authorization: token, Accept: 'application/json' })
    expect(response.status).toBe(201)
    const name = JSON.parse(response.text).data.name
    const type = JSON.parse(response.text).type
    expect(name).toBe('test student')
    expect(type).toBe('success')
  })

  test('gets all students and sends status 200', async () => {
    expect.assertions(3)
    await supertest(app)
      .post('/api/students')
      .send({
        name: 'test student',
        email: 'test-student@test.com',
        phoneNumber: '123123',
        pid: '1234567890'
      })
      .set({ Authorization: token, Accept: 'application/json' })
    await supertest(app)
      .post('/api/students')
      .send({
        name: 'test student2',
        email: 'test-student1@test.com',
        phoneNumber: '1231234',
        pid: '1234567890'
      })
      .set({ Authorization: token, Accept: 'application/json' })

    const response = await supertest(app)
      .get('/api/students')
      .set({ Authorization: token, Accept: 'application/json' })

    expect(response.status).toBe(200)
    const data = JSON.parse(response.text).data
    const type = JSON.parse(response.text).type
    expect(data).toHaveLength(2)
    expect(type).toBe('success')
  })
  test('gets student with status 200', async () => {
    expect.assertions(3)

    const res = await supertest(app)
      .post('/api/students')
      .send({
        name: 'test student2',
        email: 'test-student@test.com',
        phoneNumber: '1231234',
        pid: '1234567890'
      })
      .set({ Authorization: token, Accept: 'application/json' })
    const studentid = JSON.parse(res.text).data._id
    const response = await supertest(app)
      .get(`/api/students/${studentid}`)
      .set({ Authorization: token, Accept: 'application/json' })
    expect(response.status).toBe(200)
    const st = JSON.parse(response.text).data
    const type = JSON.parse(response.text).type

    expect(st.name).toBe('test student2')
    expect(type).toBe('success')
  })

  test('Updates student, sets status 200 and returns updated user', async () => {
    expect.assertions(3)
    const res = await supertest(app)
      .post('/api/students')
      .send({
        name: 'test student2',
        email: 'test-student@test.com',
        phoneNumber: '1231234',
        pid: '1234567890'
      })
      .set({ Authorization: token, Accept: 'application/json' })
    const studentid = JSON.parse(res.text).data._id
    const response = await supertest(app)
      .patch(`/api/students/${studentid}`)
      .send({ name: 'TESTING STUDENT 2' })
      .set({ Authorization: token, Accept: 'application/json' })
    const updatedStudent = JSON.parse(response.text).data
    const type = JSON.parse(response.text).type

    expect(response.status).toBe(200)
    expect(updatedStudent.name).toBe('TESTING STUDENT 2')
    expect(type).toBe('success')
  })
  test('Deletes student and sends status 200', async () => {
    expect.assertions(2)
    const res = await supertest(app)
      .post('/api/students')
      .send({
        name: 'test student2',
        email: 'test-student@test.com',
        phoneNumber: '1231234',
        pid: '1234567890'
      })
      .set({ Authorization: token, Accept: 'application/json' })
    const studentid = JSON.parse(res.text).data._id
    const response = await supertest(app)
      .delete(`/api/students/${studentid}`)
      .send({ name: 'TESTING STUDENT 2' })
      .set({ Authorization: token, Accept: 'application/json' })
    expect(response.status).toBe(200)
    const found = await Student.findById(studentid).exec()
    expect(found).toBeNull()
  })
})
