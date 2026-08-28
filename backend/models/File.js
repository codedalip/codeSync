const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  workspace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workspace',
    required: true
  },
  name: {
    type: String,
    required: [true, 'File name is required'],
    trim: true
  },
  language: {
    type: String,
    default: 'javascript'
  },
  content: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('File', fileSchema);
