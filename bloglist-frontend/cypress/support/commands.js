// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("login", ({ username, password }) => {
  cy.request({
    method: "POST",
    url: "http://localhost:3003/api/login",
    body: {
      username,
      password,
    },
    failOnStatusCode: false, // Do not fail on non-2xx status codes
  }).then((response) => {
    if (response.status === 200) {
      // Successful login
      localStorage.setItem("loggedInUser", JSON.stringify(response.body));
    } else {
      // Unsuccessful login, handle appropriately (e.g., show an error message)
      cy.log("Login failed. Invalid credentials.");
      // Optionally, you can add assertions or other actions based on the failure
    }
    cy.visit("http://localhost:5173");
  });
});

Cypress.Commands.add("createBlog", ({ title, author, url, likes }) => {
  const authToken = JSON.parse(localStorage.getItem("authToken"));

  if (authToken && authToken.token) {
    cy.request({
      url: "http://localhost:3003/api/blogs",
      method: "POST",
      body: { title, author, url, likes },
      headers: {
        Authorization: `bearer ${authToken.token}`,
      },
    });
    cy.visit("http://localhost:5173");
  } else {
    // Handle the case when the token is not available
    cy.log("Cannot create blog: User not authenticated");
  }
});
