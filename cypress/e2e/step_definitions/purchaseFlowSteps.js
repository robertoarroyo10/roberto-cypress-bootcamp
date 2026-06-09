import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import LoginPage from "../pages/LoginPage";
import HomePage from "../pages/HomePage";
import ProductDetailPage from "../pages/ProductDetailPage";
import 'cypress-mochawesome-reporter/cucumberSupport';

// ── Background ──

Given(
  "el usuario inicia sesión con {string} y {string}",
  (email, password) => {
    LoginPage.visit();
    LoginPage.login(email, password);
  }
);

Given("el toast de login exitoso aparece y desaparece", () => {
  cy.get("app-toast").should("contain", "Inicio de sesión exitoso");
  cy.get("app-toast", { timeout: 20000 }).should("not.be.visible");
});

// ── Acciones (When) ──

When("el usuario busca y selecciona el producto {string}", (productName) => {
  HomePage.navigateToProduct(productName);
});

When("el usuario selecciona la talla {string}", (size) => {
  ProductDetailPage.selectSize(size);
  cy.contains("button", "Añadir a la cesta").should("be.enabled");
});

When("el usuario añade el producto al carrito", () => {
  ProductDetailPage.clickAddToCart();
});

When("el usuario va al carrito", () => {
  ProductDetailPage.getByHref("/cart").click();
});

When("el usuario elimina el primer producto del carrito", () => {
  cy.get('[aria-label="Eliminar producto"]').first().click();
});

When("el usuario elimina todos los productos del carrito", () => {
  ProductDetailPage.removeAllProductsFromCart();
});

When("el usuario aumenta la cantidad del producto", () => {
  cy.get('[aria-label="Aumentar cantidad"]').click();
});

When("el usuario reduce la cantidad del producto", () => {
  cy.get('[aria-label="Reducir cantidad"]').click();
});

// ── Verificaciones (Then) ──

Then("el título del producto es {string}", (name) => {
  cy.get("h1").should("contain", name);
});

Then("el título de la página es {string}", (title) => {
  cy.get("h1").should("contain", title);
});

Then("el producto {string} está en el carrito", (productName) => {
  cy.contains(productName).should("be.visible");
});

Then("el resumen del pedido es visible", () => {
  cy.contains("h2", "Resumen del Pedido").should("be.visible");
});

Then("se muestra {string}", (text) => {
  // cy.contains(text).should("be.visible");
  cy.get('body').should('contain', text);
});

Then("hay {int} botones de eliminar producto", (count) => {
  cy.get('[aria-label="Eliminar producto"]').should("have.length", count);
});

Then("el carrito está vacío", () => {
  cy.contains("h2", "Tu cesta está vacía").should("be.visible");
});

Then("el botón {string} está deshabilitado", (text) => {
  cy.contains("button", text).should("be.disabled");
});

Then("la opción de envío {string} es visible", (option) => {
  cy.contains(option).should("be.visible");
});

Then("el botón {string} está habilitado", (text) => {
  cy.contains("button", text).should("be.enabled");
});

// ── Acciones adicionales (When) ──

When("el usuario selecciona una dirección de envío", () => {
  cy.get('[aria-label*="Seleccionar"]').first().click();
});

When("el usuario selecciona el envío {string}", (shippingOption) => {
  cy.contains("label", shippingOption).find('input[type="radio"]').check({force:true});
});

When("el usuario hace clic en {string}", (buttonText) => {
  cy.contains("button", buttonText).click();
});

When("el usuario llena el formulario de pago con los datos de tarjeta de crédito", () => {
  // Asegura que la redirección a Stripe terminó antes de buscar los campos.
  cy.location("hostname", { timeout: 30000 }).should("eq", "checkout.stripe.com");
  cy.get("iframe", { timeout: 30000 }).should("have.length.at.least", 3);

  // Número de tarjeta (en iframe de Stripe)
  cy.get("iframe")
    .first()
    .then(($iframe) => {
      const $body = $iframe.contents().find("body");
      cy.wrap($body)
        .find('input[placeholder*="number"], input[name*="cardnumber"]')
        .first()
        .type("4242424242424242");
    });

  // Fecha de expiración (en iframe de Stripe)
  cy.get("iframe")
    .eq(1)
    .then(($iframe) => {
      const $body = $iframe.contents().find("body");
      cy.wrap($body)
        .find('input[placeholder*="MM"], input[name*="exp"]')
        .first()
        .type("12/25");
    });

  // CVC (en iframe de Stripe)
  cy.get("iframe")
    .eq(2)
    .then(($iframe) => {
      const $body = $iframe.contents().find("body");
      cy.wrap($body)
        .find('input[placeholder*="CVC"], input[name*="cvc"]')
        .first()
        .type("123");
    });
});
