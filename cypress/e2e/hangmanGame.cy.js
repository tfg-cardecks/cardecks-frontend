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

function createDeck() {
  clickToNavElement("Mazos");
  cy.get("a").contains("Crear Mazo").click().wait(2000);

  typeAndAssert("input[name='name']", generateRandomText());
  typeAndAssert("input[name='description']", generateRandomText());
  typeAndAssert("input[name='theme']", generateRandomText());
  cy.get("button").contains("Crear Mazo").click().wait(2000);
}

function createHangmanGame() {
  cy.visit("http://localhost:5173/lobby").wait(2000);
  cy.get(".game-type-list")
    .find("img[alt='Juego del Ahorcado']")
    .click()
    .wait(2000);

  cy.get(".container").children().next().find("h2").eq(0).click().wait(500);

  startGame();
}

function setUpGame() {
  createDeck();

  selectedFileToImportAndSubmit("cypress/e2e/json/nubes.json"); // n u b e s (5 letters)
  selectedFileToImportAndSubmit("cypress/e2e/json/cascada.json"); // c a s c a d e (7 letters)
  selectedFileToImportAndSubmit("cypress/e2e/json/hojas.json"); // h o j a s (5 letters)
  selectedFileToImportAndSubmit("cypress/e2e/json/lluvia.json"); // l l u v i a (6 letters)
  selectedFileToImportAndSubmit("cypress/e2e/json/nubosa.json"); // n u b o s a (6 letters)

  createHangmanGame();
  cy.get(".swal2-confirm").click();

  cy.wait(2000);
}

function clickToButtonText(text) {
  cy.get(".game-type-list")
    .find("img[alt='Juego del Ahorcado']")
    .click()
    .wait(2000);
  cy.get(".container").children().next().find("h2").eq(0).click().wait(500);

  startGame();
  cy.get(".swal2-confirm").click();
  cy.wait(2000);
  cy.get("button").contains(text).click();
}

function guessWord() {
  cy.get(".word").then(($word) => {
    const wordLength = $word.text().length;

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

    const possibleWords = {
      5: ["nubes", "hojas"],
      6: ["lluvia", "nubosa"],
      7: ["cascade"],
    };

    for (let i = 0; i < 6; i++) {
      cy.get(".swal2-container").should("not.exist");
      cy.get('input[placeholder="Introduce una letra"]').type(
        guessedLetters[i]
      );
      cy.get("button").contains("Confirmar").click().wait(2500);

      cy.get("body").then(($body) => {
        if ($body.find(".swal2-container").length > 0) {
          cy.get(".swal2-confirm").click();
        } else {
          cy.log("El modal no apareció, continuando...");
        }
      });
    }

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

      let guessedLetters = new Set(currentWord.toLowerCase().replace(/_/g, ""));
      let remainingLetters = "";

      for (let letter of correctWord.toLowerCase()) {
        if (!guessedLetters.has(letter)) {
          remainingLetters += letter;
          guessedLetters.add(letter);
        }
      }

      for (let i = 0; i < remainingLetters.length; i++) {
        cy.get('input[placeholder="Introduce una letra"]').type(
          remainingLetters[i]
        );
        cy.get("button").contains("Confirmar").click().wait(1000);
      }
    });
  });
  cy.get(".swal2-confirm").click();
  cy.get(".swal2-confirm").click();
}

beforeEach(() => {
  setupToPlayGames();
});

describe("testing hangmanGame", () => {
  // it("can`t play hangmanGame (not enought cards)", () => {
  //   createDeck();
  //   selectedFileToImportAndSubmit("cypress/e2e/json/cascada.json");
  //   createHangmanGame();
  //   cy.get("button").contains("Usuario").click().wait(2000);
  //   cy.get("a").contains("Detalles").click().wait(1500);
  //   cy.get("button").contains("Darse de baja").click().wait(2000);
  //   cy.get(".swal2-confirm").click();
  // });

  it("can play hangmanGame (show ¡Has perdido! alert)", () => {
    setUpGame();

    const guessedLetters = ["z", "g", "w", "x", "y", "f"];

    guessedLetters.forEach((letter) => {
      cy.get('input[placeholder="Introduce una letra"]').type(letter);
      cy.get("button").contains("Confirmar").click().wait(1500);
      cy.get(".swal2-confirm").click();
      cy.get(".swal2-container").then(($popup) => {
        if (
          $popup
            .text()
            .includes(
              "Has completado todas las partidas del juego del ahorcado"
            )
        ) {
          cy.get(".swal2-confirm").click();
        } else {
          cy.log("El pop-up no contiene el mensaje esperado, no se hace clic.");
        }
      });
    });
    cy.get("button").contains("Usuario").click().wait(2000);
    cy.get("a").contains("Detalles").click().wait(1500);
    cy.get("button").contains("Darse de baja").click().wait(2000);
    cy.get(".swal2-confirm").click();
  });

  //   it("can play hangmanGame (show Juego completado alert)", () => {
  //     setUpGame();
  //     guessWord();
  //     cy.get("button").contains("Usuario").click().wait(2000);
  //     cy.get("a").contains("Detalles").click().wait(1500);
  //     cy.get("button").contains("Darse de baja").click().wait(2000);
  //     cy.get(".swal2-confirm").click();
  //   });
  // });

  // describe("testing the buttons", () => {
  //   it("show `Tiempo agotado` alert and click to the buttons", () => {
  //     setUpGame();
  //     cy.wait(60000);
  //     cy.get(".swal2-confirm").click();

  //     clickToButtonText("Volver al Catálogo de Juegos");

  //     clickToButtonText("Cambiar de Mazo");
  //     cy.get("button").contains("Usuario").click().wait(2000);
  //     cy.get("a").contains("Detalles").click().wait(1500);
  //     cy.get("button").contains("Darse de baja").click().wait(2000);
  //     cy.get(".swal2-confirm").click();
  //   });
});
