const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const supertest = require('supertest');
const helper = require('./test_helper');
const app = require('../app');
const api = supertest(app);
const User = require('../models/user');

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const passwordHash = await bcrypt.hash('SECRET', 10);
    const user = new User({
      username: 'root',
      passwordHash,
    });
    await user.save();
  }, 100000);

  test('creation succeed with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb();
    const newUser = {
      username: 'elcapo',
      name: 'capo',
      password: 'salem',
    };
    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-type', /application\/json/);
    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd.length).toBe(usersAtStart.length + 1);
    const userNames = usersAtEnd.map((user) => user.username);
    expect(userNames).toContain(newUser.username);
  }, 100000);

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb();
    const newUser = {
      username: 'root',
      name: 'saf',
      password: '4546546',
    };
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);
    expect(result.body.error).toContain('username must be unique');
    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  }, 100000);
});

afterAll(() => {
  mongoose.connection.close();
});
