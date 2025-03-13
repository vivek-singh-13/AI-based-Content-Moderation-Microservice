const express = require('express');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const Comment = require('../models/Comment');
const FlaggedComment = require('../models/FlaggedComment');
const authenticateUser = require('../middleware/authMiddleware');
const { LanguageServiceClient } = require('@google-cloud/language');
require('dotenv').config();

const client = new LanguageServiceClient();
const router = express.Router();

// Post a comment with AI moderation
router.post('/', authenticateUser, async (req, res) => {
  try {
    const { text, postId } = req.body;
    const userId = req.user.id;

    if (!postId) return res.status(400).json({ message: "Post ID is required" });

    // Send text to AI Moderation API
    const document = { content: text, type: 'PLAIN_TEXT' };
    const [result] = await client.analyzeSentiment({ document });
    const sentimentScore = result.documentSentiment.score;
    const flagged = sentimentScore < -0.5;

    if (flagged) {
      const flaggedComment = new FlaggedComment({
        userId,
        postId,
        text,
        reason: "Negative sentiment detected"
      });
      await flaggedComment.save();
      return res.status(201).json({ message: "Comment flagged for moderation", flagged: true });
    }

    const comment = new Comment({ userId, postId, text });
    await comment.save();

    res.status(201).json({ message: "Comment posted successfully", flagged: false });
  } catch (error) {
    console.error("Error posting comment:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// Fetch non-flagged comments for a specific post
router.get('/', async (req, res) => {
  try {
    const { postId } = req.query;
    if (!postId) return res.status(400).json({ message: "Post ID is required" });

    const comments = await Comment.find({ postId }).populate('userId', 'username');
    res.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// Fetch flagged comments for a specific user
router.get('/flagged', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const flaggedComments = await FlaggedComment.find({ userId }).populate('postId', 'title');
    res.json(flaggedComments);
  } catch (error) {
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
