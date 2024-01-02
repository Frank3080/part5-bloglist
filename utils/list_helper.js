const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const mostLiked = blogs.reduce((maxLikes, currentBlog) => {
    return currentBlog.likes > maxLikes.likes ? currentBlog : maxLikes;
  }, blogs[0]);

  return {
    title: mostLiked.title,
    author: mostLiked.author,
    likes: mostLiked.likes,
  };
};

module.exports = { dummy, totalLikes, favoriteBlog };
