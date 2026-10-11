import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    itemDetail: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'products_Store', required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        image: { type: String, required: true },
      },
    ],
    shippingAddress: {
      address: { type: String, required: true },
      phone: { type: Number, required: true },
    },
    paymentMethod: {
      type: String,
      enum: ['cod', 'card', 'stripe'],
      default: 'cod',
    },
    totalAmount: { type: Number, required: true },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date, default: null },
    orderStatus: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

const orderModal = mongoose.model('order', orderSchema);
export default orderModal;
