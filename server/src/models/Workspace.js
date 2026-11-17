import mongoose from 'mongoose';

const workspaceSchema = new mongoose.Schema({
  key: { type: String, unique: true, default: 'primary', immutable: true },
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 50, default: 'Growth Tech' },
}, { timestamps: true });

export default mongoose.model('Workspace', workspaceSchema);
