/// <reference types="cypress" />

// local imports
import {
  clickToNavElement,
  typeAndAssert,
  goToHomePage,
  generateRandomUser,
  applyTitleFilter,
  clearTitleFilter,
  applyThemeFilter,
  clearThemeFilter,
  applyStartDateFilter,
  clearStartDateFilter,
  applyEndDateFilter,
  clearEndDateFilter,
  applySortOption,
  applyAlphabetFilter,
  clearAlphabetFilter,
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
      cy.get('select[name="role"]').select("authenticated");
      cy.get("button").contains("Registrar").click().wait(1500);

      cy.wait(2000);

      typeAndAssert("input[name='emailOrUsername']", username);
      typeAndAssert("input[name='password']", "@Password1");
      cy.get("button").contains("Iniciar sesión").click().wait(2000);

      clickToNavElement("Mazos");
      cy.get("a").contains("Mis Mazo").click().wait(1500);

      applyTitleFilter("mazito");
      clearTitleFilter();

      applyThemeFilter("mazito");
      clearThemeFilter();

      applyStartDateFilter("2023-01-01");
      clearStartDateFilter();

      applyEndDateFilter("2023-12-31");
      clearEndDateFilter();

      // Apply sort option filter
      applySortOption("name-asc");
      applySortOption("name-desc");
      applySortOption("createdAt-asc");
      applySortOption("createdAt-desc");

      // Apply alphabet filter
      applyAlphabetFilter("M");
      clearAlphabetFilter();

      cy.get('input[type="file"]').selectFile('cypress/e2e/json/mazito.json');
      cy.get("button").contains("Importar Mazo").click().wait(2000);

      cy.get(".grid > div").first().click().wait(1500);
      cy.get("p").should("contain", "mazito");

      cy.get("h2.text-xl.font-bold.mb-2").contains("mazito").first().click();

      cy.get("button").contains("Eliminar").click().wait(1000);
      clickToNavElement("Mazos");
      cy.get("a").contains("Mis Mazos").click().wait(1500);

      cy.get("p.text-gray-500").should("contain", "No hay mazos disponibles.");
    });
  });
});