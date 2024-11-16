/// <reference types="cypress" />

import wordSearchSolver from "word-search-solver";

// local imports
import {
  clickToNavElement,
  generateRandomText,
  getGrid,
  selectedFileToImportAndSubmit,
  selectWord,
  setupToPlayGames,
  typeAndAssert,
} from "./utils";

function startGame() {
  cy.get(".container")
    .children()
    .next()
    .next()
    .find("button")
    .contains("Iniciar Juego")
    .click()
    .wait(500);
}

beforeEach(() => {
  setupToPlayGames();
});

describe("testing the first game", () => {
  it("can't play wordsearch game without a card", () => {
    clickToNavElement("Mazos");
    cy.get("a").contains("Crear Mazo").click().wait(2000);

    typeAndAssert("input[name='name']", generateRandomText());
    typeAndAssert("input[name='description']", generateRandomText());
    typeAndAssert("input[name='theme']", generateRandomText());
    cy.get("button").contains("Crear Mazo").click().wait(2000);
    cy.get("button").contains("Importar Carta a Mazo").click().wait(2000);
  });

  it("can play wordsearch game (not enought cards)", () => {
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
    cy.get(".game-type-list").find("img[alt='Sopa de Letras']").click().wait(2000);

    cy.get(".container").children().next().find("h2").eq(0).click().wait(500);

    startGame();
  });

  it("can play wordsearch game", () => {
    clickToNavElement("Mazos");
    cy.get("a").contains("Crear Mazo").click().wait(2000);

    typeAndAssert("input[name='name']", generateRandomText());
    typeAndAssert("input[name='description']", generateRandomText());
    typeAndAssert("input[name='theme']", generateRandomText());
    cy.get("button").contains("Crear Mazo").click().wait(2000);

    selectedFileToImportAndSubmit("cypress/e2e/json/nubes.json");
    selectedFileToImportAndSubmit("cypress/e2e/json/cascada.json");
    selectedFileToImportAndSubmit("cypress/e2e/json/hojas.json");
    selectedFileToImportAndSubmit("cypress/e2e/json/lluvia.json");
    selectedFileToImportAndSubmit("cypress/e2e/json/nubosa.json");

    cy.visit("http://localhost:5173/lobby").wait(2000);
    cy.get(".game-type-list").find("img[alt='Sopa de Letras']").click().wait(2000);

    cy.get(".container").children().next().find("h2").eq(0).click().wait(500);

    cy.contains("button", "Información").click().wait(2000);

    cy.contains("button", "Ocultar Información").click().wait(2000);

    startGame();
    cy.get(".swal2-confirm").click();

    const words = ["cascade", "lluvia", "nubes", "hojas", "nubosa"];

    getGrid().then((gridString) => {
      let grid = JSON.parse(gridString);
      grid = grid.map((row) => row.join(""));
      cy.log("The grid is:", grid).then(() => {
        const solution = wordSearchSolver(grid, words);
        cy.log("The solution is: ", solution).then(() => {
          selectWord(solution.filter((word) => word.found));
        });
      });
    });

    cy.wait(1500).get(".swal2-confirm").click();

    cy.get("button").contains("Siguiente").click().wait(1000);
    cy.get("button")
      .contains("Volver al Catálogo de Juegos")
      .click()
      .wait(1000);

    cy.get(".game-type-list").find("img[alt='Sopa de Letras']").click().wait(2000);

    cy.get(".container").children().next().find("h2").eq(0).click().wait(500);

    startGame();

    cy.get(".container")
      .children()
      .next()
      .next()
      .next()
      .find("button")
      .contains("Continuar Juego en Progreso")
      .click()
      .wait(500);

    cy.get("button").contains("Forzar Completado").click().wait(1000);

    cy.get("h2")
      .contains("Estadísticas")
      .next()
      .next()
      .children()
      .next()
      .get("button")
      .contains("Resetear Contador")
      .click()
      .wait(1000)
      .then(() => {
        cy.get(".swal2-confirm").click();
      });
  });

  it("can go to information wordsearch game", () => {
    cy.visit("http://localhost:5173/lobby").wait(2000);
    cy.get(".game-type-list").find("img[alt='Sopa de Letras']").click().wait(2000);

    cy.get(".container").children().next().find("h2").eq(0).click().wait(500);

    cy.contains("button", "Información").click().wait(2000);

    cy.contains("button", "Ocultar Información").click().wait(2000);
  });
});
