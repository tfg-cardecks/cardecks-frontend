/// <reference types="cypress" />

// local imports
import {
  clickToNavElement,
  typeAndAssert,
  goToHomePage,
  generateRandomUser,
} from "./utils";

beforeEach(() => {
  goToHomePage();
});

describe("testing the navigation bar", () => {
  it("clicking the nav elements with login to the page", () => {
    cy.get("header")
      .find("nav")
      .next() //xq el boton de registro esta en el siguiente div del nav
      .find("a")
      .contains("Registrarse")
      .click()
      .wait(1500);

    generateRandomUser().then(({ email, name, lastName, username }) => {
      typeAndAssert("input[name='name']", name);
      typeAndAssert("input[name='lastName']", lastName);
      typeAndAssert("input[name='username']", username);
      typeAndAssert("input[name='password']", "@Password1");
      typeAndAssert("input[name='password2']", "@Password1");
      typeAndAssert("input[name='email']", email);
      cy.get('select[name="role"]').select("authenticated");
      cy.get("button").contains("Registrar").click().wait(1500);

      cy.wait(2000);

      // now we need to login to the app with the credentials
      typeAndAssert("input[name='emailOrUsername']", username);
      typeAndAssert("input[name='password']", "@Password1");
      cy.get("button").contains("Iniciar sesión").click().wait(2000);

      // now click to the nav elements
      clickToNavElement("Cartas");
      clickToNavElement("Mazos");
      clickToNavElement("Juegos");

      // now navigate to the home page
      goToHomePage();

      // now wait for 2 seconds for the user to see the home page
      cy.wait(2000);

      // now logout the user
      cy.get("header")
        .find("nav")
        .next()
        .find("button")
        .contains("Cerrar sesión")
        .click()
        .wait(1500);
    });
  });
});
