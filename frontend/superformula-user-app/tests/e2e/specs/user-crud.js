import { v4 as uuidv4 } from 'uuid';

describe("User CRUD", () => {
  const uniqueId = uuidv4();

  it("Visits initial page", () => {
    cy.visit("/");
    cy.contains("h1", "Users List");
  });

  it("Creates new user", () => {
    cy.get(".users-title button").click();
    cy.get(".user-form-data input[name='name']").type("Mr. Cypress Bot"+uniqueId);
    cy.get(".user-form-data input[name='address']").type("Googleplex");
    cy.get(".user-form-data input[name='description']").type("Addicted to testing");
    cy.get(".user-form-save").click();
    cy.contains(".user-name", "Mr. Cypress Bot"+uniqueId);
  });

  it("Updates existing user", () => {
    cy.contains(".user-name", "Mr. Cypress Bot"+uniqueId).parents(".user-card").children(".pencil").click({ force: true })
    cy.get(".user-form-data input[name='name']").clear().type("Mr. Cypress Bot Reloaded"+uniqueId);
    cy.get(".user-form-save").click();
    cy.contains(".toast-text", "Mr. Cypress Bot Reloaded"+uniqueId+" updated");
    cy.contains(".user-name", "Mr. Cypress Bot Reloaded"+uniqueId);
  });

  it("Deletes existing user", () => {
    cy.contains(".user-name", "Mr. Cypress Bot Reloaded"+uniqueId).parents(".user-card").children(".pencil").click({ force: true })
    cy.get(".user-form-left > button.secondary-button").click({ force: true });
    cy.get(".user-name").should("not.contain", "Mr. Cypress Bot Reloaded"+uniqueId);
  });
})
