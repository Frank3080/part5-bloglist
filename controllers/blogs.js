const logger = require("../utils/logger");
const jwt = require("jsonwebtoken");
const blogRouter = require("express").Router();
const Blog = require("../models/blog");
const validUrl = require("valid-url");
const User = require("../models/user");
const { userExtractor } = require("../utils/middleware");

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

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", "");
  }
  return null;
};

blogRouter.post("/", userExtractor, async (request, response) => {
  const blogInfo = request.body;

  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }
  const user = await User.findById(decodedToken.id);

  if (!blogInfo.title) {
    return response.status(400).json({ error: "Title is required" });
  }

  if (!blogInfo.url || !validUrl.isUri(blogInfo.url)) {
    return response.status(400).json({ error: "Valid URL is required" });
  }

  const blog = new Blog({
    title: blogInfo.title,
    author: blogInfo.author,
    url: blogInfo.url,
    likes: blogInfo.likes !== undefined ? blogInfo.likes : 0,
    user: user._id,
  });

  try {
    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
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

blogRouter.delete("/:id", userExtractor, async (request, response) => {
  const { params, user } = request;
  const blog = await Blog.findById(params.id);
  try {
    if (blog.user.toString() !== user.id.toString()) {
      return response
        .status(401)
        .json({ error: "only the user who added the blog can delete it" });
    }
    await blog.deleteOne();
    response.status(204).end();
  } catch (err) {
    logger.error(err);
    return response.status(500).json({ error: "Internal Server Error " });
  }
});

module.exports = blogRouter;
