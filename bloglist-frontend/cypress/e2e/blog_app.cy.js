import { func } from "prop-types";

describe("Blog app", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3003/api/testing/reset");
    const user = {
      username: "frank",
      name: "frank",
      password: "123123",
    };

    cy.request("POST", "http://localhost:3003/api/users/", user);
    cy.visit("http://localhost:5173");
  });

  it("Login form is shown", function () {
    cy.contains("Login");
  });

  it("login form opens", function () {
    cy.contains("Login").click();
  });

  it("logged in with valid credentials", function () {
    cy.contains("Login").click();
    cy.get("input:first").type("frank");
    cy.get("input:last").type("123123");
    cy.contains("Login").click();
    cy.contains("logged in");
  });

  it("logged in with unvalid credentials", function () {
    cy.contains("Login").click();
    cy.get("input:first").type("frank");
    cy.get("input:last").type("123122");
    cy.contains("Login").click();
    cy.contains("Wrong Credentials");
    cy.get(".error").should("have.css", "color", "rgb(255, 0, 0)");
  });

  it("A blog can be created", function () {
    cy.get("input:first").type("frank");
    cy.get("input:last").type("123123");
    cy.contains("Login").click();
    cy.get("#create-btn").click();
    cy.get("#title").type("Test Blog Title");
    cy.get("#author").type("Test Author");
    cy.get("#url").type("http://testurl.com");
    cy.get("#create-btn").click();
  });

  it("Blog can be liked", function () {
    cy.get("input:first").type("frank");
    cy.get("input:last").type("123123");
    cy.contains("Login").click();
    cy.createBlog({
      title: "test",
      author: "testttt",
      url: "test.com",
    });
    cy.contains("view").click();
    cy.contains("likes 0");
    cy.contains("like").click();
    cy.contains("likes 1");
  });

  it("blog can be deleted", function () {
    cy.get("input:first").type("frank");
    cy.get("input:last").type("123123");
    cy.contains("Login").click();
    cy.createBlog({
      title: "test",
      author: "cypress",
      url: "testing.com",
    });
    cy.contains("view").click();
    cy.contains("delete blog").click();
    cy.get("html").should("not contain", "test");
  });

  it("blogs are in liked order", function () {
    cy.get("input:first").type("frank");
    cy.get("input:last").type("123123");
    cy.createBlog({
      title: "test1",
      author: "test1",
      url: "test1.com",
      likes: 1,
    });
    cy.createBlog({
      title: "test2",
      author: "test2",
      url: "test2.com",
      likes: 2,
    });
    cy.createBlog({
      title: "test3",
      author: "test3",
      url: "test3.com",
      likes: 3,
    });
    cy.createBlog({
      title: "test4",
      author: "test4",
      url: "test4.com",
      likes: 4,
    });
    cy.get("#view").click();
    cy.contains("4");
  });
});
