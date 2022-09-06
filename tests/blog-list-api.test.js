const mongoose = require('mongoose');
const supertest = require('supertest');
const bcrypt = require('bcryptjs');
const helper = require('./test_helper');
const app = require('../app');
const Blog = require('../models/blog');
//supertest is a superagent object an dit's used for making tests for the HTTP requests
const api = supertest(app);
jest.setTimeout(10000);
beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
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
  });

  test('blogs must have id property', async () => {
    const response = await api.get('/api/blogs');

    expect(response.body[0]['id']).toBeDefined;
  });
});

describe('adding new blog', () => {
  let token;
  beforeAll(async () => {
    await User.deleteMany({});
    const passwordHash = await bcrypt.hash('password', 10);
    const user = new User({
      username: 'safouene',
      passwordHash,
    });
    await user.save();
    //login user for token
    const result = await api
      .post('/api/login')
      .send({ username: 'safouene', password: 'password' });
    token = result.body.token;
    return token;
  });

  test('successfull creation of a blog', async () => {
    const newBlog = {
      title: 'ameni blog',
      author: 'ameni',
      url: 'am.ameni.com',
      likes: 7,
    };
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-type', /application\/json/);
    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);
    const titles = blogsAtEnd.map((blog) => blog.title);
    expect(titles).toContain('ameni blog');
  });
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
  });

  test('missing title or url', async () => {
    const newBlog = {
      author: 'ameni',
      likes: 4,
    };
    await api.post('/api/blogs').send(newBlog).expect(400);
    const blogs = await helper.blogsInDb();
    expect(blogs.length).toBe(helper.initialBlogs.length);
  });
});

describe('deletion of a blog', () => {
  test('success of deletion if valid id', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd.length).toBe(blogsAtStart.length - 1);

    const titles = blogsAtEnd.map((blog) => blog.tile);
    expect(titles).not.toContain(blogToDelete.title);
  });
});

describe('updating a blog post', () => {
  test('successfully updating a blog post', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];
    await api.put(`/api/blogs/${blogToUpdate.id}`).expect(200);
    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtStart.length).toBe(blogsAtEnd.length);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
