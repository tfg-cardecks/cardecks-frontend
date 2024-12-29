/// <reference types="cypress" />

// local imports
import {
  clickToNavElement,
  typeAndAssert,
  goToHomePage,
  generateRandomUser,
  applyAlphabetFilter,
  clearAlphabetFilter,
  selectCardsPerPageAndNavigateToPage,
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

    generateRandomUser().then(({ email, username }) => {
      typeAndAssert("input[name='username']", username);
      typeAndAssert("input[name='password']", "@Password1");
      typeAndAssert("input[name='password2']", "@Password1");
      typeAndAssert("input[name='email']", email);
      cy.get("input[id='terms']").check();
      cy.get("input[id='priv']").check();
      cy.get("button").contains("Registrar").click().wait(2000);

      cy.wait(2000);

      typeAndAssert("input[name='emailOrUsername']", username);
      typeAndAssert("input[name='password']", "@Password1");
      cy.get("button").contains("Iniciar").click().wait(2000);
      cy.get("button").contains("Si").click().wait(2000);

      clickToNavElement("Mazos");
      cy.get("a").contains("Crear Mazo").click().wait(2000);

      typeAndAssert("input[name='name']", "Test Deck");
      typeAndAssert("input[name='description']", "This is a test deck.");
      typeAndAssert("input[name='theme']", "Test Theme");

      cy.get('input[placeholder="Título"]').type("Carta de prueba");
      cy.get("button.bg-blue-500.text-white").click().wait(2000);
      cy.get("div.mb-2")
        .find("label")
        .contains("Tema")
        .find('input[type="checkbox"]')
        .check();
      cy.get("label")
        .contains("Fecha de Inicio")
        .find('input[type="checkbox"]')
        .check();
      cy.get("label")
        .contains("Fecha de Fin")
        .find('input[type="checkbox"]')
        .check();
      cy.get("label")
        .contains("Tipo de Carta")
        .find('input[type="checkbox"]')
        .check();
      cy.get("label")
        .contains("Ordenar por")
        .find('input[type="checkbox"]')
        .check();

      applyAlphabetFilter("C");
      clearAlphabetFilter();

      selectCardsPerPageAndNavigateToPage(5);

      cy.get("button").contains("Crear Mazo").click().wait(2000);

      cy.get("button").contains("Eliminar").click().wait(2000);

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
