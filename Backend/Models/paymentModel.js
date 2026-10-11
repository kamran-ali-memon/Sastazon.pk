import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'order', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    stripeSessionid: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'paid', 'cancelled'], default: 'pending', required: true },
  },
  { timestamps: true }
);

const paymentModel = mongoose.model('payment', paymentSchema);
export default paymentModel;
