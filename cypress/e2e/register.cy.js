/// <reference types="cypress" />

// local imports
import { typeAndAssert } from "./utils";

beforeEach(() => {
  cy.visit("http://localhost:5173/register");
});

describe("testing register page", () => {
  it("can't register (no password2)", () => {
    typeAndAssert("input[name='username']", "username");
    typeAndAssert("input[name='email']", "a@gmail.com");
    cy.get("button").contains("Registrar").click().wait(1500);
    cy.get("p").should(
      "contain.text",
      "La confirmación de la contraseña es obligatoria"
    );
  });

  it("can't register (passwords don't match)", () => {
    typeAndAssert("input[name='username']", "username");
    typeAndAssert("input[name='email']", "a@gmail.com");
    typeAndAssert("input[name='password']", "password");
    cy.get("button").contains("Registrar").click().wait(1500);
    cy.get("p").should("contain.text", "Las contraseñas no coinciden");
  });

  it("can't register (400 invalid data)", () => {
    typeAndAssert("input[name='password']", "@Password1");
    typeAndAssert("input[name='password2']", "@Password1");
    cy.get("input[id='terms']").check();
    cy.get("input[id='priv']").check();
    cy.get("button").contains("Registrar").click().wait(2000);
    cy.get("p").should(
      "contain.text",
      "El correo electrónico debe ser de gmail, hotmail o outlook"
    );
  });

  it("can't register (privacy policy not accepted)", () => {
    typeAndAssert("input[name='username']", "username");
    typeAndAssert("input[name='email']", "a@gmail.com");
    typeAndAssert("input[name='password']", "password");
    typeAndAssert("input[name='password2']", "password");
    cy.get("input[id='terms']").check();
    cy.get("button").contains("Registrar").click().wait(1500);
    cy.get("p").should(
      "contain.text",
      "Debes aceptar la política de privacidad"
    );
  });

  it("can't register (terms not accepted)", () => {
    typeAndAssert("input[name='username']", "username");
    typeAndAssert("input[name='email']", "a@gmail.com");
    typeAndAssert("input[name='password']", "password");
    typeAndAssert("input[name='password2']", "password");
    cy.get("input[id='priv']").check();
    cy.get("button").contains("Registrar").click().wait(1500);
    cy.get("p").should(
      "contain.text",
      "Debes aceptar los términos y condiciones"
    );
  });
});
