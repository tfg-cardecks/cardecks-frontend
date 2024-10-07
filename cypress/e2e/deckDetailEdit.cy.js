/// <reference types="cypress" />

// local imports
import {
  clickToNavElement,
  typeAndAssert,
  goToHomePage,
  generateRandomUser,
  getCorrectInputDateWithSpecificDate,
  getTemaLabel,
  clearDate,
} from "./utils";

beforeEach(() => {
  goToHomePage();
});

// describe("testing the edit deck functionality", () => {
//   it("should edit a deck successfully", () => {
//     cy.get("header")
//       .find("nav")
//       .next()
//       .find("a")
//       .contains("Registrarse")
//       .click()
//       .wait(1500);

//     generateRandomUser().then(({ email, name, lastName, username }) => {
//       typeAndAssert("input[name='name']", name);
//       typeAndAssert("input[name='lastName']", lastName);
//       typeAndAssert("input[name='username']", username);
//       typeAndAssert("input[name='password']", "@Password1");
//       typeAndAssert("input[name='password2']", "@Password1");
//       typeAndAssert("input[name='email']", email);
//       cy.get('select[name="role"]').select("authenticated");
//       cy.get("button").contains("Registrar").click().wait(1500);

//       cy.wait(2000);

//       typeAndAssert("input[name='emailOrUsername']", username);
//       typeAndAssert("input[name='password']", "@Password1");
//       cy.get("button").contains("Iniciar sesión").click().wait(2000);

//       clickToNavElement("Cartas");
//       cy.get("a").contains("Crear Carta").click().wait(1500);

//       typeAndAssert("input[name='title']", "Carta de prueba1342");
//       typeAndAssert("input[name='theme']", "Tema de prueba1342");
//       cy.get("select#cardType").select("Texto e Imagen").wait(1500);

//       cy.get("button").contains("Crear Carta").click().wait(2000);

//       cy.get("button").contains("Añadir Texto").click().wait(1500);

//       cy.get("select").select("Trasera").wait(1500);

//       typeAndAssert(
//         "input[type='text']",
//         "https://img.freepik.com/vector-gratis/perro-lindo-alegre-sobre-fondo-blanco_1308-132745.jpg"
//       );

//       cy.get("button").contains("Cargar Imagen").click().wait(2000);

//       cy.get("button").contains("Crear Carta").click().wait(2000);

//       clickToNavElement("Mazos");
//       cy.get("a").contains("Crear Mazo").click().wait(2000);

//       typeAndAssert("input[name='name']", "Test Deck1234");
//       typeAndAssert("input[name='description']", "This is a test deck.");
//       typeAndAssert("input[name='theme']", "Test Theme");

//       // Aplicar filtro de título
//       cy.get('input[type="text"]').eq(0).type("Carta de prueba1342");
//       cy.get("button").contains("Limpiar").eq(0).click().wait(500);

//       // Aplicar filtro de tema
//       getTemaLabel().children().type("Tema de prueba");
//       getTemaLabel()
//         .parent()
//         .find("button")
//         .contains("Limpiar")
//         .click()
//         .wait(500);

//       getCorrectInputDateWithSpecificDate(0, "2023-01-01");
//       clearDate("Fecha de Inicio:");

//       getCorrectInputDateWithSpecificDate(1, "2023-12-31");
//       clearDate("Fecha de Fin:");

//       cy.get("button").contains("Crear Mazo").click().wait(2000);

//       cy.get("button").contains("Actualizar").click();
//       cy.get('input[type="checkbox"].form-checkbox').first().check();
//       cy.get("button").contains("Actualizar").click();
//       cy.get('a.border.p-4.rounded-lg.shadow-lg.hover').first().click();
//       cy.get("button").contains("Eliminar").click().wait(2000);

//       clickToNavElement("Cartas");
//       cy.get("a").contains("Mis Mazos").click().wait(2000);
//       cy.get('h2.text-xl.font-bold.mb-2').contains('Test Deck').first().click();
//       cy.get("button").contains("Eliminar").click().wait(2000);


//     });
//   });
// });

// describe("testing the edit card functionality error", () => {
//   it("should edit a card error", () => {
//     cy.get("header")
//       .find("nav")
//       .next()
//       .find("a")
//       .contains("Registrarse")
//       .click()
//       .wait(1500);

//     generateRandomUser().then(({ email, name, lastName, username }) => {
//       typeAndAssert("input[name='name']", name);
//       typeAndAssert("input[name='lastName']", lastName);
//       typeAndAssert("input[name='username']", username);
//       typeAndAssert("input[name='password']", "@Password1");
//       typeAndAssert("input[name='password2']", "@Password1");
//       typeAndAssert("input[name='email']", email);
//       cy.get('select[name="role"]').select("authenticated");
//       cy.get("button").contains("Registrar").click().wait(1500);

//       cy.wait(2000);

//       typeAndAssert("input[name='emailOrUsername']", username);
//       typeAndAssert("input[name='password']", "@Password1");
//       cy.get("button").contains("Iniciar sesión").click().wait(2000);

//       clickToNavElement("Cartas");
//       cy.get("a").contains("Crear Carta").click().wait(1500);

//       typeAndAssert("input[name='title']", "Carta de prueba12");
//       typeAndAssert("input[name='theme']", "Tema de prueba12");
//       cy.get("select#cardType").select("Texto e Imagen").wait(1500);

//       cy.get("button").contains("Crear Carta").click().wait(2000);

//       cy.get("button").contains("Añadir Texto").click().wait(1500);
//       cy.get("select").select("Trasera").wait(1500);
//       typeAndAssert(
//         "input[type='text']",
//         "https://img.freepik.com/vector-gratis/perro-lindo-alegre-sobre-fondo-blanco_1308-132745.jpg"
//       );
//       cy.get("button").contains("Cargar Imagen").click().wait(2000);
//       cy.get("button").contains("Crear Carta").click().wait(2000);

//       // Hacer clic en el botón de exportar carta
//       cy.get("button").contains("Actualizar").click();

//       cy.get("select").select("Trasera").wait(1500);

//       cy.get("button").contains("Cargar Imagen").click().wait(2000);

//       cy.get("button").contains("Eliminar Imagen").click().wait(2000);

//       cy.get("button").contains("Actualizar Carta").click().wait(2000);
//       cy.get("pre.text-red-500.whitespace-pre-wrap.mb-4").should(
//         "contain",
//         "Para el tipo 'Texto e Imagen', el reverso debe tener una imagen."
//       );
//       cy.get("button").contains("Cancelar").click().wait(2000);

//       cy.get("button").contains("Eliminar").click().wait(2000);
//     });
//   });
// });
