import mongoose from 'mongoose';


import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Middleware pour hacher le mot de passe avant save
userSchema.pre('save', async function (next) {
  const user = this as any;
  if (!user.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (err) {
  next(err as import('mongoose').CallbackError);
  }
});

export default mongoose.model('User', userSchema);