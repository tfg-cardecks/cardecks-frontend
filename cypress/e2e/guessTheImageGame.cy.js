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

function clickToCorrectAnswer(jsonImages, jsonContents) {
  cy.get(".image-container img")
    .invoke("attr", "src")
    .then((src) => {
      cy.get(".options-container button").each(($button, index, $list) => {
        cy.wrap($button)
          .invoke("text")
          .then((text) => {
            const buttonText = text.trim().split(". ")[1].toUpperCase();
            if (jsonImages.includes(src)) {
              const imageIndex = jsonImages.indexOf(src);
              const correctButtonText = jsonContents[imageIndex];
              if (buttonText === correctButtonText) {
                cy.wrap($button).click({ force: true }).wait(500);
                return false;
              }
            }
          });
      });
    });
  cy.get("button")
    .contains("Enviar Respuesta")
    .click({ force: true })
    .wait(500);
  cy.get(".swal2-confirm").click();
  cy.get("button").contains("Siguiente").click({ force: true }).wait(1000);
}

function goToCatalogoDeJuegos() {
  cy.visit("http://localhost:5173/lobby").wait(2000);
  cy.get(".game-type-list")
    .find("img[alt='Adivina la Imagen']")
    .click()
    .wait(2000);

  cy.get(".container").children().next().find("h2").eq(0).click().wait(500);

  startGame();
  cy.get("button").contains("Continuar Juego en Progreso").click().wait(500);
  cy.get("button").contains("Volver al Catálogo de Juegos").click().wait(2000);
}

beforeEach(() => {
  setupToPlayGames();
});

describe("testing guessTheImageGame", () => {
  it("can`t play guessTheImageGame (not enought cards)", () => {
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

    startGame();
  });
});

describe("testing guessTheImageGame", () => {
  it("can play one guessTheImageGame and complete the game", () => {
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
    selectedFileToImportAndSubmit("cypress/e2e/json/arbol.json");

    cy.visit("http://localhost:5173/lobby").wait(2000);
    cy.get(".game-type-list")
      .find("img[alt='Adivina la Imagen']")
      .click()
      .wait(2000);

    cy.get(".container").children().next().find("h2").eq(0).click().wait(500);

    startGame();
    cy.get(".swal2-confirm").click();

    cy.wait(2000);

    const files = [
      "cypress/e2e/json/nubes.json",
      "cypress/e2e/json/cascada.json",
      "cypress/e2e/json/hojas.json",
      "cypress/e2e/json/lluvia.json",
      "cypress/e2e/json/arbol.json",
    ];

    let jsonContents = [];
    let jsonImages = [];

    files.forEach((file) => {
      cy.readFile(file).then((json) => {
        const content = json.frontSide.text[0].content.toUpperCase();
        const imageUrl = json.backSide.images[0].url;
        jsonContents.push(content);
        jsonImages.push(imageUrl);
      });
    });

    // for (let i = 0; i < 2; i++) {
    //   cy.log("Intento: " + i);
    //   clickToCorrectAnswer(jsonImages, jsonContents);
    // }
    clickToCorrectAnswer(jsonImages, jsonContents);
    cy.wait(6000);
    cy.get("button").contains("OK").click().wait(4000);

    goToCatalogoDeJuegos();
  });

//   it("can play guessTheImageGame and show ¡Incorrecto! error and then ff game", () => {
//     clickToNavElement("Mazos");
//     cy.get("a").contains("Crear Mazo").click().wait(2000);

//     typeAndAssert("input[name='name']", generateRandomText());
//     typeAndAssert("input[name='description']", generateRandomText());
//     typeAndAssert("input[name='theme']", generateRandomText());
//     cy.get("button").contains("Crear Mazo").click().wait(2000);

//     selectedFileToImportAndSubmit("cypress/e2e/json/nubes.json");
//     selectedFileToImportAndSubmit("cypress/e2e/json/cascada.json");
//     selectedFileToImportAndSubmit("cypress/e2e/json/hojas.json");
//     selectedFileToImportAndSubmit("cypress/e2e/json/lluvia.json");
//     selectedFileToImportAndSubmit("cypress/e2e/json/arbol.json");

//     cy.visit("http://localhost:5173/lobby").wait(2000);
//     cy.get(".game-type-list")
//       .find("img[alt='Adivina la Imagen']")
//       .click()
//       .wait(2000);

//     cy.get(".container").children().next().find("h2").eq(0).click().wait(500);

//     startGame();
//     cy.get(".swal2-confirm").click();

//     cy.wait(2000);

//     cy.get('.options-container button').eq(0).click().wait(500);
//     cy.get("button").contains("Enviar Respuesta").click().wait(500);
//     cy.get(".swal2-confirm").click();
//     cy.get("button").contains("Forzar Completado").click().wait(500);
//     cy.get(".swal2-confirm").click();
//   });
});
