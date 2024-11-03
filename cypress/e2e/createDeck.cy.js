/// <reference types="cypress" />

// local imports
import {
  clickToNavElement,
  typeAndAssert,
  goToHomePage,
  generateRandomUser,
  getCorrectInputDateWithSpecificDate,
  getTemaLabel,
  clearDate,
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
      cy.get("button").contains("Iniciar sesión").click().wait(2000);

      clickToNavElement("Cartas");
      cy.get("a").contains("Crear Carta").click().wait(1500);

      typeAndAssert("input[name='title']", "Carta de prueba1");
      typeAndAssert("input[name='theme']", "Tema de prueba1");
      cy.get("select#cardType").select("Texto e Imagen").wait(1500);

      cy.get("button").contains("Crear Carta").click().wait(2000);

      cy.get("button").contains("Añadir Texto").click().wait(1500);

      cy.get("select").select("Trasera").wait(1500);

      typeAndAssert(
        "input[type='text']",
        "https://img.freepik.com/vector-gratis/perro-lindo-alegre-sobre-fondo-blanco_1308-132745.jpg"
      );

      cy.get("button").contains("Cargar Imagen").click().wait(2000);

      cy.get("button").contains("Crear Carta").click().wait(2000);

      clickToNavElement("Mazos");
      cy.get("a").contains("Crear Mazo").click().wait(2000);

      typeAndAssert("input[name='name']", "Test Deck");
      typeAndAssert("input[name='description']", "This is a test deck.");
      typeAndAssert("input[name='theme']", "Test Theme");

      cy.get('input[type="text"]').eq(0).type("Carta de prueba");
      cy.get("button").contains("Limpiar").eq(0).click().wait(500);

      getTemaLabel().children().type("Tema de prueba");
      getTemaLabel()
        .parent()
        .find("button")
        .contains("Limpiar")
        .click()
        .wait(500);

      getCorrectInputDateWithSpecificDate(0, "2023-01-01");
      clearDate("Fecha de Inicio:");

      getCorrectInputDateWithSpecificDate(1, "2023-12-31");
      clearDate("Fecha de Fin:");

      applyTypeFilter("Texto e Imagen");
      clearTypeFilter();

      applySortOption("name-asc");
      applySortOption("name-desc");
      applySortOption("createdAt-asc");
      applySortOption("createdAt-desc");

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
