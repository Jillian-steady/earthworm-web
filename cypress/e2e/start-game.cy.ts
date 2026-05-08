describe("start game", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("navigates to the game scene as a guest", () => {
    cy.intercept("GET", "/api/course-pack/1/courses/1", {
      statusCode: 200,
      body: {
        id: "1",
        title: "第一课",
        statements: [
          {
            chinese: "我",
            english: "I",
            id: 30725,
            soundmark: "/aɪ/",
          },
        ],
      },
    }).as("getCourse");

    cy.contains("开启Earthworm").click();
    cy.wait("@getCourse").its("request.method").should("equal", "GET");
    cy.url().should("include", "/game/");
  });

  it("navigates to the game scene and shows course for logged-in users", () => {
    cy.login();

    cy.intercept("GET", "/api/course-pack/1/courses/2", {
      statusCode: 200,
      body: {
        id: "2",
        title: "第二课",
        statements: [
          {
            chinese: "我",
            english: "I",
            id: 30725,
            soundmark: "/aɪ/",
          },
        ],
      },
    }).as("getCourse");

    cy.contains("开启Earthworm").click();
    cy.wait("@getCourse");

    cy.url().should("include", "/game/1/2");
  });
});
