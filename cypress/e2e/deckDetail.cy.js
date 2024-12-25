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

describe("testing the import card functionality", () => {
  it("should import a card to a deck successfully", () => {
    cy.get("header")
      .find("nav")
      .next()
      .find("a")
      .contains("Registrarse")
      .click()
      .wait(1500);

    generateRandomUser().then(({ email, username }) => {
      typeAndAssert("input[name='username']", username);
      typeAndAssert("input[name='password']", "@Password1");
      typeAndAssert("input[name='password2']", "@Password1");
      typeAndAssert("input[name='email']", email);
      cy.get("input[id='terms']").check();
      cy.get("input[id='priv']").check();
      cy.get("button").contains("Registrar").click().wait(1500);

      cy.wait(2000);

      typeAndAssert("input[name='emailOrUsername']", username);
      typeAndAssert("input[name='password']", "@Password1");
      cy.get("button").contains("Iniciar").click().wait(2000);
      cy.get("button").contains("Si").click().wait(2000);

      clickToNavElement("Mazos");
      cy.get("a").contains("Crear Mazo").click().wait(1500);

      typeAndAssert("input[name='name']", "Mazo de prueba12");
      typeAndAssert("input[name='description']", "Descripción de prueba12");
      typeAndAssert("input[name='theme']", "Tema de prueba12");
      cy.get("button").contains("Crear Mazo").click().wait(2000);

      cy.get("button").contains("Exportar Mazo").click();

      cy.get("button").contains("Eliminar").click().wait(2000);
    });
  });
});
