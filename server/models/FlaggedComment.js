const mongoose = require('mongoose');

const FlaggedCommentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    text: { type: String, required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ['pending', 'reviewed', 'approved', 'rejected'], default: 'pending' },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // If reviewed by a moderator
  }, { timestamps: true });
  
  module.exports = mongoose.model('FlaggedComment', FlaggedCommentSchema);
  