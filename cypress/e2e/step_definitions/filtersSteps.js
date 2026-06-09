import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import HomePage from "../pages/HomePage";
import FiltersPage from "../pages/FiltersPage";
import 'cypress-mochawesome-reporter/cucumberSupport';


let productosFiltrados = 0;

// ── Background ──

Given("el usuario está en la página de productos", () => {
  cy.visit("https://footer-shop.vercel.app/products");
});

// ── Acciones (When) ──

When("el usuario abre el panel de filtros", () => {
  FiltersPage.openFilters();
});

When("el usuario cierra el panel de filtros", () => {
  FiltersPage.closeFilters();
});

When("el usuario selecciona el filtro {string}", (filter) => {
  FiltersPage.selectFilter(filter);
});

When("el usuario hace clic en mostrar productos", () => {
  FiltersPage.clickShowProducts();
});

When("el usuario limpia los filtros", () => {
  FiltersPage.clearFilters();
});

When("el usuario ordena por {string}", (value) => {
  FiltersPage.sortBy(value);
});

When("el usuario hace clic en la categoría {string}", (category) => {
  HomePage.getByHref(`/products/category/${category}`).first().click();
});

// ── Verificaciones (Then) ──

Then("el panel de filtros muestra el título {string}", (title) => {
  cy.contains("h2", title).should("be.visible");
});

Then("el panel muestra el subtítulo {string}", (subtitle) => {
  cy.contains("h3", subtitle).should("be.visible");
});

Then("la opción de filtro {string} es visible", (option) => {
  cy.contains(option).should("be.visible");
});

Then("el botón {string} es visible en filtros", (text) => {
  cy.contains("button", text).should("be.visible");
});

Then("el panel de filtros no es visible", () => {
  cy.contains("h2", "Filtros").should("not.exist");
});

Then("el título de la página contiene {string}", (text) => {
  cy.get("h1").should("contain", text);
});

Then("el contador de productos es visible", () => {
  cy.contains("Mostrando").should("be.visible");
});

Then("hay productos en la cuadrícula", () => {
  cy.get('[class*="grid"] > div').should("have.length.greaterThan", 0);
});

Then("todos los productos contienen {string} en el nombre", (brand) => {
  cy.get('[class*="grid"] > div').each(($card) => {
    cy.wrap($card).find("h3").invoke("text").should("match", new RegExp(brand, "i"));
  });
});

Then("hay productos filtrados", () => {
  cy.contains("Mostrando")
    .invoke("text")
    .then((text) => {
      productosFiltrados = parseInt(text.match(/\d+/)[0]);
      expect(productosFiltrados).to.be.greaterThan(0);
    });
});

Then("hay más productos que antes del limpiado", () => {
  cy.contains("Mostrando")
    .invoke("text")
    .then((text) => {
      const productosTotal = parseInt(text.match(/\d+/)[0]);
      expect(productosTotal).to.be.greaterThan(productosFiltrados);
    });
});

Then("los precios están ordenados de menor a mayor", () => {
  cy.get('[class*="grid"] > div').should("have.length.greaterThan", 1);
  cy.get('[class*="grid"] > div p')
    .filter(':contains("€")')
    .then(($prices) => {
      const prices = [...$prices].map((el) =>
        parseFloat(el.textContent.replace("€", "").replace(",", "."))
      );
      for (let i = 1; i < prices.length; i++) {
        expect(prices[i]).to.be.at.least(prices[i - 1]);
      }
    });
});

Then("los precios están ordenados de mayor a menor", () => {
  cy.get('[class*="grid"] > div').should("have.length.greaterThan", 1);
  cy.get('[class*="grid"] > div p')
    .filter(':contains("€")')
    .then(($prices) => {
      const prices = [...$prices].map((el) =>
        parseFloat(el.textContent.replace("€", "").replace(",", "."))
      );
      for (let i = 1; i < prices.length; i++) {
        expect(prices[i]).to.be.at.most(prices[i - 1]);
      }
    });
});

Then("el primer producto es de categoría {string}", (category) => {
  cy.get('[class*="grid"] > div')
    .first()
    .find("p")
    .first()
    .should("contain", category);
});
