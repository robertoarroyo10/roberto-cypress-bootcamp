import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import LoginPage from "../pages/LoginPage";
import 'cypress-mochawesome-reporter/cucumberSupport';

// ── Background ──

Given("el usuario está en la página de login", () => {
  LoginPage.visit();
});

Given("el botón de Google es visible con texto {string}", (text) => {
  cy.get('[href="https://footer-back.onrender.com/api/auth/google"]')
    .should("be.visible")
    .and("contain", text);
});

// ── Acciones (When) ──

When("el usuario escribe el email {string}", (email) => {
  LoginPage.typeEmail(email);
});

When("el usuario escribe la contraseña {string}", (password) => {
  LoginPage.typePassword(password);
});

When("el usuario limpia el campo email", () => {
  LoginPage.clearEmail();
});

When("el usuario hace clic en el botón de login", () => {
  LoginPage.clickSubmit();
});

When("el usuario hace clic en el toggle de visibilidad", () => {
  LoginPage.clickTogglePasswordVisibility();
});

When("el usuario hace clic en el enlace {string}", (linkText) => {
  LoginPage.clickForgotPassword();
});

// ── Verificaciones (Then) ──

Then("el enlace {string} apunta a {string}", (text, href) => {
  LoginPage.getByRouterLink(href)
    .should("have.attr", "href", href)
    .and("contain", text);
});

Then("el campo email tiene placeholder {string} y está vacío", (placeholder) => {
  LoginPage.getByFormControl("email")
    .should("have.value", "")
    .should("have.attr", "placeholder", placeholder)
    .and("have.value", "");
});

Then("el campo password tiene placeholder {string} y está vacío", (placeholder) => {
  LoginPage.getByFormControl("password")
    .should("have.attr", "placeholder", placeholder)
    .and("have.value", "");
});

Then("el botón de submit está deshabilitado", () => {
  LoginPage.getByType("submit").last().should("be.disabled");
});

Then("el campo email tiene el valor {string}", (value) => {
  LoginPage.getByFormControl("email").should("have.value", value);
});

Then("el campo password tiene el valor {string}", (value) => {
  LoginPage.getByFormControl("password").should("have.value", value);
});

Then("el icono de perfil no existe", () => {
  LoginPage.getByAriaLabel("Ver perfil de usuario").should("not.exist");
});

Then("el icono de cerrar sesión no existe", () => {
  LoginPage.getByAriaLabel("Cerrar sesión").should("not.exist");
});

Then("el icono de perfil es visible", () => {
  LoginPage.getByAriaLabel("Ver perfil de usuario").should("be.visible");
});

Then("el icono de cerrar sesión es visible", () => {
  LoginPage.getByAriaLabel("Cerrar sesión").should("be.visible");
});

Then("el botón de submit muestra {string} y está deshabilitado", (text) => {
  LoginPage.getByType("submit").last().should("be.disabled").and("contain", text);
});

Then("el botón de toggle password es visible", () => {
  LoginPage.getByAriaLabel("Toggle password visibility").should("be.visible");
});

Then("el campo password es de tipo {string}", (type) => {
  LoginPage.getByFormControl("password").should("have.attr", "type", type);
});

Then("el toggle muestra {string}", (text) => {
  LoginPage.getByAriaLabel("Toggle password visibility").should("contain", text);
});

Then("la página no contiene el texto {string}", (text) => {
  cy.get("body").should("not.contain", text);
});

Then("la página contiene el texto {string}", (text) => {
  cy.get("body").should("contain", text);
});

Then("el campo con placeholder {string} no existe", (placeholder) => {
  LoginPage.getByPlaceholder(placeholder).should("not.exist");
});

Then("el campo con placeholder {string} es visible", (placeholder) => {
  LoginPage.getByPlaceholder(placeholder).should("be.visible");
});

Then("el botón submit {string} no existe", (text) => {
  cy.contains('[type="submit"]', text).should("not.exist");
});

Then("el botón submit {string} es visible", (text) => {
  cy.contains('[type="submit"]', text).should("be.visible");
});

Then ('I login and keep the sesion', () => {
  LoginPage.openSession();
});

Then ('I visit the main page', () => {
  LoginPage.visitMain();
})