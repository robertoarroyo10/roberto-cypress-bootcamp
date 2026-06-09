---
applyTo: "cypress/e2e/tests/apiTests/**"
---

# Instrucciones para Tests de API

- Usa `cy.request()` exclusivamente para llamadas HTTP.
- Valida siempre: status code, estructura del body y tipos de datos.
- Nombra los `it()` con el formato: `'MÉTODO /endpoint - Descripción'`.
- Para autenticación, extrae el token en `before()` o `beforeEach()`.
- Agrupa tests por recurso/endpoint en un solo `describe`.
- Usa `failOnStatusCode: false` solo para probar errores esperados (4xx, 5xx).
- Los datos de prueba se pueden externalizar en `cypress/fixtures/`.
- Comentarios y descripciones en español. Variables y métodos en inglés.
