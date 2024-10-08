/// <reference types="cypress" />

// local imports
import {
  clickToNavElement,
  typeAndAssert,
  goToHomePage,
  generateRandomUser,
  typeAndAssertIndex,
  generateRandomTextCard,
} from "./utils";

beforeEach(() => {
  goToHomePage();
});

describe("testing the edit card functionality", () => {
  it("should edit a card successfully", () => {
    cy.get("header")
      .find("nav")
      .next()
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

      typeAndAssert("input[name='emailOrUsername']", username);
      typeAndAssert("input[name='password']", "@Password1");
      cy.get("button").contains("Iniciar sesión").click().wait(2000);

      clickToNavElement("Cartas");
      cy.get("a").contains("Crear Carta").click().wait(1500);

      typeAndAssert("input[name='title']", generateRandomTextCard());
      typeAndAssert("input[name='theme']", "Tema de prueba123");
      cy.get("select#cardType").select("Texto e Imagen").wait(1500);

      cy.get("button").contains("Crear Carta").click().wait(2000);

      cy.get("button").contains("Añadir Texto").click().wait(1500);

      cy.get("select").select("Trasera").wait(1500);

      typeAndAssert(
        "input[type='text']",
        "https://img.freepik.com/vector-gratis/perro-lindo-alegre-sobre-fondo-blanco_1308-132745.jpg"
      );

      cy.get("button").contains("Cargar Imagen").click().wait(2000);

      cy.get("button").contains("Crear Carta").click().wait(2000);

      // Hacer clic en el botón de exportar carta
      cy.get("button").contains("Actualizar").click();

      cy.get("select").select("Trasera").wait(1500);

      cy.get("button").contains("Cargar Imagen").click().wait(2000);

      cy.get("button").contains("Eliminar Imagen").click().wait(2000);

      cy.get("button").contains("Cargar Imagen").click().wait(2000);

      cy.get('input[type="text"].border.p-2.rounded.w-full').each(
        ($el, index) => {
          if (index === 1) {
            cy.wrap($el)
              .clear()
              .type(
                "https://phantom-marca.unidadeditorial.es/586f2e36f52c4c2a07e227ff2b1fd2d0/resize/828/f/jpg/assets/multimedia/imagenes/2024/06/15/17184344902671.jpg"
              );
          }
        }
      );

      cy.get("button").contains("Actualizar Carta").click().wait(2000);

      cy.get("button").contains("Eliminar").click().wait(2000);
    });
  });
});

