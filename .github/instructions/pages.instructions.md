---
applyTo: "cypress/e2e/pages/**"
---

# Instrucciones para Page Objects

- Toda Page hereda de `CommonPage` (`cypress/e2e/pages/CommonPage.js`).
- Exporta una instancia: `export default new NombrePage()`.
- Métodos de selección empiezan con `get` y devuelven `cy.get()` para encadenar.
- Métodos de acción empiezan con `click`, `type`, `clear` y no devuelven nada.
- Métodos de aserción empiezan con `assert`.
- Usa selectores accesibles en orden de preferencia: formcontrolname > aria-label > data-testid > placeholder > type.
- Reutiliza los métodos heredados de CommonPage: `getByAttribute()`, `getByAriaLabel()`, `getByFormControl()`, `getByPlaceholder()`, `getByType()`, `getByHref()`, `getByRouterLink()`.
- Organiza los métodos en secciones: Selectores, Acciones, Aserciones, Flujos compuestos.
- Nombre del archivo en PascalCase: `NombrePage.js`.
