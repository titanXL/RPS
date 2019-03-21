import { User } from '../user.model'
import { prefillUser } from '../user.router'

describe('User prefill', () => {
  test('prefills user in req', async () => {
    expect.assertions(1)
    const user = await User.create({
      username: 'test-user',
      password: 'test-password'
    })
    let req = { body: {}, params: { userid: user.id } }
    await prefillUser(req, {}, () => {})
    expect(req.user.username).toBe('test-user')
  })
})
