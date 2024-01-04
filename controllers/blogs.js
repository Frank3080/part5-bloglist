const logger = require("../utils/logger");
const blogRouter = require("express").Router();
const Blog = require("../models/blog");
const validUrl = require("valid-url");
const User = require("../models/user");

blogRouter.get("/", async (request, response) => {
  try {
    const blogs = await Blog.find({}).populate("user", {
      username: 1,
      name: 1,
    });

    response.json(blogs);
  } catch (err) {
    logger.error(err.message);
    response.status(500).json({ error: "Internal Server Error" });
  }
});

blogRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  if (blog) {
    response.json(blog.toJSON());
  } else {
    response.status(404).end();
  }
});

blogRouter.post("/", async (request, response) => {
  const blogInfo = request.body;

  if (!blogInfo.title) {
    return response.status(400).json({ error: "Title is required" });
  }

  if (!blogInfo.url || !validUrl.isUri(blogInfo.url)) {
    return response.status(400).json({ error: "Valid URL is required" });
  }

  const user = await User.findOne({});

  const blog = new Blog({
    title: blogInfo.title,
    author: blogInfo.author,
    url: blogInfo.url,
    likes: blogInfo.likes !== undefined ? blogInfo.likes : 0,
    user: user._id,
  });

  try {
    const savedBlog = await blog.save();
    response.status(201).json(savedBlog);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Internal Server Error" });
  }
});

blogRouter.put("/:id", async (request, response) => {
  const { id } = request.params;
  const updatedBlog = request.body;

  const existingBlog = await Blog.findById(id);

  if (!existingBlog) {
    return response.status(404).json({ error: "Blog not found" });
  }

  existingBlog.title = updatedBlog.title || existingBlog.title;
  existingBlog.author = updatedBlog.author || existingBlog.author;
  existingBlog.url = updatedBlog.url || existingBlog.url;
  existingBlog.likes =
    updatedBlog.likes !== undefined ? updatedBlog.likes : existingBlog.likes;

  try {
    const updatedBlog = await existingBlog.save();
    response.json(updatedBlog);
  } catch (err) {
    logger.error(err);
    response.status(500).json({ error: "Internal Server Error" });
  }
});

blogRouter.delete("/:id", async (request, response) => {
  const { id } = request.params;

  try {
    const deletedBlog = await Blog.findByIdAndDelete(id);

    if (!deletedBlog) {
      return response.status(404).json({ error: "Blog not found" });
    }

    response.status(204).end();
  } catch (err) {
    console.error(err);
    response.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = blogRouter;
