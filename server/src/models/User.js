import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 60 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 8, select: false },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  avatarColor: { type: String, default: '#e9a274' }
}, { timestamps: true });

userSchema.pre('save', async function () {
  if (this.isModified('password') && this.password) this.password = await bcrypt.hash(this.password, 12);
});
userSchema.methods.comparePassword = function (candidate) {
  return this.password ? bcrypt.compare(candidate, this.password) : false;
};
userSchema.set('toJSON', { transform: (_doc, ret) => { delete ret.password; delete ret.__v; return ret; } });
export default mongoose.model('User', userSchema);


