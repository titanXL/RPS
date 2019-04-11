import { Student } from '../student.model'
import { prefillStudent } from '../student.router'

describe('Student prefill', () => {
  test('prefills student in req', async () => {
    expect.assertions(1)
    const s = await Student.create({
      name: 'test student2',
      email: 'test-student@test.com',
      phoneNumber: '1231234',
      pid: '1234567890'
    })
    let req = { body: {}, params: { studentid: s.id } }
    await prefillStudent(req, {}, () => {})
    expect(req.student.name).toBe('test student2')
  })
})
