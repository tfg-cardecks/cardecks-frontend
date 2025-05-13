/// <reference types="cypress" />

// local imports
import {
  clickToNavElement,
  typeAndAssert,
  goToHomePage,
  generateRandomUser,
  applyAlphabetFilter,
  clearAlphabetFilter,
  selectDecksPerPageAndNavigateToPage,
} from "./utils";

beforeEach(() => {
  goToHomePage();
});

describe("testing the my deck functionality", () => {
  it("should successfully navigate to My Decks, apply filters, import a deck, verify it, and delete it", () => {
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
      cy.get("a").contains("Mis Mazo").click().wait(1500);

      cy.get("button.bg-blue-500.text-white").click().wait(2000);
      cy.get("label").contains("Tema").find('input[type="checkbox"]').check();

      cy.get("label")
        .contains("Fecha de Inicio")
        .find('input[type="checkbox"]')
        .check();
      cy.get("label")
        .contains("Fecha de Fin")
        .find('input[type="checkbox"]')
        .check();
      cy.get("label")
        .contains("Ordenar por")
        .find('input[type="checkbox"]')
        .check();

      applyAlphabetFilter("M");
      clearAlphabetFilter();

      selectDecksPerPageAndNavigateToPage(5);

      cy.get('input[type="file"]').selectFile("cypress/e2e/json/mazito.json");
      cy.get("button").contains("Importar Mazo").click().wait(2000);

      cy.get(".grid > div").first().click().wait(1500);
      cy.get("p").should("contain", "mazito");

      cy.get("button").contains("Eliminar").click().wait(1000);
      cy.get(".swal2-confirm").click();

      clickToNavElement("Mazos");
      cy.get("a").contains("Mis Mazos").click().wait(1500);

      cy.get("p.text-gray-500").should("contain", "No hay mazos disponibles.");
      cy.get("button").contains("Usuario").click().wait(2000);
      cy.get("a").contains("Detalles").click().wait(1500);
      cy.get("button").contains("Darse de baja").click().wait(2000);
      cy.get(".swal2-confirm").click();
  
    });
  });
});
