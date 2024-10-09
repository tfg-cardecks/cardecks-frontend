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

    generateRandomUser().then(({ email, name, lastName, username }) => {
      typeAndAssert("input[name='name']", name);
      typeAndAssert("input[name='lastName']", lastName);
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

      clickToNavElement("Cartas");
      cy.get("a").contains("Mis Cartas").click().wait(1500);

      applyTitleFilter("nube");
      clearTitleFilter();

      applyThemeFilter("nube");
      clearThemeFilter();

      applyStartDateFilter("2023-01-01");
      clearStartDateFilter();

      applyEndDateFilter("2023-12-31");
      clearEndDateFilter();

      cy.get('input[type="file"]').selectFile('cypress/e2e/json/nubes.json');
      cy.get("button").contains("Importar Carta").click().wait(2000);
    });
  });
});