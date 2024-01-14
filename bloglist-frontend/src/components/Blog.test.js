import React from "react";
import "@testing-library/jest-dom";
import { render, fireEvent, screen } from "@testing-library/react";
import Blog from "./Blog";
import BlogForm from "./BlogForm";

test("renders title & author", () => {
  const blog = {
    title: "test",
    author: "test",
  };

  const component = render(<Blog blog={blog} />);
  expect(component.container).toHaveTextContent("test");
});

test("displays blog's URL and likes when the button is clicked", () => {
  const blog = {
    title: "Test Blog",
    author: "Test Author",
    url: "testurl",
    likes: 10,
  };

  render(<Blog blog={blog} />);

  const button = screen.getByText("view");

  fireEvent.click(button);

  expect(screen.getByText("testurl")).toBeInTheDocument();
  expect(screen.getByText("likes 10")).toBeInTheDocument();
});

test("handles double-click on like button correctly", () => {
  const blog = {
    title: "Test Blog",
    author: "Test Author",
    url: "testurl",
    likes: 10,
  };

  const mockUpdateBlog = jest.fn();

  const { getByText } = render(
    <Blog blog={blog} updateBlog={mockUpdateBlog} />
  );

  fireEvent.click(getByText("view"));

  const likeButton = getByText("Like");
  fireEvent.click(likeButton);
  fireEvent.click(likeButton);

  expect(mockUpdateBlog).toHaveBeenCalledTimes(2);
});
