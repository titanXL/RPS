import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import Joi from 'joi'

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      minlength: [3, 'Username should be at least 3 chars long'],
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
      enum: ['Admin', 'User', 'Other'],
      default: 'User'
    },
    status: {
      type: String,
      enum: ['Active', 'Deactivated'],
      default: 'Active'
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

userSchema.post('save', function(error, _, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('Username already exists'))
  } else {
    next()
  }
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
      .min(3)
      .required(),
    password: Joi.string()
      .min(5)
      .required()
  }

  return Joi.validate(user, schema)
}

export const User = mongoose.model('User', userSchema)
