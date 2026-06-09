---
name: create-api-test
description: "Crea un test de API REST usando cy.request() con validaciones completas. Usar cuando el usuario pida crear tests de API, probar endpoints REST, o validar respuestas HTTP."
---

# Crear Test de API

## Contexto
Este proyecto usa Cypress para pruebas de API con `cy.request()`. Los tests de API se encuentran en `cypress/e2e/tests/apiTests/`.

Antes de crear un test, revisa los tests existentes en esa carpeta para mantener coherencia de estilo.

## Estructura del test de API

```javascript
describe('API - Nombre del recurso', () => {

    it('GET /endpoint - Retorna la lista de recursos', () => {
        cy.request({
            method: 'GET',
            url: 'https://api.example.com/endpoint',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('key');
            expect(response.body.key).to.be.an('array');
        });
    });

    it('POST /endpoint - Crea un nuevo recurso', () => {
        cy.request({
            method: 'POST',
            url: 'https://api.example.com/endpoint',
            body: { key: 'value' },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then((response) => {
            expect(response.status).to.eq(201);
        });
    });
});
```

## Para endpoints autenticados

```javascript
let token;

before(() => {
    cy.request({
        method: 'POST',
        url: 'URL_LOGIN',
        body: { email: '...', password: '...' }
    }).then((response) => {
        token = response.body.token;
    });
});
```

## Reglas
- Usa `cy.request()` exclusivamente (nunca `fetch()` ni `axios`).
- Valida siempre: status code, estructura del body, tipos de datos.
- Para endpoints autenticados, obtén el token con un request previo al login.
- Guarda tokens con `cy.wrap().as()` o variables `let`.
- Agrupa los tests por recurso/endpoint en el `describe`.
- Nombra los `it()` con el formato: `'MÉTODO /endpoint - Descripción'`.
- Usa `failOnStatusCode: false` solo cuando pruebes errores esperados (4xx, 5xx).
- Archivo en `cypress/e2e/tests/apiTests/` con nombre camelCase y sufijo `.cy.js`.
- Los datos de prueba se pueden externalizar en `cypress/fixtures/`.
