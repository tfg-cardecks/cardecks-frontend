/// <reference types="cypress" />

// local imports
import { typeAndAssert } from "./utils";

beforeEach(() => {
  cy.visit("http://localhost:5173/login");
});

describe("testing login page", () => {
  it("can't login (400 invalid data)", () => {
    cy.get("button").contains("Iniciar sesión").click().wait(2000);
    cy.get("p").should("contain.text", "La contraseña es obligatoria");
  });

  it("can't login (404 user not found)", () => {
    typeAndAssert("input[name='emailOrUsername']", "s");
    typeAndAssert("input[name='password']", "s");
    cy.get("button").contains("Iniciar sesión").click().wait(2000);
    cy.get("p").should("contain.text", "Usuario no encontrado");
  });
});
