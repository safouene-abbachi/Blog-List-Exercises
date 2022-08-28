const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper');
const app = require('../app');
//supertest is a superagent object an dit's used for making tests for the HTTP requests
const api = supertest(app);

describe('When having initial blogs', () => {
  test('request type and status', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('number of blogs returned as json', async () => {
    const response = await api.get('/api/blogs');
    expect(response.body).toHaveLength(helper.initialBlogs.length);
  }, 100000);
});

afterAll(() => {
  mongoose.connection.close();
});
