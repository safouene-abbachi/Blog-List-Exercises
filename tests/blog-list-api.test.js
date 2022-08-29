const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper');
const app = require('../app');
const Blog = require('../models/blog');
//supertest is a superagent object an dit's used for making tests for the HTTP requests
const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogsObject = helper.initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogsObject.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

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

  test('blogs must have id property', async () => {
    const response = await api.get('/api/blogs');

    expect(response.body[0]['id']).toBeDefined;
  }, 100000);
});

describe('adding new blog', () => {
  test('successfull creation of a blog', async () => {
    const newBlog = {
      title: 'ameni blog',
      author: 'ameni',
      url: 'am.ameni.com',
      likes: 7,
    };
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-type', /application\/json/);
    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);
    const titles = blogsAtEnd.map((blog) => blog.title);
    expect(titles).toContain('ameni blog');
  }, 100000);
  test('missing like property', async () => {
    const newBlog = {
      title: 'ameni blog',
      author: 'ameni',
      url: 'am.ameni.com',
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-type', /application\/json/);

    const blogs = await helper.blogsInDb();
    expect(blogs[blogs.length - 1].likes).toBe(0);
  }, 100000);

  test('missing title or url', async () => {
    const newBlog = {
      author: 'ameni',
      likes: 4,
    };
    await api.post('/api/blogs').send(newBlog).expect(400);
    const blogs = await helper.blogsInDb();
    expect(blogs.length).toBe(helper.initialBlogs.length);
  }, 100000);
});

afterAll(() => {
  mongoose.connection.close();
});
