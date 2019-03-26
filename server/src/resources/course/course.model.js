import mongoose from 'mongoose'
const courseSchema = new mongoose.Schema({
  language: {
    type: String,
    required: true,
    trim: true,
    minlength: [2, 'Language is required']
  },
  level: {
    type: String,
    required: true,
    trim: true
  },
  teachers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher'
    }
  ],
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student'
    }
  ],
  duration: {
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    }
  },
  cost: {
    type: Number,
    required: true,
    min: 0
  }
})

export const Course = mongoose.model('Course', courseSchema)
