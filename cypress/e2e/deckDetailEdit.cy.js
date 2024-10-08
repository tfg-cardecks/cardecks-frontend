/// <reference types="cypress" />

// local imports
import {
  clickToNavElement,
  typeAndAssert,
  goToHomePage,
  generateRandomUser,
  generateRandomText,
  generateRandomTextCard,
  getCorrectInputDateWithSpecificDate,
  getTemaLabel,
  clearDate,
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

    generateRandomUser().then(({ email, name, lastName, username }) => {
      typeAndAssert("input[name='name']", name);
      typeAndAssert("input[name='lastName']", lastName);
      typeAndAssert("input[name='username']", username);
      typeAndAssert("input[name='password']", "@Password1");
      typeAndAssert("input[name='password2']", "@Password1");
      typeAndAssert("input[name='email']", email);
      cy.get('select[name="role"]').select("authenticated");
      cy.get("button").contains("Registrar").click().wait(2000);

      cy.wait(2000);

      typeAndAssert("input[name='emailOrUsername']", username);
      typeAndAssert("input[name='password']", "@Password1");
      cy.get("button").contains("Iniciar sesión").click().wait(2000);

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

      // Aplicar filtro de título
      cy.get('input[type="text"]').eq(0).type("Carta de prueba");
      cy.get("button").contains("Limpiar").eq(0).click().wait(500);

      // Aplicar filtro de tema
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

    generateRandomUser().then(({ email, name, lastName, username }) => {
      typeAndAssert("input[name='name']", name);
      typeAndAssert("input[name='lastName']", lastName);
      typeAndAssert("input[name='username']", username);
      typeAndAssert("input[name='password']", "@Password1");
      typeAndAssert("input[name='password2']", "@Password1");
      typeAndAssert("input[name='email']", email);
      cy.get('select[name="role"]').select("authenticated");
      cy.get("button").contains("Registrar").click().wait(2000);

      cy.wait(2000);

      typeAndAssert("input[name='emailOrUsername']", username);
      typeAndAssert("input[name='password']", "@Password1");
      cy.get("button").contains("Iniciar sesión").click().wait(2000);

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

      // Aplicar filtro de título
      cy.get('input[type="text"]').eq(0).type("Carta de prueba");
      cy.get("button").contains("Limpiar").eq(0).click().wait(500);

      // Aplicar filtro de tema
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

      cy.get("button").contains("Crear Mazo").click().wait(2000);

      cy.get("button").contains("Actualizar").click();

      cy.get('input[name="theme"]').clear();

      cy.get("button").contains("Actualizar Mazo").click();
      cy.get("p.text-red-600").should("contain", "El tema es obligatorio");
      cy.get("button").contains("Cancelar").click();

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
