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
  cy.get(
    "button.px-4.py-2.rounded-lg.shadow-lg.bg-gradient-to-r.from-green-400.to-green-600.text-white"
  )
    .contains("Iniciar Juego")
    .click()
    .wait(500);
}

function createDeck() {
  clickToNavElement("Mazos");
  cy.get("a").contains("Crear Mazo").click().wait(2000);

  typeAndAssert("input[name='name']", generateRandomText());
  typeAndAssert("input[name='description']", generateRandomText());
  typeAndAssert("input[name='theme']", generateRandomText());
  cy.get("button").contains("Crear Mazo").click().wait(2000);
}

function createWordSearchGame() {
  cy.visit("http://localhost:5173/lobby").wait(2000);
  cy.get(".game-type-list")
    .find("img[alt='Sopa de Letras']")
    .click()
    .wait(2000);

  cy.get(".container").children().next().find("h2").eq(0).click().wait(500);

  startGame();
}

function setUpGame() {
  createDeck();

  selectedFileToImportAndSubmit("cypress/e2e/json/nubes.json");
  selectedFileToImportAndSubmit("cypress/e2e/json/cascada.json");
  selectedFileToImportAndSubmit("cypress/e2e/json/hojas.json");
  selectedFileToImportAndSubmit("cypress/e2e/json/lluvia.json");
  selectedFileToImportAndSubmit("cypress/e2e/json/nubosa.json");

  createWordSearchGame();
  cy.get(".swal2-confirm").click();
}

function clickToButtonText(text) {
  cy.get(".game-type-list")
    .find("img[alt='Sopa de Letras']")
    .click()
    .wait(2000);
  cy.get(".container").children().next().find("h2").eq(0).click().wait(500);

  startGame();
  cy.get(".swal2-confirm").click();
  cy.wait(2000);
  cy.get("button").contains(text).click();
}

beforeEach(() => {
  setupToPlayGames();
});

describe("testing the first game", () => {
  it("can't play wordsearch game without a card", () => {
    createDeck();
    cy.get("button").contains("Importar Carta a Mazo").click().wait(2000);
    cy.get("button").contains("Usuario").click().wait(2000);
    cy.get("a").contains("Detalles").click().wait(1500);
    cy.get("button").contains("Darse de baja").click().wait(2000);
    cy.get(".swal2-confirm").click();

  });

  it("can't play wordsearch game (not enought cards)", () => {
    createDeck();
    selectedFileToImportAndSubmit("cypress/e2e/json/cascada.json");
    createWordSearchGame();
    cy.get("button").contains("Usuario").click().wait(2000);
    cy.get("a").contains("Detalles").click().wait(1500);
    cy.get("button").contains("Darse de baja").click().wait(2000);
    cy.get(".swal2-confirm").click();
  });

  it("can play wordsearch game", () => {
    setUpGame();

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
    cy.get("button").contains("Usuario").click().wait(2000);
    cy.get("a").contains("Detalles").click().wait(1500);
    cy.get("button").contains("Darse de baja").click().wait(2000);
    cy.get(".swal2-confirm").click();

  });
});

describe("testing the buttons", () => {
  it("show `Tiempo agotado` alert and click to the buttons", () => {
    setUpGame();
    cy.wait(60000);
    cy.get(".swal2-confirm").click();

    clickToButtonText("Volver al Catálogo de Juegos");

    clickToButtonText("Cambiar de Mazo");
    cy.get("button").contains("Usuario").click().wait(2000);
    cy.get("a").contains("Detalles").click().wait(1500);
    cy.get("button").contains("Darse de baja").click().wait(2000);
    cy.get(".swal2-confirm").click();

  });
});
