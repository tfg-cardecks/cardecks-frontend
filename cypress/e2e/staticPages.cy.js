/// <reference types="cypress" />

describe("Contact Page Tests", () => {
  it("should render the contact page", () => {
    cy.visit("http://localhost:5173/contact");
    cy.get("h1").should("contain", "Contacto");
  });
});

describe("Privacy Notice Page Tests", () => {
  it("should render the privacy notice page", () => {
    cy.visit("http://localhost:5173/privacy-notice");
    cy.get("h1").should("contain", "Aviso de Privacidad y Protección de Datos");
  });
});

describe("Terms of Use Page Tests", () => {
  it("should render the terms of use page", () => {
    cy.visit("http://localhost:5173/terms-of-use");
    cy.get("h1").should("contain", "Términos de Uso de Cardecks");
  });
});
