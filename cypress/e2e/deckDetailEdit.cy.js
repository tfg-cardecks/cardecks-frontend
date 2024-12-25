/// <reference types="cypress" />

// local imports
import {
  clickToNavElement,
  typeAndAssert,
  goToHomePage,
  generateRandomUser,
  generateRandomText,
  generateRandomTextCard,
  getTemaLabel,
  applyTypeFilter,
  applyTitleFilter,
  clearTitleFilter,
  clearThemeFilter,
  applyThemeFilter,
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

describe("Edit Deck Functionality", () => {
  it("should create, edit, and delete a deck successfully", () => {
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

      clickToNavElement("Cartas");
      cy.get("a").contains("Crear Carta").click().wait(1500);
      const cardTitle = generateRandomTextCard();

      typeAndAssert("input[name='title']", cardTitle);
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

      cy.visit(
        `http://localhost:5173/user/${localStorage.getItem(
          "userId"
        )}/create-deck`
      );
      typeAndAssert("input[name='name']", generateRandomText());
      typeAndAssert("input[name='description']", "This is a test deck.");
      typeAndAssert("input[name='theme']", "Test Theme");

      cy.get("button.bg-blue-500.text-white").click().wait(2000);
      getTemaLabel().children().type("Tema");
      getTemaLabel().children().type("Fecha de Inicio");
      getTemaLabel().children().type("Fecha de Fin");
      getTemaLabel().children().type("Tipo de Carta");
      getTemaLabel().children().type("Ordenar por");

      applyAlphabetFilter("C");
      clearAlphabetFilter();

      cy.get("button").contains("Crear Mazo").click().wait(2000);

      cy.get("button").contains("Actualizar").click();

      cy.get("button").contains("Actualizar Mazo").click();

      cy.get("button").contains("Eliminar").click().wait(2000);

      clickToNavElement("Cartas");
      cy.get("a").contains("Mis Cartas").click().wait(2000);
      cy.get("h2.text-xl.font-bold.mb-2").contains(cardTitle).first().click();
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

describe("Edit Deck Validation", () => {
  it("should show an error message when theme is missing", () => {
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

      clickToNavElement("Cartas");
      cy.get("a").contains("Crear Carta").click().wait(1500);
      const cardTitle = generateRandomTextCard();

      typeAndAssert("input[name='title']", cardTitle);
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

      cy.visit(
        `http://localhost:5173/user/${localStorage.getItem(
          "userId"
        )}/create-deck`
      );
      typeAndAssert("input[name='name']", generateRandomText());
      typeAndAssert("input[name='description']", "This is a test deck.");
      typeAndAssert("input[name='theme']", "Test Theme");

      cy.get("button").contains("Crear Mazo").click().wait(4000);

      cy.get("button").contains("Actualizar").click();

      cy.get('input[name="theme"]').clear();

      cy.get("button").contains("Actualizar Mazo").click();
      cy.get("p.text-red-600").should("contain", "El tema es obligatorio");
      cy.get("button").contains("Cancelar").click();

      cy.get("button").contains("Eliminar").click().wait(2000);

      clickToNavElement("Cartas");
    });
  });
});
