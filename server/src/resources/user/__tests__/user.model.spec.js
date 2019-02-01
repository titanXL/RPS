import { seedAdmin } from '../user.model'
import { config } from '../../../config/testing'

describe('User model', () => {
  test('Should not create a second admin after seed', async () => {
    await seedAdmin()

    const seededAdmin = await seedAdmin()

    expect(seededAdmin.username).toEqual(config.adminUsername)
  })
})
