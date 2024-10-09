/// <reference types="cypress" />

// local imports
import { setupToPlayGames, typeAndAssert } from "./utils";

beforeEach(() => {
  setupToPlayGames();
});

describe("testing 403 token expired error", () => {
  it("can't created card cause of 403 error", () => {
    cy.wait(500);
    cy.visit(
      `http://localhost:5173/user/${localStorage.getItem("userId")}/preview`
    );
    localStorage.setItem("access_token", "fakeToken");

    typeAndAssert("input[name='title']", "Carta de prueba");
    typeAndAssert("input[name='theme']", "Tema de prueba");
    cy.get("select#cardType").select("Texto y Texto").wait(1500);

    cy.get("button").contains("Crear Carta").click().wait(2000);

    cy.get("button").contains("Añadir Texto").click().wait(1500);

    cy.get("select").select("Trasera").wait(1500);

    cy.get("button").contains("Añadir Texto").click().wait(1500);

    cy.get("button").contains("Crear Carta").click().wait(2000);
  });
});
