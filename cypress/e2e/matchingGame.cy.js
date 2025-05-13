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

function clickToCorrectAnswer(jsonMeanings, jsonContents) {
  const attemptMatching = (meaning) => {
    return cy.get(".meanings-container button").each(($meaningButton) => {
      cy.wrap($meaningButton)
        .invoke("text")
        .then((meaningText) => {
          const meaningButtonText = meaningText.trim().toUpperCase();
          if (meaningButtonText === meaning.toUpperCase()) {
            cy.wrap($meaningButton).click({ force: true }).wait(500);
            return false;
          }
        });
    });
  };

  const matchWords = () => {
    cy.get(".words-container button")
      .each(($wordButton) => {
        cy.wrap($wordButton)
          .invoke("text")
          .then((wordText) => {
            const word = wordText.trim().toUpperCase();
            const index = jsonContents.indexOf(word);
            const meaning = index !== -1 ? jsonMeanings[index] : null;
            if (meaning) {
              cy.wrap($wordButton).click({ force: true }).wait(500);
              attemptMatching(meaning);
            }
          });
      })
      .then(() => {
        cy.get("button")
          .contains("Enviar Respuesta")
          .click({ force: true })
          .wait(500);
      });
  };

  matchWords();

  cy.get(".words-container button")
    .each(($wordButton) => {
      cy.wrap($wordButton)
        .invoke("text")
        .then((wordText) => {
          const word = wordText.trim().toUpperCase();
          const index = jsonContents.indexOf(word);
          const meaning = index !== -1 ? jsonMeanings[index] : null;
          if (meaning) {
            cy.wrap($wordButton).click({ force: true }).wait(500);
            attemptMatching(meaning);
          }
        });
    })
    .then(() => {
      cy.get("button")
        .contains("Enviar Respuesta")
        .click({ force: true })
        .wait(500);
    });
}

function clickToIncorrectAnswer(jsonMeanings, jsonContents) {
  const attemptIncorrectMatching = (meaning) => {
    return cy.get(".meanings-container button").each(($meaningButton) => {
      cy.wrap($meaningButton)
        .invoke("text")
        .then((meaningText) => {
          const meaningButtonText = meaningText.trim().toUpperCase();
          if (meaningButtonText !== meaning.toUpperCase()) {
            cy.wrap($meaningButton).click({ force: true }).wait(500);
            return false;
          }
        });
    });
  };

  const matchWordsIncorrectly = () => {
    cy.get(".words-container button")
      .each(($wordButton) => {
        cy.wrap($wordButton)
          .invoke("text")
          .then((wordText) => {
            const word = wordText.trim().toUpperCase();
            const index = jsonContents.indexOf(word);
            const meaning = index !== -1 ? jsonMeanings[index] : null;
            if (meaning) {
              cy.wrap($wordButton).click({ force: true }).wait(500);
              attemptIncorrectMatching(meaning);
            }
          });
      })
      .then(() => {
        cy.get("button")
          .contains("Enviar Respuesta")
          .click({ force: true })
          .wait(500);
        cy.get(".swal2-icon-error").get("button").contains("OK").click();
      });
  };

  for (let i = 0; i < 6; i++) {
    matchWordsIncorrectly();
  }
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
    .find("img[alt='Relacionar Palabras']")
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
  let jsonMeanings = [];

  files.forEach((file) => {
    cy.readFile(file).then((json) => {
      const content = json.frontSide.text[0].content.toUpperCase();
      const meaning = json.backSide.text[0].content.toUpperCase();
      jsonContents.push(content);
      jsonMeanings.push(meaning);
    });
  });
  clickToCorrectAnswer(jsonMeanings, jsonContents);
  cy.get(".swal2-confirm").click();
  cy.wait(3500);
  cy.get(".swal2-confirm").click();
  
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
  let jsonMeanings = [];

  files.forEach((file) => {
    cy.readFile(file).then((json) => {
      const content = json.frontSide.text[0].content.toUpperCase();
      const meaning = json.backSide.text[0].content.toUpperCase();
      jsonContents.push(content);
      jsonMeanings.push(meaning);
    });
  });

  clickToIncorrectAnswer(jsonMeanings, jsonContents);
  cy.wait(3500);
  cy.get(".swal2-icon-error").get("button").contains("OK").click();
  cy.wait(4500);
  cy.get(".swal2-icon-error").get("button").contains("OK").click();
}

function clickToButtonText(text) {
  cy.get(".game-type-list")
    .find("img[alt='Relacionar Palabras']")
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

describe("testing matchingGame invalid", () => {
  it("can`t play matchingGame (not enought cards)", () => {
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

    startGame();
    cy.get("button").contains("Usuario").click().wait(2000);
    cy.get("a").contains("Detalles").click().wait(1500);
    cy.get("button").contains("Darse de baja").click().wait(2000);
    cy.get(".swal2-confirm").click();
  });
});

describe("testing matchingGame positive", () => {
  it("can play one matchingGame and complete the game", () => {
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
