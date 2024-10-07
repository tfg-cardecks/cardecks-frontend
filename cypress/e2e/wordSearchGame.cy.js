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
    // create a new deck
    clickToNavElement("Mazos");
    cy.get("a").contains("Crear Mazo").click().wait(2000);

    typeAndAssert("input[name='name']", generateRandomText());
    typeAndAssert("input[name='description']", generateRandomText());
    typeAndAssert("input[name='theme']", generateRandomText());
    cy.get("button").contains("Crear Mazo").click().wait(2000);
    cy.get("button").contains("Importar Carta a Mazo").click().wait(2000);
  });

  it("can play wordsearch game (not enought cards)", () => {
    // create a new deck
    clickToNavElement("Mazos");
    cy.get("a").contains("Crear Mazo").click().wait(2000);

    typeAndAssert("input[name='name']", generateRandomText());
    typeAndAssert("input[name='description']", generateRandomText());
    typeAndAssert("input[name='theme']", generateRandomText());
    cy.get("button").contains("Crear Mazo").click().wait(2000);

    // select cards importing from the computer
    cy.get("h2")
      .contains("Cartas")
      .next()
      .find('input[type="file"]')
      .selectFile("cypress/e2e/json/cascada.json");
    cy.get("button").contains("Importar Carta a Mazo").click().wait(2000);

    cy.visit("http://localhost:5173/lobby").wait(2000);
    cy.get(".game-type-list").click().wait(2000);

    cy.get(".container").children().next().find("h2").eq(0).click().wait(500);

    startGame();
  });

  it("can play wordsearch game", () => {
    // create a new deck
    clickToNavElement("Mazos");
    cy.get("a").contains("Crear Mazo").click().wait(2000);

    typeAndAssert("input[name='name']", generateRandomText());
    typeAndAssert("input[name='description']", generateRandomText());
    typeAndAssert("input[name='theme']", generateRandomText());
    cy.get("button").contains("Crear Mazo").click().wait(2000);

    // select cards importing from the computer
    selectedFileToImportAndSubmit("cypress/e2e/json/nubes.json");
    selectedFileToImportAndSubmit("cypress/e2e/json/cascada.json");
    selectedFileToImportAndSubmit("cypress/e2e/json/hojas.json");
    selectedFileToImportAndSubmit("cypress/e2e/json/lluvia.json");

    cy.visit("http://localhost:5173/lobby").wait(2000);
    cy.get(".game-type-list").click().wait(2000);

    cy.get(".container").children().next().find("h2").eq(0).click().wait(500);

    startGame();
    cy.get(".swal2-confirm").click();

    const words = ["cascade", "lluvia", "nubes", "hojas"];

    getGrid().then((gridString) => {
      let grid = JSON.parse(gridString); // Convertir la cadena JSON a una matriz
      grid = grid.map((row) => row.join("")); // Convertir cada fila en una cadena
      cy.log("The grid is:", grid).then(() => {
        const solution = wordSearchSolver(grid, words);
        cy.log("The solution is: ", solution).then(() => {
          selectWord(solution);
        });
      });
    });

    cy.wait(1500).get(".swal2-confirm").click();

    // testing the buttons in the game
    cy.get("button").contains("Siguiente").click().wait(1000);
    cy.get("button").contains("Volver al Lobby").click().wait(1000);

    // now repeat the procees to select the deck (validate there is an in progress game)
    cy.get(".game-type-list").click().wait(2000);

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

    //now click to "Forzar Completado"
    cy.get("button").contains("Forzar Completado").click().wait(1000);

    //reset the game
    cy.get("h2")
      .contains("Estadísticas")
      .next() // estoy en el hr
      .next() // estoy en el div
      .children() // estoy en el p
      .next() // estoy en el ul
      .get("button")
      .contains("Resetear Contador de Juego")
      .click()
      .wait(1000)
      .then(() => {
        cy.get(".swal2-confirm").click();
      });
  });
});
