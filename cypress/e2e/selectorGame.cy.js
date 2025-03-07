/// <reference types="cypress" />

// local imports
import {
  clickToNavElement,
  generateRandomText,
  setupToPlayGames,
  typeAndAssert,
} from "./utils";

beforeEach(() => {
  setupToPlayGames();
});

describe("testing selector", () => {
  it("selector guessTheImageGame", () => {
    clickToNavElement("Mazos");
    cy.get("a").contains("Crear Mazo").click().wait(2000);

    typeAndAssert("input[name='name']", generateRandomText());
    typeAndAssert("input[name='description']", generateRandomText());
    typeAndAssert("input[name='theme']", generateRandomText());
    cy.get("button").contains("Crear Mazo").click().wait(2000);

    cy.get("h2")
      .contains("Cartas")
      .next()
      .find('input[type="file"]')
      .selectFile("cypress/e2e/json/cascada.json");
    cy.get("button").contains("Importar Carta a Mazo").click().wait(2000);

    cy.visit("http://localhost:5173/lobby").wait(2000);
    cy.get(".game-type-list")
      .find("img[alt='Adivina la Imagen']")
      .click()
      .wait(2000);

    cy.get(".container").children().next().find("h2").eq(0).click().wait(500);
    cy.get("div.flex.flex-col.items-center.mb-4.mt-8")
      .find('input[type="number"]')
      .clear();
    cy.get("div.flex.flex-col.items-center.mb-4")
      .contains("Total de Partidas:")
      .parent()
      .find('input[type="number"]')
      .clear();
    cy.get("select#decksPerPage").select("10");
    cy.get('input[placeholder="Nombre"]').type("Deck");
    cy.get("button").contains("Cambiar de Juego").click();
  });

  it("selector hangman", () => {
    clickToNavElement("Mazos");
    cy.get("a").contains("Crear Mazo").click().wait(2000);

    typeAndAssert("input[name='name']", generateRandomText());
    typeAndAssert("input[name='description']", generateRandomText());
    typeAndAssert("input[name='theme']", generateRandomText());
    cy.get("button").contains("Crear Mazo").click().wait(2000);

    cy.get("h2")
      .contains("Cartas")
      .next()
      .find('input[type="file"]')
      .selectFile("cypress/e2e/json/cascada.json");
    cy.get("button").contains("Importar Carta a Mazo").click().wait(2000);

    cy.visit("http://localhost:5173/lobby").wait(2000);
    cy.get(".game-type-list")
      .find("img[alt='Juego del Ahorcado']")
      .click()
      .wait(2000);

    cy.get(".container").children().next().find("h2").eq(0).click().wait(500);
    cy.get("div.flex.flex-col.items-center.mb-4.mt-8")
      .find('input[type="number"]')
      .clear();
    cy.get("div.flex.flex-col.items-center.mb-4")
      .contains("Total de Partidas:")
      .parent()
      .find('input[type="number"]')
      .clear();
    cy.get("select#decksPerPage").select("10");
    cy.get('input[placeholder="Nombre"]').type("Deck");
    cy.get("button").contains("Cambiar de Juego").click();
  });

  it("selector wordsearchGame", () => {
    clickToNavElement("Mazos");
    cy.get("a").contains("Crear Mazo").click().wait(2000);

    typeAndAssert("input[name='name']", generateRandomText());
    typeAndAssert("input[name='description']", generateRandomText());
    typeAndAssert("input[name='theme']", generateRandomText());
    cy.get("button").contains("Crear Mazo").click().wait(2000);

    cy.get("h2")
      .contains("Cartas")
      .next()
      .find('input[type="file"]')
      .selectFile("cypress/e2e/json/cascada.json");
    cy.get("button").contains("Importar Carta a Mazo").click().wait(2000);

    cy.visit("http://localhost:5173/lobby").wait(2000);
    cy.get(".game-type-list")
      .find("img[alt='Sopa de Letras']")
      .click()
      .wait(2000);

    cy.get(".container").children().next().find("h2").eq(0).click().wait(500);
    cy.get("div.flex.flex-col.items-center.mb-4")
      .contains("Número de Palabras:")
      .parent()
      .find('input[type="number"]')
      .clear()
      .type("3");
    cy.get("div.flex.flex-col.items-center.mb-4")
      .contains("Duración (segundos):")
      .parent()
      .find('input[type="number"]')
      .clear()
      .type("12");
    cy.get("div.flex.flex-col.items-center.mb-4")
      .contains("Total de Partidas:")
      .parent()
      .find('input[type="number"]')
      .clear();
    cy.get("select#decksPerPage").select("10");
    cy.get('input[placeholder="Nombre"]').type("Deck");
    cy.get("button").contains("Cambiar de Juego").click();
  });

  it("selector matchingGame", () => {
    clickToNavElement("Mazos");
    cy.get("a").contains("Crear Mazo").click().wait(2000);

    typeAndAssert("input[name='name']", generateRandomText());
    typeAndAssert("input[name='description']", generateRandomText());
    typeAndAssert("input[name='theme']", generateRandomText());
    cy.get("button").contains("Crear Mazo").click().wait(2000);

    cy.get("h2")
      .contains("Cartas")
      .next()
      .find('input[type="file"]')
      .selectFile("cypress/e2e/json/cascada.json");
    cy.get("button").contains("Importar Carta a Mazo").click().wait(2000);

    cy.visit("http://localhost:5173/lobby").wait(2000);
    cy.get(".game-type-list")
      .find("img[alt='Relacionar Palabras']")
      .click()
      .wait(2000);

    cy.get(".container").children().next().find("h2").eq(0).click().wait(500);
    cy.get("div.flex.flex-col.items-center.mb-4")
      .contains("Número de Palabras:")
      .parent()
      .find('input[type="number"]')
      .clear()
      .type("3");
    cy.get("div.flex.flex-col.items-center.mb-4")
      .contains("Duración (segundos):")
      .parent()
      .find('input[type="number"]')
      .clear()
      .type("12");
    cy.get("div.flex.flex-col.items-center.mb-4")
      .contains("Total de Partidas:")
      .parent()
      .find('input[type="number"]')
      .clear();
    cy.get("select#decksPerPage").select("10");
    cy.get('input[placeholder="Nombre"]').type("Deck");
    cy.get("button").contains("Cambiar de Juego").click();
  });
});
