const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const { userExtractor } = require('../utils/middlware');

blogsRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate('user', {
      username: 1,
      name: 1,
    });
    response.json(blogs);
  } catch (error) {
    next(error);
  }
});

blogsRouter.post('/', userExtractor, async (request, response, next) => {
  try {
    const user = request.user;

    const blog = new Blog({ ...request.body, user: user._id });
    if (!blog.likes) {
      blog.likes = 0;
    }
    if (!blog.title || !blog.url) {
      return response.status(400).json('missing property');
    }
    const newlyAdded = await blog.save();
    user.blogs = user.blogs.concat(blog._id);
    user.save();
    return response.status(201).json(newlyAdded);
  } catch (error) {
    next(error);
  }
});

blogsRouter.delete('/:id', userExtractor, async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(401).json({ error: 'blog does not exist' });
    }

    if (blog.user.toString() === user._id.toString()) {
      await Blog.findByIdAndRemove(id);

      return res.status(204).end();
    } else {
      return res
        .status(401)
        .json({ error: 'You are not authorized to delete this blog' })
        .end();
    }
  } catch (error) {
    next(error);
  }
});

blogsRouter.put('/:id', async (req, res) => {
  const id = req.params.id;
  const { title, author, url, likes } = req.body;

  const blog = {
    title,
    author,
    url,
    likes,
  };
  const result = await Blog.findByIdAndUpdate(id, blog, { new: true });
  if (result) {
    return res.status(200).end();
  } else {
    return res.status(404).end;
  }
});

module.exports = blogsRouter;
