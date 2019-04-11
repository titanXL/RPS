import { Teacher } from '../teacher.model'
import { prefillTeacher } from '../teacher.router'

describe('Teacher prefill', () => {
  test('prefills teacher in req', async () => {
    expect.assertions(1)
    const t = await Teacher.create({
      name: 'test teaher',
      phoneNumber: '123123'
    })
    let req = { body: {}, params: { teacherid: t.id } }
    await prefillTeacher(req, {}, () => {})
    expect(req.teacher.name).toBe('test teaher')
  })
})
