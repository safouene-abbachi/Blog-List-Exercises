const Blogs = require('../models/blog');

const initialBlogs = [
  {
    title: 'ssss blog',
    author: 'safouene',
    url: 'ss.sss.com',
    likes: 2,
    id: '630b7a4f261e15308ca46eb6',
  },
  {
    title: 'cvvc blog',
    author: 'safouene',
    url: 'v.v.com',
    likes: 15,
    id: '630b890b19d780bc5819709d',
  },
  {
    title: 'ameni blog',
    author: 'safouene',
    url: 'ameni.v.com',
    likes: 20,
    id: '630b891619d780bc5819709f',
  },
];
const blogsInDb = async () => {
  const blogs = await Blogs.find({});
  return blogs.map((blog) => blog.toJSON());
};
module.exports = {
  initialBlogs,
  blogsInDb,
};
