import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import HomePage from "../pages/HomePage";
import FiltersPage from "../pages/FiltersPage";
import 'cypress-mochawesome-reporter/cucumberSupport';

// ── Background ──

Given("el usuario está en la página principal", () => {
  HomePage.visit();
});

// ── Acciones (When) ──

When("el usuario busca {string}", (term) => {
  HomePage.searchProduct(term);
});

When("el usuario navega a la página {int}", (page) => {
  HomePage.clickPage(page);
});

When("el usuario hace clic en el último producto", () => {
  cy.get('[class*="grid"] > div').last().find("a").first().click();
});

When("el usuario limpia los filtros desde resultados", () => {
  FiltersPage.clearFiltersFromResults();
});

// ── Header (Then) ──

Then("el header contiene el título {string}", (title) => {
  cy.get("header").within(() => {
    cy.get("h2").should("contain", title);
  });
});

Then("el buscador de productos es visible con placeholder {string}", (placeholder) => {
  cy.get("header").within(() => {
    cy.get('input[name="search"]')
      .should("be.visible")
      .and("have.attr", "placeholder", placeholder);
  });
});

Then("el enlace de login es visible en el header", () => {
  cy.get("header").within(() => {
    HomePage.getByHref("/login").should("be.visible");
  });
});

Then("el enlace {string} a {string} es visible en el header", (text, href) => {
  cy.get("header").within(() => {
    HomePage.getByHref(href).should("be.visible").and("contain", text);
  });
});

// ── Cuerpo principal (Then) ──

Then("el título principal muestra {string}", (text) => {
  cy.get("h1").should("be.visible").and("contain", text);
});

Then("el botón {string} es visible", (text) => {
  cy.contains(text).should("be.visible");
});

Then("el subtítulo {string} es visible", (text) => {
  cy.contains("h2", text).should("be.visible");
});

Then("la categoría {string} es visible", (name) => {
  cy.contains("h3", name).should("be.visible");
});

// ── Footer (Then) ──

Then("el footer contiene la sección {string}", (section) => {
  cy.get("footer").within(() => {
    cy.contains("h3", section).should("be.visible");
  });
});

Then("el footer contiene el enlace {string} a {string}", (text, href) => {
  cy.get("footer").within(() => {
    HomePage.getByHref(href).should("be.visible").and("contain", text);
  });
});

Then("el footer muestra {string}", (text) => {
  cy.get("footer").within(() => {
    cy.contains(text).should("be.visible");
  });
});

// ── Búsqueda y resultados (Then) ──

Then("el título muestra {string}", (text) => {
  cy.get("h1").should("contain", text);
});

Then("se muestran {int} productos en total", (count) => {
  cy.contains(`Mostrando ${count} productos`).should("be.visible");
});

Then("se muestran {int} productos en la página", (count) => {
  cy.get('[class*="grid"] > div').should("have.length", count);
});

Then("aparece el mensaje {string}", (message) => {
  cy.contains(message).should("be.visible");
});

Then("no se muestran 0 productos", () => {
  cy.contains("Mostrando 0 productos").should("not.exist");
});

Then("el título no contiene {string}", (text) => {
  cy.get("h1").should("not.contain", text);
});
