/// <reference types="cypress" />

// local imports
import {
  clickToNavElement,
  typeAndAssert,
  goToHomePage,
  generateRandomUser,
  generateRandomTextCard,
} from "./utils";

beforeEach(() => {
  goToHomePage();
});

describe("testing the export card functionality", () => {
  it("should export a card successfully", () => {
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
      cy.get("a").contains("Crear Carta").click().wait(1500);

      typeAndAssert("input[name='title']", generateRandomTextCard());
      typeAndAssert("input[name='theme']", "Tema de prueba12");
      cy.get("select#cardType").select("Texto e Imagen").wait(1500);

      cy.get("button").contains("Crear Carta").click().wait(2000);

      cy.get("button").contains("Añadir Texto").click().wait(1500);

      cy.get("select").select("Trasera").wait(1500);

      typeAndAssert(
        "input[type='text']",
        "https://img.freepik.com/vector-gratis/perro-lindo-alegre-sobre-fondo-blanco_1308-132745.jpg"
      );

      cy.get("button").contains("Cargar Imagen").click().wait(2000);

      cy.get("button").contains("Crear Carta").click().wait(4000);

      cy.get("button").contains("Exportar Carta").click();

      cy.get("button").contains("Eliminar").click().wait(2000);
    });
  });
});
