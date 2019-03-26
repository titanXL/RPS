import mongoose from 'mongoose'
import encrypt from 'mongoose-encryption'
import Joi from 'joi'

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 5,
      required: true
    },
    email: {
      type: String,
      minlength: 3,
      required: true,
      unique: true
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
      required: true,
      select: false,
      validate: {
        validator: function(v) {
          return v.length === 10
        },
        message: props => `${props.value} is not a valid personal ID`
      }
    },
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
      }
    ],
    payments: [
      {
        objectId: {
          type: mongoose.Schema.Types.ObjectId,
          instalments: {
            type: Number,
            default: 0
          },
          invoices: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Invoice'
            }
          ],
          paid: {
            type: Boolean,
            default: false
          }
        }
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

studentSchema.index({ name: 'text' })

studentSchema.statics.getUnpaid = async function() {
  return this.find({})
  // .aggregate([
  //   {
  //     $match: { }
  //   }
  // ])
}

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
