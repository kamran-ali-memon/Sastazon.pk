import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true, unique: true },
    cartItems: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'products_Store', required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        image: { type: String, required: true },
        quantity: { type: Number, required: true, default: 1 },
      },
    ],
  },
  { timestamps: true }
);

const cartModel = mongoose.model('cart', cartSchema);
export default cartModel;
