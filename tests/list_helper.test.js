const listHelper = require('../utils/list_helper');
const oneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
];
const allBlogs = [
  {
    title: 'animal blog',
    author: 'safouene',
    url: 'www.animals.com',
    likes: 30,
    id: '6303910586344f0657bddad2',
  },

  {
    title: 'cars blog',
    author: 'safouene',
    url: 'www.cars.com',
    likes: 15,
    id: '6303929db5e43c79551b956b',
  },
  {
    title: 'qsdqsd blog',
    author: 'fakh',
    url: 'www.qsdqsd.com',
    likes: 15,
    id: '6303951760ac27cd6113c767',
  },
  {
    title: 'ccccccc blog',
    author: 'yas',
    url: 'www.cccccc.com',
    likes: 15,
    id: '630395de1d5a43cc86851960',
  },
  {
    title: 'xxxxx blog',
    author: 'ameni',
    url: 'www.xxxxxx.com',
    likes: 15,
    id: '63039741568d77d3f91aaeac',
  },
];

test('dummy returns one', () => {
  const blogs = [];
  const result = listHelper.dummy(blogs);
  expect(result).toBe(1);
});

describe('total likes', () => {
  test('empty blog list', () => {
    const result = listHelper.totalLikes([]);
    expect(result).toBe('Blog list is empty');
  });
  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(oneBlog);
    expect(result).toBe(5);
  });
  test('when list has more than one blog', () => {
    const result = listHelper.totalLikes(allBlogs);
    expect(result).toBe(90);
  });
});

describe('favoriteBlog ', () => {
  test('Empty list', () => {
    const result = listHelper.favoriteBlog([]);
    expect(result).toBe('Blog list is empty');
  });

  test('existing blogs', () => {
    const result = listHelper.favoriteBlog(allBlogs);
    expect(result).toEqual({
      title: 'animal blog',
      author: 'safouene',
      url: 'www.animals.com',
      likes: 30,
      id: '6303910586344f0657bddad2',
    });
  });
});

describe('most blogs', () => {
  test('Empty list', () => {
    const result = listHelper.mostBlogs([]);
    expect(result).toBe('Blog list is empty');
  });

  test('most blogs', () => {
    const result = listHelper.mostBlogs(allBlogs);
    expect(result).toEqual({
      author: 'safouene',
      blogs: 2,
    });
  });
});
describe('most likes', () => {
  test('Empty list', () => {
    const result = listHelper.mostLikes([]);
    expect(result).toBe('Blog list is empty');
  });

  test('most like', () => {
    const result = listHelper.mostLikes(allBlogs);
    expect(result).toEqual({
      author: 'safouene',
      likes: 30,
    });
  });
});
