const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
  const user = await User.findById(request.body.userId);
  console.log('🚀 ~ user', user);
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
});

blogsRouter.delete('/:id', async (req, res) => {
  const id = req.params.id;
  const result = await Blog.findByIdAndRemove(id);

  if (result) {
    return res.status(204).end();
  } else {
    return res.status(404).end();
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
