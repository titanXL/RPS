import { User } from '../user.model'
import { getAll } from '../user.controller'

describe('User router', () => {
  test('prefills req.user with found user based on params', async () => {
    await User.create({
      username: 'test-user',
      password: 'test-password'
    })
    const req = { body: {} }
    const res = {
      status(status) {
        expect(status).toBe(200)
        return this
      },
      json(result) {
        expect(result.data[0].name).toBe('test-user')
      }
    }
    await getAll(req, res, () => {})
  })
})
