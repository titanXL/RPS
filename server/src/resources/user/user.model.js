import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import Joi from 'joi'

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      minlength: [5, 'Username should be at least 5 chars long'],
      required: true,
      unique: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['Admin', 'User'],
      default: 'User'
    }
  },
  { timestamps: true }
)

userSchema.pre('save', function(next) {
  if (!this.isModified('password')) {
    return next()
  }

  bcrypt.hash(this.password, 8, (err, hash) => {
    if (err) {
      return next(err)
    }

    this.password = hash
    next()
  })
})

userSchema.methods.checkPassword = function(password) {
  const passwordHash = this.password
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, passwordHash, (err, same) => {
      if (err) {
        return reject(err)
      }

      resolve(same)
    })
  })
}

export const seedAdmin = async () => {
  let admin = await User.findOne({ username: process.env.ADMIN_USERNAME })

  if (admin) {
    return admin
  }
  admin = await User.create({
    username: process.env.ADMIN_USERNAME,
    password: process.env.ADMIN_PASSWORD,
    role: 'Admin'
  })
  return admin
}

export const validateUser = user => {
  const schema = {
    username: Joi.string()
      .min(5)
      .required(),
    password: Joi.string()
      .min(5)
      .required()
  }

  return Joi.validate(user, schema)
}

export const User = mongoose.model('user', userSchema)
