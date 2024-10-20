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
    cy.get('select[name="role"]').select("authenticated");
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
    cy.get('select[name="role"]').select("authenticated");
    cy.get("button").contains("Registrar").click().wait(1500);
    cy.get("p").should("contain.text", "Las contraseñas no coinciden");
  });

  it("can't register (400 invalid data)", () => {
    typeAndAssert("input[name='password']", "@Password1");
    typeAndAssert("input[name='password2']", "@Password1");
    cy.get("button").contains("Registrar").click().wait(2000);
    cy.get("p").should("contain.text", "Rol inválido");
  });
});
