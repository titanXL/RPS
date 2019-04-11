import mongoose from 'mongoose'
const invoiceSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
})

export const Invoice = mongoose.model('Invoice', invoiceSchema)
