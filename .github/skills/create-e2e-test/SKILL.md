---
name: create-e2e-test
description: "Crea un test E2E usando el patrón Page Object Model del proyecto Cypress Bootcamp 2026. Usar cuando el usuario pida crear un test E2E, un test funcional, o un test con POM para una funcionalidad de la aplicación."
---

# Crear Test E2E con POM

## Contexto
Este proyecto usa Cypress con Page Object Model. Antes de crear un test:

1. Lee la Page correspondiente en `cypress/e2e/pages/` para conocer los métodos disponibles.
2. Lee `cypress/e2e/pages/CommonPage.js` para conocer los métodos heredados.
3. Si no existe la Page necesaria, créala siguiendo el patrón de herencia de `CommonPage`.
4. Usa los métodos de la Page en el test, nunca selectores directos.

## Estructura del test

```javascript
import loginPage from '../pages/LoginPage';
// Importar las pages necesarias

describe('Nombre descriptivo del módulo', () => {

    beforeEach(() => {
        // Setup: visitar página, login si es necesario
    });

    it('ID:TC### - Descripción clara del caso de prueba', () => {
        // Arrange: preparar datos
        // Act: ejecutar acciones con métodos de la Page
        // Assert: verificar resultados
    });
});
```

## Reglas
- Cada `it()` tiene un ID único con formato `TC###`.
- Usa `beforeEach()` para setup común (visitar página, login, etc.).
- Las aserciones usan `.should()` de Cypress, no `expect()` (excepto en API tests).
- Los datos de prueba van en `cypress/fixtures/` como JSON y se cargan con `cy.fixture()`.
- El nombre del `describe` refleja la funcionalidad bajo prueba.
- El archivo se crea en `cypress/e2e/tests/describe_test/` con nombre camelCase y sufijo `.cy.js`.
- Descripciones y comentarios en **español**.
- Nombres de variables, métodos y clases en **inglés**.

## Selectores (orden de preferencia)
1. `[formcontrolname="..."]` → `page.getByFormControl('name')`
2. `[aria-label="..."]` → `page.getByAriaLabel('label')`
3. `[data-testid="..."]` → `page.getByAttribute('data-testid', 'value')`
4. `[placeholder="..."]` → `page.getByPlaceholder('text')`
5. `[type="..."]` → `page.getByType('type')`
6. Evitar selectores frágiles como clases CSS o XPath.
