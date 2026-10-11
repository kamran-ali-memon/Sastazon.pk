import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    productname: { type: String, required: true, unique: true, trim: true },
    productSlug: { type: String, required: true, unique: true, lowercase: true },
    productDesc: { type: String, required: true },
    productPrice: { type: Number, required: true },
    productStock: { type: Number, required: true },
    productCategory: { type: String, required: true },
    productImages: [{ type: String, required: true }],
  },
  { timestamps: true }
);

const productModel = mongoose.model('products_Store', productSchema);
export default productModel;
