import { Then } from "@badeball/cypress-cucumber-preprocessor";
import 'cypress-mochawesome-reporter/cucumberSupport';

// ── Steps compartidos entre múltiples features ──

Then("aparece el toast {string}", (message) => {
  cy.get("app-toast").should("contain", message);
});

Then("el toast desaparece", () => {
  cy.get("app-toast").should("not.be.visible");
});

Then("la URL contiene {string}", (path) => {
  cy.url({ timeout: 30000 }).should("include", path);
});
