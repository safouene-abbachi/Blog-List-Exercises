const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const supertest = require('supertest');
const helper = require('./test_helper');
const app = require('../app');
const api = supertest(app);
const User = require('../models/user');
jest.setTimeout(100000);
describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const passwordHash = await bcrypt.hash('SECRET', 10);
    const user = new User({
      username: 'root',
      passwordHash,
    });
    await user.save();
  });

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
  });

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
    expect(usersAtEnd.length).toEqual(usersAtStart.length);
  });
  test('creation fails with proper statuscode and message if username is already taken', async () => {
    const usersAtStart = await helper.usersInDb();
    const newUser = {
      username: 'root',
      name: 'saf',
      password: '241547',
    };
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);
    expect(result.body.error).toContain('username must be unique');
    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd.length).toEqual(usersAtStart.length);
  });
  test('creation fails with proper statuscode and message if username is missing', async () => {
    const usersAtStart = await helper.usersInDb();
    const newUser = {
      name: 'saf',
      password: '241547',
    };
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);
    expect(result.body.error).toContain(
      'both username and password are required'
    );
    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd.length).toEqual(usersAtStart.length);
  });
  test('creation fails with proper statuscode and message if username length  is less then 3 characters long', async () => {
    const usersAtStart = await helper.usersInDb();
    const newUser = {
      username: 'sa',
      name: 'saf',
      password: '241547',
    };
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);
    expect(result.body.error).toContain(
      'Path `username` (`sa`) is shorter than the minimum allowed length (3).'
    );
    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd.length).toEqual(usersAtStart.length);
  });
  test('creation fails with proper statuscode and message if password is missing', async () => {
    const usersAtStart = await helper.usersInDb();
    const newUser = {
      username: 'root',
      name: 'saf',
    };
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);
    expect(result.body.error).toContain(
      'both username and password are required'
    );
    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd.length).toEqual(usersAtStart.length);
  });
  test('creation fails with proper statuscode and message if password length  is less then 3 characters long', async () => {
    const usersAtStart = await helper.usersInDb();
    const newUser = {
      username: 'root',
      name: 'saf',
      password: '12',
    };
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);
    expect(result.body.error).toContain(
      'password must be at least 3 characters long'
    );
    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd.length).toEqual(usersAtStart.length);
  });
});

afterAll(async () => {
  mongoose.connection.close();
});
