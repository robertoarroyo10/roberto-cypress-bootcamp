# Instalación y Configuración de Cucumber en Cypress

## Requisitos previos

- Node.js instalado (v16 o superior)
- Un proyecto de Cypress existente (este proyecto ya tiene Cypress `^15.15.0`)

---

## 1. Instalar dependencias

```bash
npm install --save-dev @badeball/cypress-cucumber-preprocessor @bahmutov/cypress-esbuild-preprocessor esbuild
```

| Paquete | Descripción |
|---|---|
| `@badeball/cypress-cucumber-preprocessor` | Integración de Cucumber (Gherkin) con Cypress |
| `@bahmutov/cypress-esbuild-preprocessor` | Bundler para procesar los archivos `.feature` |
| `esbuild` | Motor de compilación rápido requerido por el preprocessor |

---

## 2. Configurar `cypress.config.js`

Reemplazar el contenido de `cypress.config.js` con:

```js
const { defineConfig } = require("cypress");
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const {
  addCucumberPreprocessorPlugin,
} = require("@badeball/cypress-cucumber-preprocessor");
const {
  createEsbuildPlugin,
} = require("@badeball/cypress-cucumber-preprocessor/esbuild");

module.exports = defineConfig({
  e2e: {
    specPattern: "cypress/e2e/**/*.feature",
    setupNodeEvents(on, config) {
      const bundler = createBundler({
        plugins: [createEsbuildPlugin(config)],
      });

      on("file:preprocessor", bundler);

      addCucumberPreprocessorPlugin(on, config);

      return config;
    },
  },
});
```

> **Nota:** `specPattern` indica a Cypress que busque archivos `.feature` en lugar de `.cy.js`.

---

## 3. Configurar el preprocessor en `package.json`

Agregar la siguiente sección al `package.json`:

```json
{
  "cypress-cucumber-preprocessor": {
    "stepDefinitions": "cypress/e2e/step_definitions/**/*.js"
  }
}
```

Esto le indica al preprocessor dónde buscar las definiciones de pasos (step definitions).


## 4. Estructura de carpetas recomendada

```
cypress/
  e2e/
    features/
      login.feature
      purchase.feature
    step_definitions/
      login.js
      purchase.js
  support/
    commands.js
    e2e.js
    pages/
      LoginPage.js
      HomePage.js
```

---

## 5. Crear un archivo `.feature` (ejemplo)

Crear `cypress/e2e/features/login.feature`:

```gherkin
Feature: Login

  Scenario: Login exitoso con credenciales válidas
    Given el usuario está en la página de login
    When ingresa el usuario "standard_user" y la contraseña "secret_sauce"
    And hace clic en el botón de login
    Then debería ver la página de productos
```

---

## 6. Crear las Step Definitions (ejemplo)

Crear `cypress/e2e/step_definitions/login.js`:

```js
import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Given("el usuario está en la página de login", () => {
  cy.visit("https://www.saucedemo.com/");
});

When(
  "ingresa el usuario {string} y la contraseña {string}",
  (username, password) => {
    cy.get("#user-name").type(username);
    cy.get("#password").type(password);
  }
);

When("hace clic en el botón de login", () => {
  cy.get("#login-button").click();
});

Then("debería ver la página de productos", () => {
  cy.get(".title").should("have.text", "Products");
});
```

---

## 7. Agregar scripts en `package.json`

```json
{
  "scripts": {
    "test:cucumber": "npx cypress run --spec 'cypress/e2e/features/**/*.feature'",
    "test:cucumber:open": "npx cypress open"
  }
}
```

---

## 8. Ejecutar los tests

```bash
# Modo headless (terminal)
npm run test:cucumber

# Modo interactivo (Cypress GUI)
npm run test:cucumber:open
```

---

## 9. Uso con Page Object Model (POM)

Se pueden combinar las step definitions con el patrón POM existente:

```js
import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import LoginPage from "../../support/pages/LoginPage";

const loginPage = new LoginPage();

Given("el usuario está en la página de login", () => {
  loginPage.visit();
});

When(
  "ingresa el usuario {string} y la contraseña {string}",
  (username, password) => {
    loginPage.enterUsername(username);
    loginPage.enterPassword(password);
  }
);
```

---

## 10. Tags para organizar escenarios

Los tags permiten filtrar qué escenarios ejecutar:

```gherkin
@smoke
Feature: Login

  @happy-path
  Scenario: Login exitoso
    Given el usuario está en la página de login
    ...

  @negative
  Scenario: Login con credenciales inválidas
    Given el usuario está en la página de login
    ...
```

Ejecutar solo escenarios con un tag específico:

```bash
npx cypress run --env tags="@smoke"
```

Para configurar tags por defecto, agregar en `package.json` o `.cypress-cucumber-preprocessorrc.json`:

```json
{
  "cypress-cucumber-preprocessor": {
    "stepDefinitions": "cypress/e2e/step_definitions/**/*.js",
    "filterSpecs": true,
    "omitFiltered": true
  }
}
```

---

## Resumen de comandos

| Comando | Descripción |
|---|---|
| `npm install --save-dev @badeball/cypress-cucumber-preprocessor @bahmutov/cypress-esbuild-preprocessor esbuild` | Instalar dependencias |
| `npm run test:cucumber` | Ejecutar tests en modo headless |
| `npm run test:cucumber:open` | Abrir Cypress GUI |
| `npx cypress run --env tags="@smoke"` | Ejecutar tests filtrados por tag |
