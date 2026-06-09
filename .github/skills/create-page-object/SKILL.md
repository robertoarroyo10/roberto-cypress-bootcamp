---
name: create-page-object
description: "Crea una nueva Page Object siguiendo el patrón de herencia de CommonPage. Usar cuando el usuario pida crear una Page, un Page Object, o encapsular selectores y acciones de una página de la aplicación."
---

# Crear Page Object

## Antes de empezar
Lee `cypress/e2e/pages/CommonPage.js` para conocer los métodos heredados disponibles:

### Métodos de selección (devuelven `cy.get()` para encadenar)
- `getByAttribute(attr, value)` — Selector genérico por atributo
- `getByAriaLabel(label)` — `[aria-label="..."]`
- `getByFormControl(name)` — `[formcontrolname="..."]`
- `getByPlaceholder(placeholder)` — `[placeholder="..."]`
- `getByType(type)` — `[type="..."]`
- `getByHref(path)` — `[href="..."]`
- `getByRouterLink(route)` — `[routerlink="..."]`
- `getByToastMessage(message)` — Toast notifications

### Métodos de acción (void, no devuelven nada)
- `searchProduct(productName)` — Busca un producto
- `clickPage(pageNumber)` — Navega a una página
- `clickProductCard(productName)` — Click en una tarjeta de producto
- `navigateToProduct(productName)` — Busca y navega a un producto
- `clickByAttribute(attr, value)` — Click genérico por atributo
- `typeByAttribute(attr, value, text)` — Escribe en un campo por atributo

### Métodos de aserción
- `assertToastMessage(message)` — Verifica toast visible y luego desaparece
- `assetByAttribute(attr, value, assertion)` — Aserción genérica
- `buttonStateByContent(content, state)` — Verifica estado de un botón

## Plantilla

```javascript
import CommonPage from './CommonPage';

class NombrePage extends CommonPage {

    // ─── SELECTORES ─────────────────────────────
    // Devuelven cy.get() para encadenar

    getElemento() {
        return this.getByFormControl('nombre');
    }

    // ─── ACCIONES ───────────────────────────────
    // No devuelven nada (void)

    clickElemento() {
        this.getElemento().click();
    }

    typeEnCampo(texto) {
        this.getByFormControl('campo').clear().type(texto);
    }

    // ─── ASERCIONES ─────────────────────────────

    assertElementoVisible() {
        this.getElemento().should('be.visible');
    }

    // ─── FLUJOS COMPUESTOS ──────────────────────

    completarFormulario(datos) {
        this.typeEnCampo(datos.campo);
        this.clickElemento();
    }
}

export default new NombrePage();
```

## Reglas
- Siempre hereda de `CommonPage`.
- Reutiliza métodos de `CommonPage` (`getByAttribute`, `getByFormControl`, etc.) en lugar de escribir `cy.get()` directamente.
- Exporta una **instancia** (`new NombrePage()`), no la clase.
- Organiza los métodos en secciones: Selectores, Acciones, Aserciones, Flujos.
- Usa selectores accesibles: formcontrolname > aria-label > data-testid > placeholder > type.
- El archivo va en `cypress/e2e/pages/` con nombre PascalCase (`NombrePage.js`).
- Los nombres de métodos en **inglés**: `get`, `click`, `type`, `clear`, `assert`.
