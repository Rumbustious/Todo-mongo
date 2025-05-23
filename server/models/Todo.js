const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date },
  dueDate: { type: Date },
  category: {
    name: { type: String },
    color: { type: String } // Stored as hex or rgb string
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

// Add index for better query performance
TodoSchema.index({ user: 1, completed: 1, dueDate: 1 });

module.exports = mongoose.model('Todo', TodoSchema);