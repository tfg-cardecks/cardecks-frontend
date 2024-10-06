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

describe("testing the create deck", () => {
  it("creating a new deck successfully without selecting any cards", () => {
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

      cy.get('input[type="checkbox"]')
        .check()
        .wait(5000);
      cy.get("button").contains("Crear Mazo").click().wait(5000);

      cy.get("a").contains("Carta de prueba").click().wait(2000);
      cy.get("button").contains("Eliminar").click().wait(2000);

      clickToNavElement("Mazos");
      cy.get("a").contains("Mis Mazos").click().wait(1500);
      cy.get("div.border.p-4.rounded-lg.shadow-lg")
        .contains("Test Deck")
        .click()
        .wait(2000);

      // Aplicar filtro de título
      cy.get('input[type="text"]').eq(0).type("Carta de prueba");
      cy.get("button").contains("Limpiar").eq(0).click().wait(500);

      // Aplicar filtro de tema
      cy.get('input[type="text"]').eq(1).type("Tema de prueba");
      cy.get("button").contains("Limpiar").eq(1).click().wait(500);

      // Aplicar filtro de fecha de inicio
      cy.get('input[type="date"]').eq(0).type("2023-01-01");
      cy.get("button").contains("Limpiar").eq(2).click().wait(500);

      // Aplicar filtro de fecha de fin
      cy.get('input[type="date"]').eq(1).type("2023-12-31");
      cy.get("button").contains("Limpiar").eq(3).click().wait(500);

      // Verificar que las cartas filtradas se muestran correctamente
      cy.get(".h-96.overflow-y-auto.border.p-4.rounded-lg")
        .find(".card-selector-item")
        .should("have.length.greaterThan", 0);

      // Seleccionar una carta filtrada
      cy.get(".card-selector-item").first().click();

      // Verificar que la carta está seleccionada
      cy.get(".card-selector-item.selected").should("have.length", 1);

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
