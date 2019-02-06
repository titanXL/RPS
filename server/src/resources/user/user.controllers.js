import { User } from './user.model'
import { logger } from '../../config/logging'

export const getAll = async (req, res) => {
  try {
    const users = await User.find({ role: 'User' })
      .lean()
      .exec()

    res.status(200).json({ data: users })
  } catch (error) {
    logger.info(error)
    res.status(400).send({ message: 'Something went wrong fetching users' })
  }
}

export const getById = async (req, res) => {
  try {
    const user = req.user
    res.status(200).json({ data: user })
  } catch (error) {
    logger.info(error)
    res.status(400).send({ message: 'Something went wrong getting user' })
  }
}

export const updateById = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true
    })
      .lean()
      .exec()

    res.status(200).json({ data: user })
  } catch (error) {
    logger.info(error)
    res.status(400).send({ message: 'Something went wrong updating user' })
  }
}

export const deleteById = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id)
    res.status(200).end()
  } catch (error) {
    logger.info(error)
    res.status(400).send({ message: 'Something went wrong deleting user' })
  }
}
