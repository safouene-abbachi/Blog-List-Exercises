const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body);
  if (!blog.likes) {
    blog.likes = 0;
  }
  if (!blog.title || !blog.url) {
    return response.status(400).json('missing property');
  }
  const newlyAdded = await blog.save();

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
