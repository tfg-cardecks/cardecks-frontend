/// <reference types="cypress" />

// local imports
import {
  clickToNavElement,
  typeAndAssert,
  goToHomePage,
  generateRandomUser,
  getTemaLabel,
  applyTitleFilter,
  clearTitleFilter,
  applyThemeFilter,
  clearThemeFilter,
  applyStartDateFilter,
  clearStartDateFilter,
  applyEndDateFilter,
  clearEndDateFilter,
  applyTypeFilter,
  clearTypeFilter,
  applySortOption,
  applyAlphabetFilter,
  clearAlphabetFilter,
  selectCardsPerPageAndNavigateToPage,
} from "./utils";

beforeEach(() => {
  goToHomePage();
});

describe("testing the my card functionality", () => {
  it("should successfully navigate to My Cards, apply filters, import a card", () => {
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

      clickToNavElement("Cartas");
      cy.get("a").contains("Mis Cartas").click().wait(1500);
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
        .contains("Tipo de Carta")
        .find('input[type="checkbox"]')
        .check();
      cy.get("label")
        .contains("Ordenar por")
        .find('input[type="checkbox"]')
        .check();

      applyAlphabetFilter("N");
      clearAlphabetFilter();

      selectCardsPerPageAndNavigateToPage(5);

      cy.get('input[type="file"]').selectFile("cypress/e2e/json/nubes.json");
      cy.get("button").contains("Importar Carta").click().wait(2000);
    });
  });
});
