const supertest = require("supertest");
const { app } = require("../index");
const mongoose = require("mongoose");

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
