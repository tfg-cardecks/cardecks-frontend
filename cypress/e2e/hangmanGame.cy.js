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
  cy.get(".container")
    .children()
    .next()
    .next()
    .find("button")
    .contains("Iniciar Juego")
    .click()
    .wait(500);
}

function playGame() {
  clickToNavElement("Mazos");
  cy.get("a").contains("Crear Mazo").click().wait(2000);

  typeAndAssert("input[name='name']", generateRandomText());
  typeAndAssert("input[name='description']", generateRandomText());
  typeAndAssert("input[name='theme']", generateRandomText());
  cy.get("button").contains("Crear Mazo").click().wait(2000);

  selectedFileToImportAndSubmit("cypress/e2e/json/nubes.json"); // n u b e s (5 letters)
  selectedFileToImportAndSubmit("cypress/e2e/json/cascada.json"); // c a s c a d e (7 letters)
  selectedFileToImportAndSubmit("cypress/e2e/json/hojas.json"); // h o j a s (5 letters)
  selectedFileToImportAndSubmit("cypress/e2e/json/lluvia.json"); // l l u v i a (6 letters)
  selectedFileToImportAndSubmit("cypress/e2e/json/nubosa.json"); // n u b o s a (6 letters)

  cy.visit("http://localhost:5173/lobby").wait(2000);
  cy.get(".game-type-list")
    .find("img[alt='Juego del Ahorcado']")
    .click()
    .wait(2000);

  cy.get(".container").children().next().find("h2").eq(0).click().wait(500);

  startGame();
  cy.get(".swal2-confirm").click();

  cy.wait(2000);
}

function guessWord() {
  // Obtener el elemento HTML que contiene la palabra a adivinar usando JQuery y Cypress
  cy.get(".word").then(($word) => {
    // Obtener la longitud de la palabra
    const wordLength = $word.text().length;

    // Letras adivinadas
    const guessedLetters = [
      "n",
      "u",
      "b",
      "a",
      "e",
      "i",
      "s",
      "c",
      "d",
      "h",
      "o",
      "j",
      "l",
      "v",
    ];

    // Palabras posibles a adivinar según la longitud de la palabra
    const possibleWords = {
      5: ["nubes", "hojas"],
      6: ["lluvia", "nubosa"],
      7: ["cascade"],
    };

    // Adivina algunas letras iniciales de la palabra hasta llegar a quedar 1 intento restante
    for (let i = 0; i < 6; i++) {
      cy.get("input").type(guessedLetters[i]);
      cy.get("button").contains("Confirmar").click().wait(1000);
    }

    // Identifica la palabra correcta de la lista proporcionada
    cy.get(".word").then(($updatedWord) => {
      let currentWord = $updatedWord.text();
      cy.log("Palabra actualizada: " + currentWord);
      const correctWord = possibleWords[wordLength]?.filter((word) => {
        return word.split("").every((char, index) => {
          return (
            currentWord[index] === "_" ||
            currentWord[index].toLowerCase() === char
          );
        });
      })[0];

      // Adivina las letras restantes de la palabra
      let guessedLetters = new Set(currentWord.toLowerCase().replace(/_/g, ""));
      let remainingLetters = "";

      for (let letter of correctWord.toLowerCase()) {
        if (!guessedLetters.has(letter)) {
          remainingLetters += letter;
          guessedLetters.add(letter);
        }
      }

      // Escribe las letras restantes de la palabra
      for (let i = 0; i < remainingLetters.length; i++) {
        cy.get("input").type(remainingLetters[i]);
        cy.get("button").contains("Confirmar").click().wait(1000);
      }
    });
  });
  cy.get(".swal2-confirm").click();
  cy.get("button").contains("Siguiente").click().wait(1000);
}

beforeEach(() => {
  setupToPlayGames();
});

describe("testing hangmanGame", () => {
  it("can`t play hangmanGame (not enought cards)", () => {
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

    startGame();
  });

  it("can play hangmanGame (show ¡Has perdido! alert)", () => {
    playGame();

    const guessedLetters = ["z", "g", "w", "x", "y", "f"];

    guessedLetters.forEach((letter) => {
      cy.get("input").type(letter);
      cy.get("button").contains("Confirmar").click().wait(500);
    });

    cy.get(".swal2-confirm").click();

    cy.get("button").contains("Siguiente").click().wait(1000);
    cy.get("button")
      .contains("Volver al Catálogo de Juegos")
      .click()
      .wait(1000);

    cy.get(".game-type-list")
      .find("img[alt='Juego del Ahorcado']")
      .click()
      .wait(2000);

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
  });

  it("can play hangmanGame (show Juego completado alert)", () => {
    playGame();

    let i;
    for (i = 0; i <= 25; i++) {
      cy.log("Intento: " + i);
      guessWord();
    }

    if (i === 26) {
      cy.get(".swal2-confirm").click();
    }
  });

  it("can go to information hangmanGame", () => {
    cy.visit("http://localhost:5173/lobby").wait(2000);
    cy.get(".game-type-list")
      .find("img[alt='Juego del Ahorcado']")
      .click()
      .wait(2000);

    cy.get(".container").children().next().find("h2").eq(0).click().wait(500);

    cy.contains("button", "Información").click().wait(2000);

    cy.contains("button", "Ocultar Información").click().wait(2000);
  });
});
