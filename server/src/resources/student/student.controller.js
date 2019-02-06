import { Student } from './student.model'

export const createStudent = async (req, res) => {
  const student = await Student.create(req.body)
  res.status(201).json({ data: student })
}
