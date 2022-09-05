const usersRouter = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');

usersRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate('blogs');
  res.status(200).json(users);
});

usersRouter.post('/', async (req, res, next) => {
  try {
    const { username, name, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: 'both username and password are required' });
    }
    if (password.length <= 3) {
      return res
        .status(400)
        .json({ error: 'password must be at least 3 characters long' });
    }
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'username must be unique' });
    }

    const saltRound = 10;
    const passwordHash = await bcrypt.hash(password, saltRound);
    const user = new User({
      username,
      name,
      passwordHash,
    });

    const savedUser = await user.save();
    console.log('🚀 ~ savedUser', savedUser);

    res.status(201).json(savedUser);
  } catch (error) {
    next(error);
  }
});

module.exports = usersRouter;
