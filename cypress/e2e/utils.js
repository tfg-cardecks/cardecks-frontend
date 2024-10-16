/// <reference types="cypress" />

export function goToHomePage() {
  cy.visit("http://localhost:5173/");
}

export function clickToNavElement(text) {
  cy.get("header").find("nav").find("button").contains(text).click().wait(2000);
}

export function clickToTextSwalButton(text) {
  cy.get("button").contains(text).click();
}

export function typeAndAssert(selector, value) {
  cy.get(selector).type(value).should("have.value", value);
}

export function typeAndAssertIndex(selector, value, index = 0) {
  cy.get(selector).eq(index).clear().type(value).should("have.value", value);
}

export function applyTypeFilter(type) {
  cy.get('label:contains("Tipo de Carta:")').find('select').select(type);
}

export function clearTypeFilter() {
  cy.get('label:contains("Tipo de Carta:")').parent().find('button').contains("Limpiar").click().wait(500);
}

export function applySortOption(sortOption) {
  cy.get('label:contains("Ordenar por:")').find('select').select(sortOption);
}

export function applyAlphabetFilter(letter) {
  cy.get('button').contains(letter).click();
}

export function clearAlphabetFilter() {
  cy.get('button').contains("Limpiar").click().wait(500);
}

export function generateRandomUser() {
  return cy.request("https://randomuser.me/api/").then((response) => {
    const user = response.body.results[0];
    const email = user.email.replace("example", "gmail");
    const name = user.name.first;
    const lastName = user.name.last;
    const username = user.login.username;
    return { email, name, lastName, username };
  });
}

export function getTemaLabel() {
  return cy.get("form").next().find("label").contains("Tema");
}

export function getCorrectInputDateWithSpecificDate(position, date) {
  cy.get('input[type="date"]').eq(position).type(date);
}

export function clearDate(label) {
  cy.get("form").next().find("label").contains(label).next().click();
}

export function setupToPlayGames() {
  cy.visit("http://localhost:5173/");
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
    cy.get("button").contains("Registrar").click().wait(2000);

    cy.wait(2000);

    typeAndAssert("input[name='emailOrUsername']", username);
    typeAndAssert("input[name='password']", "@Password1");
    cy.get("button").contains("Iniciar sesión").click().wait(2000);
  });
}

export function generateRandomText() {
  return `Test Deck ${Math.floor(Math.random() * 1000)}`;
}

export function generateRandomTextCard() {
  return `Test Card3 ${Math.floor(Math.random() * 1000)}`;
}

export function selectedFileToImportAndSubmit(path) {
  cy.get("h2")
    .contains("Cartas")
    .next()
    .find('input[type="file"]')
    .selectFile(path);
  cy.get("button").contains("Importar Carta a Mazo").click().wait(2000);
}

export function getGrid() {
  return cy.get(".grid div").then((cells) => {
    const grid = [];
    for (let i = 0; i < 10; i++) {
      const row = [];
      for (let j = 0; j < 10; j++) {
        row.push(cells[i * 10 + j].innerText.trim().toLowerCase());
      }
      grid.push(row);
    }
    return JSON.stringify(grid); // Devolver la matriz como una cadena JSON
  });
}

export function selectWord(solution) {
  solution.forEach(({ firstLetter, lastLetter }) => {
    const positions = getPositionsBetween(firstLetter, lastLetter);
    positions.forEach((pos) => {
      cy.get(`.grid div:eq(${pos[0] * 10 + pos[1]})`).click();
    });
  });
}

function getPositionsBetween(start, end) {
  const positions = [];
  const [startRow, startCol] = start;
  const [endRow, endCol] = end;

  const rowStep = startRow < endRow ? 1 : startRow > endRow ? -1 : 0;
  const colStep = startCol < endCol ? 1 : startCol > endCol ? -1 : 0;

  let row = startRow;
  let col = startCol;

  while (row !== endRow || col !== endCol) {
    positions.push([row, col]);
    row += rowStep;
    col += colStep;
  }
  positions.push([endRow, endCol]);

  return positions;
}

export function applyTitleFilter(title) {
  cy.get('input[type="text"]').eq(0).type(title);
}

export function clearTitleFilter() {
  cy.get("button").contains("Limpiar").eq(0).click().wait(500);
}

export function applyThemeFilter(theme) {
  cy.get('label:contains("Tema:")').find('input[type="text"]').type(theme);
}

export function clearThemeFilter() {
  cy.get('label:contains("Tema:")').parent().find('button').contains("Limpiar").click().wait(500);
}

export function applyStartDateFilter(date) {
  cy.get('label:contains("Fecha de Inicio:")').find('input[type="date"]').type(date);
}

export function clearStartDateFilter() {
  cy.get('label:contains("Fecha de Inicio:")').parent().find('button').contains("Limpiar").click().wait(500);
}

export function applyEndDateFilter(date) {
  cy.get('label:contains("Fecha de Fin:")').find('input[type="date"]').type(date);
}

export function clearEndDateFilter() {
  cy.get('label:contains("Fecha de Fin:")').parent().find('button').contains("Limpiar").click().wait(500);
}