describe("testing the edit card functionality with errors", () => {
  it("should show an error when trying to update a card without an image", () => {
    cy.get("header")
      .find("nav")
      .next()
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

      typeAndAssert("input[name='emailOrUsername']", username);
      typeAndAssert("input[name='password']", "@Password1");
      cy.get("button").contains("Iniciar sesión").click().wait(2000);

      clickToNavElement("Cartas");
      cy.get("a").contains("Crear Carta").click().wait(1500);

      typeAndAssert("input[name='title']", generateRandomTextCard());
      typeAndAssert("input[name='theme']", "Tema de prueba12");
      cy.get("select#cardType").select("Texto e Imagen").wait(1500);

      cy.get("button").contains("Crear Carta").click().wait(2000);

      cy.get("button").contains("Añadir Texto").click().wait(1500);
      cy.get("select").select("Trasera").wait(1500);
      typeAndAssert(
        "input[type='text']",
        "https://img.freepik.com/vector-gratis/perro-lindo-alegre-sobre-fondo-blanco_1308-132745.jpg"
      );
      cy.get("button").contains("Cargar Imagen").click().wait(2000);
      cy.get("button").contains("Crear Carta").click().wait(2000);

      cy.get("button").contains("Actualizar").click();

      cy.get("select").select("Trasera").wait(1500);

      cy.get("button").contains("Cargar Imagen").click().wait(2000);

      cy.get("button").contains("Eliminar Imagen").click().wait(2000);

      cy.get("button").contains("Actualizar Carta").click().wait(2000);
      cy.get("pre.text-red-500.whitespace-pre-wrap.mb-4").should(
        "contain",
        "Para el tipo 'Texto e Imagen', el reverso debe tener una imagen."
      );
      cy.get("button").contains("Cancelar").click().wait(2000);

      cy.get("button").contains("Eliminar").click().wait(2000);
    });
  });

  it("should show an error when trying to update a card with an empty image URL", () => {
    cy.get("header")
      .find("nav")
      .next()
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

      typeAndAssert("input[name='emailOrUsername']", username);
      typeAndAssert("input[name='password']", "@Password1");
      cy.get("button").contains("Iniciar sesión").click().wait(2000);

      clickToNavElement("Cartas");
      cy.get("a").contains("Crear Carta").click().wait(1500);

      typeAndAssert("input[name='title']", generateRandomTextCard());
      typeAndAssert("input[name='theme']", "Tema de prueba12");
      cy.get("select#cardType").select("Texto e Imagen").wait(1500);

      cy.get("button").contains("Crear Carta").click().wait(2000);

      cy.get("button").contains("Añadir Texto").click().wait(1500);
      cy.get("select").select("Trasera").wait(1500);

      typeAndAssert(
        "input[type='text']",
        "https://img.freepik.com/vector-gratis/perro-lindo-alegre-sobre-fondo-blanco_1308-132745.jpg"
      );
      cy.get("button").contains("Cargar Imagen").click().wait(2000);
      cy.get("button").contains("Crear Carta").click().wait(2000);

      cy.get("button").contains("Actualizar").click();

      cy.get("select").select("Trasera").wait(1500);

      cy.get("button").contains("Cargar Imagen").click().wait(2000);

      cy.get('input[type="text"].border.p-2.rounded.w-full').eq(1).clear();
      cy.get("button").contains("Cargar Imagen").click().wait(2000);

      cy.get("pre.text-red-500.whitespace-pre-wrap").should(
        "contain",
        "Por favor, introduce una URL de imagen."
      );
      cy.get("button").contains("Cancelar").click().wait(2000);

      cy.get("button").contains("Eliminar").click().wait(2000);

      cy.get("header")
        .find("nav")
        .next()
        .find("button")
        .contains("Cerrar sesión")
        .click()
        .wait(1500);
    });
  });

  it("should show an error when trying to update a card with an invalid image URL", () => {
    cy.get("header")
      .find("nav")
      .next()
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

      typeAndAssert("input[name='emailOrUsername']", username);
      typeAndAssert("input[name='password']", "@Password1");
      cy.get("button").contains("Iniciar sesión").click().wait(2000);

      clickToNavElement("Cartas");
      cy.get("a").contains("Crear Carta").click().wait(1500);

      typeAndAssert("input[name='title']", generateRandomTextCard());
      typeAndAssert("input[name='theme']", "Tema de prueba12");
      cy.get("select#cardType").select("Texto e Imagen").wait(1500);

      cy.get("button").contains("Crear Carta").click().wait(2000);

      cy.get("button").contains("Añadir Texto").click().wait(1500);
      cy.get("select").select("Trasera").wait(1500);

      typeAndAssert(
        "input[type='text']",
        "https://img.freepik.com/vector-gratis/perro-lindo-alegre-sobre-fondo-blanco_1308-132745.jpg"
      );
      cy.get("button").contains("Cargar Imagen").click().wait(2000);
      cy.get("button").contains("Crear Carta").click().wait(2000);

      // Hacer clic en el botón de exportar carta
      cy.get("button").contains("Actualizar").click();

      cy.get("select").select("Trasera").wait(1500);

      cy.get('input[type="text"].border.p-2.rounded.w-full').eq(1).clear();

      typeAndAssertIndex(
        "input[type='text'].border.p-2.rounded.w-full",
        "https://www.euro-soccer-cards.com/134490/daniel-carvajal-line-up-spain-337-world-class-2024.g",
        1
      );
      cy.get("button").contains("Cargar Imagen").click().wait(2000);

      cy.get("pre.text-red-500.whitespace-pre-wrap").should(
        "contain",
        "URL de imagen no válida. Por favor, introduce una URL que termine en .jpeg, .jpg, .gif, o .png."
      );
      cy.get("button").contains("Cancelar").click().wait(2000);

      cy.get("button").contains("Eliminar").click().wait(2000);

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
