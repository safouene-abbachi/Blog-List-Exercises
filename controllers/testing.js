const testingRouter = require('express').Router();
const Blogs = require('../models/blog');
const User = require('../models/user');

testingRouter.post('/reset', async (req, res) => {
  await Blogs.deleteMany({});
  await User.deleteMany({});

  res.status(204).end();
});

module.exports = testingRouter;
