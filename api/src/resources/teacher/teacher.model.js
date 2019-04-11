import mongoose from 'mongoose'
import Joi from 'joi'

const teacherSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: [3, 'Name should be at least 3 chars long'],
      required: true,
      unique: true,
      trim: true
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
      minlength: [5, 'Phone number is not correct']
    },
    teaches: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
      }
    ],
    status: {
      type: String,
      enum: ['Active', 'Deactivated'],
      default: 'Active'
    }
  },
  { timestamps: true }
)

export const validateTeacher = teacher => {
  const schema = {
    username: Joi.string()
      .min(3)
      .required(),
    phoneNumber: Joi.string()
      .min(5)
      .required()
  }

  return Joi.validate(teacher, schema)
}

export const Teacher = mongoose.model('Teacher', teacherSchema)
