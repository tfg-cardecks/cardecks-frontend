/// <reference types="cypress" />

// local imports
import {
  clickToNavElement,
  typeAndAssert,
  goToHomePage,
  generateRandomUser,
  generateRandomTextCard,
} from "./utils";

beforeEach(() => {
  goToHomePage();
});

describe("testing the user details", () => {
  it("should access to the user details successfully", () => {
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
      cy.get('select[name="role"]').select("authenticated");
      cy.get("button").contains("Registrar").click().wait(1500);

      cy.wait(2000);

      typeAndAssert("input[name='emailOrUsername']", username);
      typeAndAssert("input[name='password']", "@Password1");
      cy.get("button").contains("Iniciar sesión").click().wait(2000);

      cy.get("button").contains("Borrar Usuario").click().wait(2000);
    });
  });
});
