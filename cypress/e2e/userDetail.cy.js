/// <reference types="cypress" />

// local imports
import { typeAndAssert, goToHomePage, generateRandomUser } from "./utils";

beforeEach(() => {
  goToHomePage();
});

describe("testing the user details", () => {
  it("should access to the user details successfully", () => {
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

      cy.get("button").contains("Usuario").click().wait(2000);
      cy.get("a").contains("Detalles").click().wait(1500);

      cy.get("button").contains("Editar Detalles").click().wait(2000);

      cy.get("input[name='username']").clear().type("newUsername");
      cy.get("input[name='email']").clear().type(email);

      cy.get("button").contains("Guardar Cambios").click().wait(2000);
      cy.get(".swal2-confirm").click().wait(2000);

      cy.get("button").contains("Cambiar Contraseña").click().wait(2000);

      cy.get("input[name='currentPassword']").clear().type("@Password1");
      cy.get("input[name='newPassword']").clear().type("@Password2");

      cy.get("button").contains("Cambiar Contraseña").click().wait(2000);
      cy.get(".swal2-confirm").click().wait(2000);

      cy.get("button").contains("Darse de baja").click().wait(2000);

      cy.get(".swal2-cancel").click();
      cy.get("button").contains("Darse de baja").click().wait(2000);

      cy.get(".swal2-confirm").click();
    });
  });
});
