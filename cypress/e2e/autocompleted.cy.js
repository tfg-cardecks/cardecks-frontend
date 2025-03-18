/// <reference types="cypress" />

// local imports
import {
  clickToNavElement,
  typeAndAssert,
  goToHomePage,
  generateRandomUser,
  generateRandomTextCard,
} from "./utils";

beforeEach(() => {
  goToHomePage();
});

describe("testing the autocomplete theme suggestions card and deck funcionality", () => {
  it("should click an autocomplete a card theme suggestion", () => {
    cy.get("header")
      .find("nav")
      .next()
      .find("a")
      .contains("Registrarse")
      .click()
      .wait(1500);

    generateRandomUser().then(({ email, username }) => {
      typeAndAssert("input[name='username']", username);
      typeAndAssert("input[name='password']", "@Password1");
      typeAndAssert("input[name='password2']", "@Password1");
      typeAndAssert("input[name='email']", email);
      cy.get("input[id='terms']").check();
      cy.get("input[id='priv']").check();
      cy.get("button").contains("Registrar").click().wait(1500);

      cy.wait(2000);

      typeAndAssert("input[name='emailOrUsername']", username);
      typeAndAssert("input[name='password']", "@Password1");
      cy.get("button").contains("Iniciar").click().wait(2000);
      cy.get("button").contains("Si").click().wait(2000);

      clickToNavElement("Cartas");
      cy.get("a").contains("Crear Carta").click().wait(1500);

      typeAndAssert("input[name='title']", generateRandomTextCard());
      typeAndAssert("input[name='theme']", "Tem");
      cy.get("ul").children().eq(0).click();

      cy.get("button").contains("Usuario").click().wait(2000);
      cy.get("a").contains("Detalles").click().wait(1500);
      cy.get("button").contains("Darse de baja").click().wait(2000);

      cy.get(".swal2-confirm").click();
    });
  });

  it("should click an autocomplete a deck theme suggestion", () => {
    cy.get("header")
      .find("nav")
      .next()
      .find("a")
      .contains("Registrarse")
      .click()
      .wait(1500);

    generateRandomUser().then(({ email, username }) => {
      typeAndAssert("input[name='username']", username);
      typeAndAssert("input[name='password']", "@Password1");
      typeAndAssert("input[name='password2']", "@Password1");
      typeAndAssert("input[name='email']", email);
      cy.get("input[id='terms']").check();
      cy.get("input[id='priv']").check();
      cy.get("button").contains("Registrar").click().wait(2000);

      cy.wait(2000);

      typeAndAssert("input[name='emailOrUsername']", username);
      typeAndAssert("input[name='password']", "@Password1");
      cy.get("button").contains("Iniciar").click().wait(2000);
      cy.get("button").contains("Si").click().wait(2000);

      clickToNavElement("Mazos");
      cy.get("a").contains("Crear Mazo").click().wait(2000);

      typeAndAssert("input[name='name']", "Test Deck");
      typeAndAssert("input[name='description']", "This is a test deck.");
      typeAndAssert("input[name='theme']", "Ani");
      cy.get("ul").children().eq(0).click();
      cy.get("button").contains("Usuario").click().wait(2000);
      cy.get("a").contains("Detalles").click().wait(1500);
      cy.get("button").contains("Darse de baja").click().wait(2000);
      cy.get(".swal2-confirm").click();
    });
  });
});
