const express = require('express');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const FlaggedComment = require('../models/FlaggedComment');
const router = express.Router();

// Get all posts with comment counts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find();
    const postsWithCommentCounts = await Promise.all(posts.map(async (post) => {
      const commentCount = await Comment.countDocuments({ postId: post._id });
      return { ...post.toObject(), commentCount };
    }));
    res.json(postsWithCommentCounts);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// Get a single post by ID with its comments and flagged comments
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    
    const comments = await Comment.find({ postId: req.params.id });
    const flaggedComments = await FlaggedComment.find({ postId: req.params.id });
    
    res.json({ post, comments, flaggedComments });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;
