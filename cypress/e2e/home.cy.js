/// <reference types="cypress" />

// local imports
import {
  clickToNavElement,
  clickToTextSwalButton,
  goToHomePage,
} from "./utils";

beforeEach(() => {
  goToHomePage();
});

describe("rendering the home page", () => {
  it("displaying the home page without login to the app", () => {
    cy.get("h2").should("not.contain", "Bienvenido");
  });
});

describe("testing the navigation bar", () => {
  it("clicking the nav elements without login to the page", () => {
    // clicking "Cancelar" swal button
    clickToNavElement("Cartas");
    clickToTextSwalButton("Cancelar");
    clickToNavElement("Mazos");
    clickToTextSwalButton("Cancelar");
    clickToNavElement("Juegos");
    clickToTextSwalButton("Cancelar");

    // now clicking "Registrarse"
    clickToNavElement("Cartas");
    clickToTextSwalButton("Registrarse");
    goToHomePage();
    clickToNavElement("Mazos");
    clickToTextSwalButton("Registrarse");
    goToHomePage();
    clickToNavElement("Juegos");
    clickToTextSwalButton("Registrarse");
  });
});
