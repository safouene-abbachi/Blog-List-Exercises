const _ = require('lodash');

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.length === 0
    ? 'Blog list is empty'
    : blogs.reduce((curr, acc) => curr + acc.likes, 0);
};

const favoriteBlog = (blogs) => {
  const blogLikes = blogs.reduce(
    (curr, acc) => (curr.likes > acc.likes ? curr : acc),
    0
  );
  return blogs.length === 0 ? 'Blog list is empty' : blogLikes;
};

const mostBlogs = (blogs) => {
  const arrOfObj = [];
  const groupedByAuthor = _.groupBy(blogs, 'author');
  for (let prop in groupedByAuthor) {
    arrOfObj.push({ author: prop, blogs: groupedByAuthor[prop].length });
  }

  return blogs.length === 0 ? 'Blog list is empty' : _.maxBy(arrOfObj, 'blogs');
};

const mostLikes = (blogs) => {
  if (blogs.length) {
    const groupedByAuthor = _.groupBy(blogs, 'likes');
    const maxLikes = Object.entries(groupedByAuthor)
      .reduce((curr, acc) => (+curr[0] > +acc[0] ? curr[1] : acc[1]), 0)
      .map(({ author, likes }) => {
        return {
          author,
          likes,
        };
      });
    return maxLikes[0];
  } else {
    return 'Blog list is empty';
  }
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
