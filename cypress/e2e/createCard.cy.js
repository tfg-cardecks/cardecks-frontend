/// <reference types="cypress" />

// local imports
import {
  clickToNavElement,
  typeAndAssert,
  goToHomePage,
  generateRandomUser,
} from "./utils";

beforeEach(() => {
  goToHomePage();
});

describe("testing the create card", () => {
  it("creating a new card con texto successfully", () => {
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
      cy.get("a").contains("Crear Carta").click().wait(1500);

      typeAndAssert("input[name='title']", "Carta de prueba");
      typeAndAssert("input[name='theme']", "Tema de prueba");
      cy.get("select#cardType").select("Texto y Texto").wait(1500);

      cy.get("button").contains("Crear Carta").click().wait(2000);

      cy.get("button").contains("Añadir Texto").click().wait(1500);

      cy.get("select").select("Trasera").wait(1500);

      cy.get("button").contains("Añadir Texto").click().wait(1500);

      cy.get("button").contains("Crear Carta").click().wait(2000);
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

  it("creating a new card con imagen successfully", () => {
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
      cy.get("a").contains("Crear Carta").click().wait(1500);

      typeAndAssert("input[name='title']", "Carta de prueba");
      typeAndAssert("input[name='theme']", "Tema de prueba");
      cy.get("select#cardType").select("Texto e Imagen").wait(1500);

      cy.get("button").contains("Crear Carta").click().wait(2000);

      cy.get("button").contains("Añadir Texto").click().wait(1500);

      cy.get("select").select("Trasera").wait(1500);

      typeAndAssert("input[type='text']", "https://img.freepik.com/vector-gratis/perro-lindo-alegre-sobre-fondo-blanco_1308-132745.jpg");

      cy.get("button").contains("Cargar Imagen").click().wait(2000);

      cy.get("button").contains("Crear Carta").click().wait(2000);
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
