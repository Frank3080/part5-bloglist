// tests/test_helper.js

const Blog = require("../models/blog");

const initialBlogs = [
  {
    title: "Test Blog 1",
    author: "Test Author 1",
    url: "https://test1.com",
    likes: 5,
  },
  {
    title: "Test Blog 2",
    author: "Test Author 2",
    url: "https://test2.com",
    likes: 10,
  },
];

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const nonExistingBlogId = async () => {
  const blog = new Blog({
    title: "Non-existing Blog",
    author: "Non-existing Author",
    url: "https://nonexisting.com",
    likes: 0,
  });

  const savedBlog = await blog.save();
  const deletedBlog = await Blog.findOneAndDelete({ _id: savedBlog._id });

  return deletedBlog._id.toString();
};

module.exports = {
  initialBlogs,
  blogsInDb,
  nonExistingBlogId,
};
