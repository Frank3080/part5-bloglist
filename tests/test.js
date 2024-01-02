const listHelper = require("../utils/list_helper");

describe("dummy", () => {
  test("returns 1", () => {
    const result = listHelper.dummy();
    expect(result).toBe(1);
  });
});

describe("totalLikes", () => {
  test("of empty list is 0", () => {
    const result = listHelper.totalLikes([]);
    expect(result).toBe(0);
  });

  test("when list has only one blog, equals the likes of that blog", () => {
    const blogs = [
      {
        title: "Sample Blog",
        author: "John Doe",
        url: "https://example.com",
        likes: 10,
      },
    ];

    const result = listHelper.totalLikes(blogs);
    expect(result).toBe(10);
  });

  test("of a bigger list is calculated correctly", () => {
    const blogs = [
      { title: "Blog 1", author: "Author 1", likes: 5 },
      { title: "Blog 2", author: "Author 2", likes: 10 },
      { title: "Blog 3", author: "Author 3", likes: 7 },
    ];

    const result = listHelper.totalLikes(blogs);
    expect(result).toBe(22); // 5 + 10 + 7 = 22
  });
});

describe("favoriteBlog", () => {
  test("of empty list is null", () => {
    const result = listHelper.favoriteBlog([]);
    expect(result).toBe(null);
  });

  test("when list has only one blog, returns that blog in the specified format", () => {
    const blogs = [
      {
        title: "Sample Blog",
        author: "John Doe",
        url: "https://example.com",
        likes: 10,
      },
    ];

    const result = listHelper.favoriteBlog(blogs);
    expect(result).toEqual({
      title: "Sample Blog",
      author: "John Doe",
      likes: 10,
    });
  });

  test("of a list returns the most liked blog in the specified format", () => {
    const blogs = [
      { title: "Blog 1", author: "Author 1", likes: 5 },
      { title: "Blog 2", author: "Author 2", likes: 10 },
      { title: "Blog 3", author: "Author 3", likes: 7 },
    ];

    const result = listHelper.favoriteBlog(blogs);
    expect(result).toEqual({
      title: "Blog 2",
      author: "Author 2",
      likes: 10,
    });
  });
});
