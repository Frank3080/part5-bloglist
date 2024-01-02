const supertest = require("supertest");
const { app } = require("../app");
const mongoose = require("mongoose");
const { response } = require("express");
const helper = require("./test_helper");
const Blog = require("../models/blog");
const { ObjectId } = require("mongoose").Types;

const api = supertest(app);

test("returns the correct amount of blog posts in JSON format", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
}, 10000);

afterAll(async () => {
  await mongoose.connection.close();
});

test('blog posts have a unique identifier named "id"', async () => {
  const response = await api.get("/api/blogs");

  expect(response.status).toBe(200);
  expect(response.type).toMatch(/application\/json/);

  const blogs = response.body;
  if (Array.isArray(blogs) && blogs.length > 0) {
    blogs.forEach((blog) => {
      expect(blog).toHaveProperty("id");
      expect(blog).not.toHaveProperty("_id");
    });
  } else {
    console.log("No blogs found");
  }
}, 10000);

//verifies that making an http post request to the api/blogs URL successfully creates a new blog post, verifies that the total number of blogs is increased by one and the content of the blog post is saved correctly to the db
test("creating a new blog post with HTTP POST request", async () => {
  const newBlogPost = {
    title: "Test Blog Post",
    author: "Test Author",
    url: "https://test.com",
    likes: 5,
  };

  const initialBlogs = await api.get("/api/blogs");

  const response = await api
    .post("/api/blogs")
    .send(newBlogPost)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const createdBlogPost = response.body;
  expect(createdBlogPost).toHaveProperty("id");
  expect(createdBlogPost.title).toBe(newBlogPost.title);
  expect(createdBlogPost.author).toBe(newBlogPost.author);
  expect(createdBlogPost.url).toBe(newBlogPost.url);
  expect(createdBlogPost.likes).toBe(newBlogPost.likes);

  const updatedBlogs = await api.get("/api/blogs");

  expect(updatedBlogs.body).toHaveLength(initialBlogs.body.length + 1);
}, 10000);

//verifies that if the likes property is missing from the req, it will default to the value 0
test("creating a new blog post with default likes value", async () => {
  const newBlogPostWithoutLikes = {
    title: "Test Blog Post",
    author: "Test Author",
    url: "https://test.com",
  };

  const response = await api
    .post("/api/blogs")
    .send(newBlogPostWithoutLikes)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const createdBlogPost = response.body;
  expect(createdBlogPost).toHaveProperty("id");
  expect(createdBlogPost.likes).toBe(0);
}, 10000);

// Test for missing title property
test("creating a new blog without title should return 400 Bad Request", async () => {
  const newBlogWithoutTitle = {
    author: "Test Author",
    url: "https://test.com",
    likes: 5,
  };

  await api
    .post("/api/blogs")
    .send(newBlogWithoutTitle)
    .expect(400)
    .expect("Content-Type", /application\/json/);
}, 10000);

// Test for missing url property
test("creating a new blog without url should return 400 Bad Request", async () => {
  const newBlogWithoutUrl = {
    title: "Test Blog Post",
    author: "Test Author",
    likes: 5,
  };

  await api
    .post("/api/blogs")
    .send(newBlogWithoutUrl)
    .expect(400)
    .expect("Content-Type", /application\/json/);
}, 10000);

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
});

test("deleting a blog returns status code 204", async () => {
  const blogsAtDb = await helper.blogsInDb();
  const blogToDelete = blogsAtDb[0];

  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

  const blogsAfterRemove = await helper.blogsInDb();
  expect(blogsAfterRemove.length).toBe(helper.initialBlogs.length - 1);

  const titles = blogsAfterRemove.map((b) => b.title);
  expect(titles).not.toContain(blogToDelete.title);
});

test("deleting a non-existing blog returns status code 404", async () => {
  const nonExistingBlogId = await helper.nonExistingBlogId();

  await api.delete(`/api/blogs/${nonExistingBlogId}`).expect(404);

  const blogsAfterRemove = await helper.blogsInDb();
  expect(blogsAfterRemove.length).toBe(helper.initialBlogs.length);
});

//update blogs

describe("PUT /api/blogs/:id", () => {
  test("updates the information of an existing blog post", async () => {
    const initialBlog = {
      title: "Test Blog",
      author: "Test Author",
      url: "https://test.com",
      likes: 10,
    };

    const createdBlog = await api
      .post("/api/blogs")
      .send(initialBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const updatedInfo = {
      title: "Updated Blog Title",
      author: "Updated Author",
      url: "https://updated.com",
      likes: 20,
    };

    //PUT request to update the blog post
    const updatedBlog = await api
      .put(`/api/blogs/${createdBlog.body.id}`)
      .send(updatedInfo)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(updatedBlog.body.title).toBe(updatedInfo.title);
    expect(updatedBlog.body.author).toBe(updatedInfo.author);
    expect(updatedBlog.body.url).toBe(updatedInfo.url);
    expect(updatedBlog.body.likes).toBe(updatedInfo.likes);
  });

  test("returns 404 if trying to update a non-existing blog post", async () => {
    const nonExistingBlogId = new ObjectId().toString();

    const updatedInfo = {
      title: "Updated Blog Title",
      author: "Updated Author",
      url: "https://updated.com",
      likes: 20,
    };

    //PUT request to update a non-existing blog post
    await api
      .put(`/api/blogs/${nonExistingBlogId}`)
      .send(updatedInfo)
      .expect(404);
  });
});
