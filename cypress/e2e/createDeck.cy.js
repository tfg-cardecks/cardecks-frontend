/// <reference types="cypress" />

// local imports
import {
  clickToNavElement,
  typeAndAssert,
  goToHomePage,
  generateRandomUser,
} from "./utils";

beforeEach(() => {
  goToHomePage();
});

describe("testing the create deck", () => {
  it("creating a new deck successfully without selecting any cards", () => {
    cy.get("header")
      .find("nav")
      .next()
      .find("a")
      .contains("Registrarse")
      .click()
      .wait(1500);

    generateRandomUser().then(({ email, name, lastName, username }) => {
      typeAndAssert("input[name='name']", name);
      typeAndAssert("input[name='lastName']", lastName);
      typeAndAssert("input[name='username']", username);
      typeAndAssert("input[name='password']", "@Password1");
      typeAndAssert("input[name='password2']", "@Password1");
      typeAndAssert("input[name='email']", email);
      cy.get('select[name="role"]').select("authenticated");
      cy.get("button").contains("Registrar").click().wait(1500);

      cy.wait(2000);

      typeAndAssert("input[name='emailOrUsername']", username);
      typeAndAssert("input[name='password']", "@Password1");
      cy.get("button").contains("Iniciar sesión").click().wait(2000);

      clickToNavElement("Mazos");
      cy.get("a").contains("Crear Mazo").click().wait(1500);

      typeAndAssert("input[name='name']", "Test Deck");
      typeAndAssert("input[name='description']", "This is a test deck.");
      typeAndAssert("input[name='theme']", "Test Theme");

      cy.get("button").contains("Crear Mazo").click().wait(2000);

      cy.get("header")
        .find("nav")
        .next()
        .find("button")
        .contains("Cerrar sesión")
        .click()
        .wait(1500);
    });
  });
});
