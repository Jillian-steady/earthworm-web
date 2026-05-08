/// <reference types="cypress" />

Cypress.Commands.add("login", function () {
  const user = {
    userId: 1,
    username: "testuser",
  };

  // Set Logto token in localStorage to simulate authenticated state
  cy.window().then((win) => {
    win.localStorage.setItem(
      "logto:signInSession",
      JSON.stringify({ redirectUri: "http://localhost:3000/callback" }),
    );
  });

  // Mock the user API to return a logged-in user
  cy.intercept("GET", "/api/user", {
    statusCode: 200,
    body: user,
  }).as("getUser");

  // Mock the user course progress API
  cy.intercept("GET", "/api/user-course-progress*", {
    statusCode: 200,
    body: {
      coursePackId: "1",
      courseId: "2",
    },
  }).as("getUserCourseProgress");

  cy.visit("/");
  cy.wait("@getUser");
});

declare global {
  namespace Cypress {
    interface Chainable {
      login(): Chainable<void>;
    }
  }
}

export {};
