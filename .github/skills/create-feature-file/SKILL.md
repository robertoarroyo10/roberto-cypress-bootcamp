---
name: create-feature-file
description: "Crea un archivo .feature en Gherkin y sus step definitions correspondientes para Cypress Cucumber. Usar cuando el usuario pida crear un feature, un escenario BDD, steps de Cucumber, o tests con Gherkin."
---

# Crear Feature + Step Definitions

## Antes de empezar
1. Busca en `cypress/e2e/step_definitions/` si ya existen steps reutilizables.
2. Lee las Pages existentes en `cypress/e2e/pages/` para conocer los métodos disponibles.
3. Si necesitas una Page que no existe, créala primero.

## Feature File

Ubicación: `cypress/e2e/features/nombreFeature.feature`

```gherkin
@regression @nombreTag
Feature: Descripción de la funcionalidad

    Background:
        Given el usuario está en la página correspondiente

    @smoke
    Scenario: TC001 - Descripción del escenario
        When el usuario realiza una acción con "parámetro"
        Then se muestra el resultado esperado
        And el elemento tiene el valor "esperado"

    Scenario: TC002 - Descripción del segundo escenario
        When el usuario realiza otra acción
        Then se verifica el comportamiento
```

## Step Definitions

Ubicación: `cypress/e2e/step_definitions/nombreSteps.js`

```javascript
import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import 'cypress-mochawesome-reporter/cucumberSupport';
import nombrePage from '../pages/NombrePage';

// ─── BACKGROUND ─────────────────────────────
Given('el usuario está en la página correspondiente', () => {
    nombrePage.visit();
});

// ─── ACCIONES ───────────────────────────────
When('el usuario realiza una acción con {string}', (parametro) => {
    nombrePage.realizarAccion(parametro);
});

// ─── VERIFICACIONES ─────────────────────────
Then('se muestra el resultado esperado', () => {
    nombrePage.assertResultado();
});

Then('el elemento tiene el valor {string}', (valor) => {
    nombrePage.getElemento().should('have.value', valor);
});
```

## Reglas
- Los pasos se escriben en **español**.
- Usa `{string}` para cualquier valor parametrizable (siempre entre comillas en el .feature).
- Cada Scenario tiene un ID: `TC###`.
- Siempre incluye al menos `@regression` como tag en el Feature.
- Importa siempre `cypress-mochawesome-reporter/cucumberSupport` en cada archivo de steps.
- Los steps nunca contienen lógica de selectores; delegan todo a la Page.
- Reutiliza steps existentes cuando sea posible en lugar de crear duplicados.
- Un `Background` contiene solo los pasos comunes a TODOS los scenarios.
- Máximo 8-10 pasos por scenario para mantener legibilidad.
- Nombre del .feature en camelCase. Nombre del steps en camelCase con sufijo `Steps.js`.
