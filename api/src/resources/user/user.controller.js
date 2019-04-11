import { User } from './user.model'
import asyncMiddleware from '../../middleware/async'

export const getAll = asyncMiddleware(async (req, res, next) => {
  const users = await User.find({ role: 'User' })
    .lean()
    .exec()

  res.status(200).json({ data: users, type: 'success' })
})

export const getById = asyncMiddleware(async (req, res, next) => {
  const user = req.user
  res.status(200).json({ data: user, type: 'success' })
})

export const updateById = asyncMiddleware(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user._id, req.body, {
    new: true
  })
    .lean()
    .exec()

  res.status(200).json({ data: user, type: 'success' })
})

export const deleteById = asyncMiddleware(async (req, res, next) => {
  const deactivatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      status: 'Deactivated'
    },
    {
      new: true
    }
  )
  res.status(200).json({ data: deactivatedUser, type: 'success' })
})
