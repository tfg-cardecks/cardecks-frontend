/// <reference types="cypress" />

// local imports
import { typeAndAssert, goToHomePage, generateRandomUser } from "./utils";

beforeEach(() => {
  goToHomePage();
});

describe("sending a password reset email", () => {
  it("should send a password reset email", () => {
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

      cy.get("a").contains("¿Olvidaste tu contraseña?").click().wait(1500);
      typeAndAssert("input[name='email']", email);

      cy.intercept("POST", "/api/user/forgot-password").as("forgotPassword");
      cy.get("button").contains("Enviar correo").click().wait(1500);
    });
  });

  it("shouldn't send a password reset email (404 user not found)", () => {
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

      cy.get("a").contains("¿Olvidaste tu contraseña?").click().wait(1500);
      typeAndAssert("input[name='email']", "invalid@gmail.com");
      cy.get("button").contains("Enviar correo").click().wait(1500);
      cy.wait(1500);
      cy.get("button").contains("Cancelar").click().wait(1500);
    });
  });

  it("shouldn't send a password reset email (field required)", () => {
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

      cy.get("a").contains("¿Olvidaste tu contraseña?").click().wait(1500);
      cy.get("button").contains("Enviar correo").click().wait(1500);
      cy.wait(1500);
      cy.get("button").contains("Cancelar").click().wait(1500);
    });
  });
});
