import { User } from './user.model'

export const me = (req, res) => {
  res.status(200).json({ data: req.user })
}

export const updateMe = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true
    })
      .lean()
      .exec()

    res.status(200).json({ data: user })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

export const getAll = async (req, res) => {
  try {
    const users = await User.find({ role: 'User' })
      .lean()
      .exec()

    res.status(200).json({ data: users })
  } catch (error) {
    console.log(error)
    res.status(400).end()
  }
}

export const getById = async (req, res) => {}

export const updateById = async (req, res) => {}

export const deleteById = async (req, res) => {}
