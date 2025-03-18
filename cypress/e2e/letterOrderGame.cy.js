/// <reference types="cypress" />

// local imports
import {
  clickToNavElement,
  generateRandomText,
  selectedFileToImportAndSubmit,
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

function setUpGame() {
  clickToNavElement("Mazos");
  cy.get("a").contains("Crear Mazo").click().wait(2000);

  typeAndAssert("input[name='name']", generateRandomText());
  typeAndAssert("input[name='description']", generateRandomText());
  typeAndAssert("input[name='theme']", generateRandomText());
  cy.get("button").contains("Crear Mazo").click().wait(2000);

  selectedFileToImportAndSubmit("cypress/e2e/json/boli.json");
  selectedFileToImportAndSubmit("cypress/e2e/json/estuche.json");
  selectedFileToImportAndSubmit("cypress/e2e/json/goma.json");
  selectedFileToImportAndSubmit("cypress/e2e/json/lapiz.json");
  selectedFileToImportAndSubmit("cypress/e2e/json/mesa.json");
  selectedFileToImportAndSubmit("cypress/e2e/json/papel.json");
  selectedFileToImportAndSubmit("cypress/e2e/json/pizarra.json");
  selectedFileToImportAndSubmit("cypress/e2e/json/silla.json");
  selectedFileToImportAndSubmit("cypress/e2e/json/tiza.json");
  selectedFileToImportAndSubmit("cypress/e2e/json/ventana.json");

  cy.visit("http://localhost:5173/lobby").wait(2000);
  cy.get(".game-type-list")
    .find("img[alt='Ordenar las Letras']")
    .click()
    .wait(2000);

  cy.get(".container").children().next().find("h2").eq(0).click().wait(500);

  startGame();
  cy.get(".swal2-confirm").click();
  cy.wait(2000);
}

function completeOneGame() {
  setUpGame();

  const files = [
    "cypress/e2e/json/boli.json",
    "cypress/e2e/json/estuche.json",
    "cypress/e2e/json/goma.json",
    "cypress/e2e/json/lapiz.json",
    "cypress/e2e/json/mesa.json",
    "cypress/e2e/json/papel.json",
    "cypress/e2e/json/pizarra.json",
    "cypress/e2e/json/silla.json",
    "cypress/e2e/json/tiza.json",
    "cypress/e2e/json/ventana.json",
  ];

  let jsonContents = [];

  const readFiles = files.map((file) => {
    return cy.readFile(file).then((json) => {
      const content = json.frontSide.text[0].content.toUpperCase();
      jsonContents.push(content);
    });
  });

  cy.wrap(Promise.all(readFiles)).then(() => {
    clickToCorrectAnswer(jsonContents);
  });

  cy.get(".swal2-confirm").click();
  cy.wait(1000);
  cy.get("button").contains("OK").click();
}

function clickToCorrectAnswer(jsonContents) {
  cy.get(".letters-container .letter").then((letters) => {
    const availableLetters = Array.from(letters).map(
      (letter) => letter.innerText
    );

    const correctWord = jsonContents.find((word) => {
      const wordLetters = word.split("");
      return wordLetters.every((letter) => availableLetters.includes(letter));
    });

    if (correctWord) {
      const letters = correctWord.split("");

      letters.forEach((letter, index) => {
        cy.get(".letters-container .letter")
          .contains(letter)
          .trigger("dragstart");

        cy.get(`.word-line:eq(${index})`).trigger("drop");
      });

      cy.get("button").contains("Enviar Palabra").click();
    } else {
      throw new Error("No matching word found in jsonContents");
    }
  });
}

function completeOneIncorrectGame() {
  setUpGame();

  const files = [
    "cypress/e2e/json/boli.json",
    "cypress/e2e/json/estuche.json",
    "cypress/e2e/json/goma.json",
    "cypress/e2e/json/lapiz.json",
    "cypress/e2e/json/mesa.json",
    "cypress/e2e/json/papel.json",
    "cypress/e2e/json/pizarra.json",
    "cypress/e2e/json/silla.json",
    "cypress/e2e/json/tiza.json",
    "cypress/e2e/json/ventana.json",
  ];

  let jsonContents = [];

  files.forEach((file) => {
    cy.readFile(file).then((json) => {
      const content = json.frontSide.text[0].content.toUpperCase();
      jsonContents.push(content);
    });
  });

  cy.wrap(null).then(() => {
    clickToIncorrectAnswer(jsonContents);
  });

  cy.wait(1500);
  cy.get(".swal2-icon-error").get("button").contains("OK").click();
}

function clickToIncorrectAnswer(jsonContents) {
  cy.get(".letters-container .letter").then((letters) => {
    const availableLetters = Array.from(letters).map(
      (letter) => letter.innerText
    );

    const correctWord = jsonContents.find((word) => {
      const wordLetters = word.split("");
      return wordLetters.every((letter) => availableLetters.includes(letter));
    });

    if (correctWord) {
      const letters = correctWord.split("");

      const shuffledLetters = letters.sort(() => Math.random() - 0.5);

      shuffledLetters.forEach((letter, index) => {
        cy.get(".letters-container .letter")
          .contains(letter)
          .trigger("dragstart");

        cy.get(`.word-line:eq(${index})`).trigger("drop");
      });

      cy.get("button").contains("Enviar Palabra").click();
    } else {
      throw new Error("No matching word found in jsonContents");
    }
  });
}

function clickToButtonText(text) {
  cy.get(".game-type-list")
    .find("img[alt='Ordenar las Letras']")
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

describe("testing letterOrderGame positive", () => {
  it("can play one letterOrderGame and complete the game", () => {
    completeOneGame();
    cy.get("button").contains("Usuario").click().wait(2000);
    cy.get("a").contains("Detalles").click().wait(1500);
    cy.get("button").contains("Darse de baja").click().wait(2000);
    cy.get(".swal2-confirm").click();
  });
  it("display `¡Has perdido!` alert ", () => {
    completeOneIncorrectGame();
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
