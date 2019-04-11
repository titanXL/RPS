import mongoose from 'mongoose'

const contentSchema = new mongoose.Schema({
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
  }
})

export const Content = mongoose.model('CourseContent', contentSchema)
