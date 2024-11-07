// /// <reference types="cypress" />

// // local imports
// import { typeAndAssert, goToHomePage, generateRandomUser } from "./utils";

// beforeEach(() => {
//   goToHomePage();
// });

// describe("sending a password reset email", () => {
//   it("should send a password reset email", () => {
//     cy.get("header")
//       .find("nav")
//       .next()
//       .find("a")
//       .contains("Registrarse")
//       .click()
//       .wait(1500);

//     generateRandomUser().then(({ email, username }) => {
//       typeAndAssert("input[name='username']", username);
//       typeAndAssert("input[name='password']", "@Password1");
//       typeAndAssert("input[name='password2']", "@Password1");
//       typeAndAssert("input[name='email']", email);
//       cy.get("input[id='terms']").check();
//       cy.get("input[id='priv']").check();

//       cy.get("button").contains("Registrar").click().wait(1500);

//       cy.wait(2000);

//       cy.get("a").contains("¿Olvidaste tu contraseña?").click().wait(1500);
//       typeAndAssert("input[name='email']", email);
//       cy.get("button").contains("Enviar correo").click().wait(1500);



//       //adssssssssssssssssssssssssssssssssssssssss
//             // Aquí deberías interceptar el correo electrónico y extraer el token
//       // Esto es un ejemplo de cómo podrías hacerlo si tienes acceso al correo electrónico
//       cy.task('getLastEmail').then((email) => {
//         const resetLink = email.body.match(/http:\/\/localhost:5173\/reset-password\/([a-zA-Z0-9-_\.]+)/)[0];
//         const token = resetLink.split('/').pop();

//         // Ahora puedes usar el token en tus pruebas de restablecimiento de contraseña
//         cy.visit(`/reset-password/${token}`);

//         // Verifica que la URL sea correcta
//         cy.url().should('include', `/reset-password/${token}`);

//         // Ingresa la nueva contraseña y la confirmación
//         cy.get('input[name="newPassword"]').type('NewPassword123!');
//         cy.get('input[name="newPassword2"]').type('NewPassword123!');

//         // Envía el formulario
//         cy.get('button').contains('Restablecer Contraseña').click();

//         // Verifica que el mensaje de éxito se muestre y se confirme
//         cy.get('.swal2-confirm').should('be.visible').click();

//         // Verifica que la navegación a la página de inicio de sesión sea correcta
//         cy.url().should('include', '/login');
//       });
//     });
//   });
// });

// // describe("Reset Password Flow", () => {
// //   it("should show an error if passwords do not match", () => {
// //     const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MmI4MWJkM2ZkMjYzMDhjYmRkZTY0ZCIsImlhdCI6MTczMDkxMjYwMCwiZXhwIjoxNzMwOTEzNTAwfQ.OQlKIxRqVQG6KLFoOVpk8JBwTDmT1Dy8schtQpfwsbM'; // Reemplaza con un token válido para la prueba
// //     cy.visit(`/reset-password/${token}`);

// //     // Ingresa la nueva contraseña y una confirmación diferente
// //     cy.get('input[name="newPassword"]').type('NewPassword123!');
// //     cy.get('input[name="newPassword2"]').type('DifferentPassword123!');

// //     // Envía el formulario
// //     cy.get('button').contains('Restablecer Contraseña').click();

// //     // Verifica que se muestre el mensaje de error
// //     cy.get('.text-red-500').should('contain', 'Las contraseñas no coinciden');
// //   });

// //   it("should show an error if the token is invalid", () => {
// //     const invalidToken = 'invalid-reset-token'; // Reemplaza con un token inválido para la prueba
// //     cy.visit(`/reset-password/${invalidToken}`);

// //     // Ingresa la nueva contraseña y la confirmación
// //     cy.get('input[name="newPassword"]').type('NewPassword123!');
// //     cy.get('input[name="newPassword2"]').type('NewPassword123!');

// //     // Envía el formulario
// //     cy.get('button').contains('Restablecer Contraseña').click();

// //     // Verifica que se muestre el mensaje de error
// //     cy.get('.text-red-500').should('contain', 'Usuario no encontrado');
// //   });
// // });