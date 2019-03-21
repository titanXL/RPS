import { User } from './user.model'
import { logger } from '../../config/logging'

export const getAll = async (req, res, next) => {
  try {
    const users = await User.find({ role: 'User' })
      .lean()
      .exec()

    res.status(200).json({ data: users, type: 'success' })
  } catch (error) {
    logger.info(error)
    error.customMessage = 'Something went wrong fetching users'
    next(error)
  }
}

export const getById = async (req, res, next) => {
  try {
    const user = req.user
    res.status(200).json({ data: user, type: 'success' })
  } catch (error) {
    logger.info(error)
    error.customMessage = `Something went wrong fetching user ${
      req.user.username
    }`
    next(error)
  }
}

export const updateById = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true
    })
      .lean()
      .exec()

    res.status(200).json({ data: user, type: 'success' })
  } catch (error) {
    logger.info(error)
    error.customMessage = `Something went wrong updating user ${
      req.user.username
    }`
    next(error)
  }
}

export const deleteById = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.user._id)
    res.status(200).end()
  } catch (error) {
    logger.info(error)
    error.customMessage = `Something went wrong deleting user ${
      req.user.username
    }`
    next(error)
  }
}
