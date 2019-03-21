import mongoose from 'mongoose'
import encrypt from 'mongoose-encryption'
import Joi from 'joi'

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 5,
      required: true,
      index: true
    },
    email: {
      type: String,
      minlength: 3,
      required: true
    },
    phoneNumber: {
      type: String,
      minlength: 5,
      required: true
    },
    address: {
      type: String
    },
    pid: {
      type: String,
      unique: true,
      required: true,
      select: false
    },
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
      }
    ],
    invoices: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Invoice'
      }
    ],
    studentId: String,
    school: String
  },
  { timestamps: true }
)

studentSchema.plugin(encrypt, {
  secret: process.env.sigKey,
  encryptedFields: ['pid']
})

export const validateStudent = student => {
  const schema = {
    name: Joi.string()
      .min(5)
      .required(),
    email: Joi.string()
      .min(3)
      .required(),
    phoneNumber: Joi.string()
      .min(5)
      .required(),
    pid: Joi.number().required(),
    studentId: Joi.string(),
    school: Joi.string()
  }
  return Joi.validate(student, schema)
}

export const Student = mongoose.model('Student', studentSchema)
