import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import LoginPage from "../pages/LoginPage";
import ProductDetailPage from "../pages/ProductDetailPage";
import CheckoutPage from "../pages/CheckoutPage";
import 'cypress-mochawesome-reporter/cucumberSupport';


// ── Background ──

Given("el usuario inicia sesión con credenciales del fixture", () => {
  LoginPage.visit();
  LoginPage.login();
});

// ── Acciones (When) ──

When("el usuario hace click en comprar ahora", () => {
  ProductDetailPage.clickBuyNow();
});

When("el usuario confirma la compra", () => {
  CheckoutPage.clickBuyNow();
});

When("el usuario rellena los datos de pago con el fixture", () => {
  cy.fixture("card").then((cardData) => {
    cy.get("#email").clear().type(cardData.email);
    cy.get('[name="cardNumber"]').type(cardData.card_number);
    cy.get('[name="cardExpiry"]').type(cardData.card_date);
    cy.get('[name="cardCvc"]').type(cardData.cvc_number);
    cy.get("#billingName").clear().type(cardData.Cardholder_name);
  });
});

When("el usuario hace click en pagar", () => {
  cy.get(".SubmitButton").click();
});

When("el usuario hace click en ir a mis pedidos", () => {
  cy.contains("a", "Ir a mis pedidos").click();
});

// ── Verificaciones (Then) ──

Then(
  "la página de Stripe muestra el producto {string}",
  (productName) => {
    // Ignorar errores internos de Stripe
    Cypress.on("uncaught:exception", (err) => {
      if (
        err.message.includes("expressCheckout Element didn't mount normally") ||
        err.message.includes("Cannot read properties of null (reading 'postMessage')")
      ) {
        return false;
      }
    });

    cy.get('[data-testid="product-summary-name"]', { timeout: 30000 }).should(
      "contain",
      productName
    );
  }
);

Then("la página de Stripe muestra el total {string}", (total) => {
  cy.get('[data-testid="product-summary-total-amount"]').should(
    "contain",
    total
  );
});

Then("el último pedido contiene {string}", (text) => {
  cy.contains(text).should("be.visible");
});
