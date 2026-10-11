import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    otp: { type: Number, default: null },
    isExpire: { type: Date, default: null },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const userModal = mongoose.model('user', userSchema);
export default userModal;
