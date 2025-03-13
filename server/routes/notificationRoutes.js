const express = require('express');
const authenticateUser = require('../middleware/authMiddleware');
const FlaggedComment = require('../models/FlaggedComment');
const Post = require('../models/Post');
const router = express.Router();

// Get flagged comments for a specific user
router.get('/flagged', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;

    // Find all flagged comments by the user
    const flaggedComments = await FlaggedComment.find({ userId }).populate('postId', 'title');

    const enrichedNotifications = flaggedComments.map(comment => ({
      text: comment.text,
      reason: comment.reason,
      postTitle: comment.postId ? comment.postId.title : "Unknown Post"
    }));

    res.json(enrichedNotifications.reverse()); // Show newest notifications first
  } catch (error) {
    console.error("Error fetching flagged comments:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// Fetch all flagged comments for moderation
router.get('/moderation/all-flagged', authenticateUser, async (req, res) => {
  try {
    const flaggedComments = await FlaggedComment.find().populate('userId', 'username').populate('postId', 'title');
    res.json(flaggedComments);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;

