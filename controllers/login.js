const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const loginRouter = require('express').Router();
const User = require('../models/user');

loginRouter.post('/', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    const correctPassword =
      user === null ? false : await bcrypt.compare(password, user.passwordHash);

    if (!(user && correctPassword)) {
      res.status(401).json({ error: 'invalid username or password' });
    }

    const userForToken = {
      username: user.username,
      id: user._id,
    };

    const token = jwt.sign(userForToken, process.env.SECRET);
    res.status(200).send({ token, usename: user.username, name: user.name });
  } catch (error) {
    next(error);
  }
});

module.exports = loginRouter;
