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

  selectedFileToImportAndSubmit("cypress/e2e/json/nubes.json");
  selectedFileToImportAndSubmit("cypress/e2e/json/cascada.json");
  selectedFileToImportAndSubmit("cypress/e2e/json/hojas.json");
  selectedFileToImportAndSubmit("cypress/e2e/json/lluvia.json");
  selectedFileToImportAndSubmit("cypress/e2e/json/nubosa.json");

  cy.visit("http://localhost:5173/lobby").wait(2000);
  cy.get(".game-type-list")
    .find("img[alt='Adivina la Imagen']")
    .click()
    .wait(2000);

  cy.get(".container").children().next().find("h2").eq(0).click().wait(500);

  startGame();
  cy.get(".swal2-confirm").click();

  cy.wait(2000);
}

beforeEach(() => {
  setupToPlayGames();
});

describe("testing guessTheImageGame", () => {
  // it("can`t play guessTheImageGame (not enought cards)", () => {
  //   clickToNavElement("Mazos");
  //   cy.get("a").contains("Crear Mazo").click().wait(2000);

  //   typeAndAssert("input[name='name']", generateRandomText());
  //   typeAndAssert("input[name='description']", generateRandomText());
  //   typeAndAssert("input[name='theme']", generateRandomText());
  //   cy.get("button").contains("Crear Mazo").click().wait(2000);

  //   cy.get("h2")
  //     .contains("Cartas")
  //     .next()
  //     .find('input[type="file"]')
  //     .selectFile("cypress/e2e/json/cascada.json");
  //   cy.get("button").contains("Importar Carta a Mazo").click().wait(2000);

  //   cy.visit("http://localhost:5173/lobby").wait(2000);
  //   cy.get(".game-type-list")
  //     .find("img[alt='Adivina la Imagen']")
  //     .click()
  //     .wait(2000);

  //   cy.get(".container").children().next().find("h2").eq(0).click().wait(500);

  //   startGame();
  // });

  describe("testing guessTheImageGame", () => {
    it("can play guessTheImageGame and show error alert", () => {
      // Interceptar la solicitud para crear el juego y obtener el ID del juego
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
      cy.get(".game-type-list")
        .find("img[alt='Adivina la Imagen']")
        .click()
        .wait(2000);
      cy.intercept("POST", "/api/guessTheImageGames").as("createGame");

      cy.get(".container").children().next().find("h2").eq(0).click().wait(500);

      startGame();
      cy.get(".swal2-confirm").click();

      cy.wait(2000);
      cy.wait("@createGame", { timeout: 10000 }).then((interception) => {
        // Registrar la respuesta completa para depuración
        cy.log("Interception:", JSON.stringify(interception.response.body));
        const guessTheImageGameId =
          interception.response.body.guessTheImageGameId;
        cy.wrap(guessTheImageGameId).as("guessTheImageGameId");
      });

      // Interceptar la solicitud para obtener los datos del juego usando el ID del juego
      cy.get("@guessTheImageGameId").then((guessTheImageGameId) => {
        cy.log(
          "Interception responseNew:",
          JSON.stringify(guessTheImageGameId)
        );
        cy.intercept("GET", `/api/guessTheImageGame/${guessTheImageGameId}`).as(
          "getGameData"
        );
     
        cy.log("Interception responseNew123:", guessTheImageGameId);
        // Esperar a que se realice la solicitud y capturar la respuesta correcta
        cy.wait("@getGameData").then((interception) => {
          cy.log(
            "Interception responseNew1234:",
            JSON.stringify(interception.response.body)
          );

          const correctAnswer = interception.response.body.correctAnswer; // Ajusta esto a la estructura real de la respuesta
          cy.wrap(correctAnswer).as("correctAnswer");
        });

        cy.get(".options-container").should("be.visible");







        
        // Obtener la respuesta correcta y seleccionar una opción incorrecta
        cy.get("@correctAnswer").then((correctAnswer) => {
          cy.get(".option-button").each(($button) => {
            const optionText = $button.text().trim();
            if (optionText !== correctAnswer) {
              cy.wrap($button).click();
              return false; // Rompe el bucle each después de seleccionar una opción incorrecta
            }
          });
        });

        console.log("Respuesta incorrecta seleccionada");
        // Enviar la respuesta
        cy.get("button").contains("Enviar Respuesta").click().wait(500);

        // Verificar que se muestra el mensaje de error
        cy.get(".swal2-popup").should("be.visible").contains("¡Incorrecto!");
      });
    });

    // cy.get(".options-container").should("be.visible");

    // // Obtener la respuesta correcta
    // cy.get(".options-container").then(($container) => {
    //   const correctAnswer = $container.data("correct-answer"); // Suponiendo que la respuesta correcta está almacenada en un atributo de datos
    //   console.log("Respuesta correcta:", correctAnswer);

    //   // Seleccionar una opción incorrecta
    //   cy.get(".option-button").each(($button) => {
    //     const optionText = $button.text().trim();
    //     if (optionText !== correctAnswer) {
    //       cy.wrap($button).click();
    //       return false; // Rompe el bucle each después de seleccionar una opción incorrecta
    //     }
    //   });
    // });
    // console.log("Respuesta incorrecta seleccionada");
    // // Enviar la respuesta
    // cy.get("button").contains("Enviar Respuesta").click().wait(500);

    // // Verificar que se muestra el mensaje de error
    // cy.get(".swal2-popup").should("be.visible").contains("¡Incorrecto!");

    // cy.get(".swal2-confirm").click();

    // cy.get("button").contains("Siguiente").click().wait(1000);
    // cy.get("button")
    //   .contains("Volver al Catálogo de Juegos")
    //   .click()
    //   .wait(1000);

    // cy.get(".game-type-list")
    //   .find("img[alt='Juego del Ahorcado']")
    //   .click()
    //   .wait(2000);

    // cy.get(".container").children().next().find("h2").eq(0).click().wait(500);

    // startGame();

    // cy.get(".container")
    //   .children()
    //   .next()
    //   .next()
    //   .next()
    //   .find("button")
    //   .contains("Continuar Juego en Progreso")
    //   .click()
    //   .wait(500);

    // cy.get("button").contains("Forzar Completado").click().wait(1000);
  });

  // it("can play hangmanGame (show Juego completado alert)", () => {
  //   playGame();
  //   cy.get('.options-container').should('be.visible');

  //   // Obtener la respuesta correcta
  //   cy.get('.options-container').then(($container) => {
  //     const correctAnswer = $container.data('correct-answer'); // Suponiendo que la respuesta correcta está almacenada en un atributo de datos
  //     console.log('Respuesta correcta:', correctAnswer);

  //     // Seleccionar la opción correcta
  //     cy.get('.option-button').each(($button) => {
  //       const optionText = $button.text().trim();
  //       if (optionText === correctAnswer) {
  //         cy.wrap($button).click().wait(2000);;
  //         return false; // Rompe el bucle each después de seleccionar la opción correcta
  //       }
  //     });
  //   });
  //   console.log("Respuesta correcta seleccionada");
  //   // Enviar la respuesta
  //   cy.get("button").contains("Enviar Respuesta").click().wait(500);

  //   // Verificar que se muestra el mensaje de éxito
  //   cy.get(".swal2-popup").should('be.visible').contains('¡Correcto!');
  //   // let i;
  //   // for (i = 0; i <= 25; i++) {
  //   //   cy.log("Intento: " + i);
  //   //   guessWord();
  //   // }

  //   // if (i === 26) {
  //   //   cy.get(".swal2-confirm").click();
  //   // }
  // });

  // it("can go to information hangmanGame", () => {
  //   cy.visit("http://localhost:5173/lobby").wait(2000);
  //   cy.get(".game-type-list")
  //     .find("img[alt='Juego del Ahorcado']")
  //     .click()
  //     .wait(2000);

  //   cy.get(".container").children().next().find("h2").eq(0).click().wait(500);

  //   cy.contains("button", "Información").click().wait(2000);

  //   cy.contains("button", "Ocultar Información").click().wait(2000);
  // });
});
