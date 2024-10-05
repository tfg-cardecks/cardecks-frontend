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
