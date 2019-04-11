import mongoose from 'mongoose'
const courseSchema = new mongoose.Schema({
  content: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CourseContent'
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
  },
  capacity: {
    type: Number
  }
})

// TODO: finished methods

courseSchema.virtual('isFull').get(function() {})
courseSchema.virtual('isActive').get(function() {})
courseSchema.virtual('isFinished').get(function() {})
courseSchema.virtual('isAnnounced').get(function() {})

courseSchema.methods.removeTeacher = function(teacherId) {}
courseSchema.methods.addTeacher = function(teacherId) {}
courseSchema.methods.enrollStudent = function(studentId) {}
courseSchema.methods.removeStudent = function(studentId) {}

export const Course = mongoose.model('Course', courseSchema)
