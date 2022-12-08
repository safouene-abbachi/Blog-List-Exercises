const commentRouter = require('express').Router();
const Comment = require('../models/comment');
const Blog = require('../models/blog');
const { userExtractor } = require('../utils/middlware');

commentRouter.get('/:id/comments', async (req, res, next) => {
  try {
    const { id } = req.params;

    const comments = await Comment.findById(id).populate('comment');
    res.json(comments);
  } catch (error) {
    next(error);
  }
});

commentRouter.post('/:id/comments', userExtractor, async (req, res, next) => {
  try {
    const { id } = req.params;

    const { title } = req.body;

    const blog = await Blog.findById(id);

    if (!blog) {
      res.status(404).json('No blog found');
      return;
    }
    const comment = new Comment({
      title: title,
    });
    const savedComment = await comment.save();

    blog.comments = [...blog.comments, savedComment];
    await blog.save();

    res.status(200).json(savedComment.toJSON());
  } catch (error) {
    next(error);
  }
});

module.exports = commentRouter;
