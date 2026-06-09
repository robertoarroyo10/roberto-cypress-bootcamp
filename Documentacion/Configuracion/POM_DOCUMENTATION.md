# Page Object Model (POM) - Documentación

## ¿Qué es el Page Object Model?

El **Page Object Model (POM)** es un patrón de diseño utilizado en automatización de pruebas que consiste en crear una **clase por cada página o sección de la aplicación**. Cada clase encapsula los selectores y las acciones que se pueden realizar sobre esa página, separando la lógica de los tests de la interacción con la UI.

### Beneficios

- **Reutilización**: Los métodos se escriben una sola vez y se usan en múltiples tests.
- **Mantenimiento**: Si un selector cambia, solo se modifica en un lugar (la Page).
- **Legibilidad**: Los tests se leen como acciones de usuario (`LoginPage.typeEmail(...)`) en vez de selectores crudos (`cy.get('[formcontrolname="email"]').type(...)`).
- **Escalabilidad**: Nuevas páginas y acciones se añaden sin afectar los tests existentes.

---

## Estructura de archivos

```
cypress/
  support/
    pages/
      CommonPage.js          ← Clase base con métodos genéricos
      LoginPage.js            ← Hereda de CommonPage
      HomePage.js             ← Hereda de CommonPage
      FiltersPage.js          ← Hereda de CommonPage
      ProductDetailPage.js    ← Hereda de CommonPage
  e2e/
    smoke/
      loginPOM.cy.js          ← Test que usa LoginPage
      purchaseFlow.cy.js      ← Test que usa LoginPage, HomePage, ProductDetailPage
      filters.cy.js           ← Test que usa FiltersPage, HomePage
  fixtures/
    login_form.json           ← Datos de prueba externalizados
```

---

## Cómo se construye una Page

### Paso 1 — Crear la clase base (`CommonPage`)

La clase base contiene **métodos genéricos** que todas las páginas pueden necesitar. Actúa como "caja de herramientas" compartida.

```js
class CommonPage {

  // ─── SELECTORES GENÉRICOS ─────────────────────────────
  // Devuelven un cy.get() listo para encadenar acciones o aserciones.

  getByAttribute(attr, value) {
    return cy.get(`[${attr}="${value}"]`)
  }

  getByAriaLabel(label) {
    return cy.get(`[aria-label="${label}"]`)
  }

  getByFormControl(name) {
    return cy.get(`[formcontrolname="${name}"]`)
  }

  getByPlaceholder(placeholder) {
    return cy.get(`[placeholder="${placeholder}"]`)
  }

  getByType(type) {
    return cy.get(`[type="${type}"]`)
  }

  getByHref(path) {
    return cy.get(`[href="${path}"]`)
  }

  getByRouterLink(route) {
    return cy.get(`[routerlink="${route}"]`)
  }

  // ─── ACCIONES COMUNES ─────────────────────────────────

  searchProduct(term) {
    cy.get('input[name="search"]').clear().type(term + '{enter}')
  }

  clickProductCard(productName) {
    cy.contains('app-product-card', productName).click()
  }

  navigateToProduct(productName) {
    this.searchProduct(productName)
    this.clickProductCard(productName)
  }

  // ─── ASERCIONES COMUNES ───────────────────────────────

  assertToastMessage(message) {
    this.getByToastMessage(message).should('be.visible')
    this.getByToastMessage(message).should('not.exist')
  }
}

export default CommonPage   // ← Se exporta la CLASE (no una instancia)
```

> **Nota importante**: `CommonPage` se exporta como **clase** (`export default CommonPage`) porque no se usa directamente en los tests, sino que otras páginas **heredan** de ella.

---

### Paso 2 — Crear una Page hija (ejemplo: `LoginPage`)

Cada página hereda de `CommonPage` con `extends`, lo que le da acceso automático a todos los métodos genéricos.

```js
import CommonPage from './CommonPage'

class LoginPage extends CommonPage {

  // ─── ACCIONES ESPECÍFICAS DE ESTA PÁGINA ──────────────

  visit() {
    cy.visit('https://footer-shop.vercel.app/login')
  }

  typeEmail(email) {
    this.getByFormControl('email').type(email)  // usa método heredado
  }

  typePassword(password) {
    this.getByFormControl('password').type(password)
  }

  clearEmail() {
    this.getByFormControl('email').clear()
  }

  clickSubmit() {
    this.getByType('submit').last().click()
  }

  clickForgotPassword() {
    this.getByRouterLink('/forgot-password').click()
  }

  clickTogglePasswordVisibility() {
    this.getByAriaLabel('Toggle password visibility').click()
  }

  // ─── FLUJOS COMPUESTOS ────────────────────────────────

  login() {
    cy.fixture('login_form').then((loginData) => {
      this.typeEmail(loginData.email)
      this.typePassword(loginData.password)
      this.clickSubmit()
      cy.url().should('not.include', '/login').and('include', '/home')
      this.assertToastMessage('Inicio de sesión exitoso')
    })
  }
}

export default new LoginPage()  // ← Se exporta una INSTANCIA
```

> **Nota importante**: Las pages hijas se exportan como **instancias** (`new LoginPage()`) para poder usarlas directamente en los tests sin necesidad de hacer `new` cada vez.

---

## Anatomía de una Page — Tipos de métodos

Cada Page organiza sus métodos en tres categorías:

### 1. Métodos de selección (`get...`)

Localizan elementos del DOM y **devuelven** el resultado de `cy.get()` para poder encadenar acciones o aserciones.

```js
// Definición en la Page
getByFormControl(name) {
  return cy.get(`[formcontrolname="${name}"]`)
}

// Uso en el test — encadenando una aserción
LoginPage.getByFormControl('email').should('have.value', '')

// Uso en el test — encadenando una acción
LoginPage.getByFormControl('email').type('user@test.com')
```

**Regla clave**: los métodos `get...` siempre llevan `return` para permitir el encadenamiento.

### 2. Métodos de acción (`click...`, `type...`, `select...`, `visit`)

Ejecutan una interacción del usuario sobre un elemento. No devuelven nada porque son acciones finales.

```js
// Definición en la Page
typeEmail(email) {
  this.getByFormControl('email').type(email)   // sin return
}

clickSubmit() {
  this.getByType('submit').last().click()
}

// Uso en el test
LoginPage.typeEmail('user@test.com')
LoginPage.clickSubmit()
```

**Patrón interno**: los métodos de acción reutilizan los métodos `get...` a través de `this`.

### 3. Métodos de aserción (`assert...`)

Verifican el estado de la UI. Encapsulan `should()` para que los tests no repitan lógica de validación compleja.

```js
// Definición en la Page
assertToastMessage(message) {
  this.getByToastMessage(message).should('be.visible')
  this.getByToastMessage(message).should('not.exist')
}

// Uso en el test
LoginPage.assertToastMessage('Inicio de sesión exitoso')
```

### 4. Métodos de flujo compuesto (`login`, `navigateToProduct`)

Combinan múltiples acciones y aserciones para representar un flujo completo del usuario. Son útiles en `beforeEach()` o para precondiciones.

```js
// Definición
login() {
  cy.fixture('login_form').then((loginData) => {
    this.typeEmail(loginData.email)
    this.typePassword(loginData.password)
    this.clickSubmit()
    cy.url().should('not.include', '/login').and('include', '/home')
    this.assertToastMessage('Inicio de sesión exitoso')
  })
}

navigateToProduct(productName) {
  this.searchProduct(productName)
  this.clickProductCard(productName)
}
```

---

## Herencia — Cómo funciona `extends` y `this`

```
CommonPage (clase base)
  ├── getByAttribute()
  ├── getByAriaLabel()
  ├── getByFormControl()
  ├── searchProduct()
  ├── navigateToProduct()
  ├── assertToastMessage()
  └── ...
      │
      ├── LoginPage extends CommonPage
      │     ├── visit()
      │     ├── typeEmail()       ← usa this.getByFormControl() de CommonPage
      │     ├── login()           ← usa this.assertToastMessage() de CommonPage
      │     └── ...
      │
      ├── HomePage extends CommonPage
      │     ├── visit()
      │     ├── clickCategory()   ← usa this.getByHref() de CommonPage
      │     └── ...
      │
      ├── FiltersPage extends CommonPage
      │     ├── openFilters()
      │     ├── sortBy()          ← usa this.getByAriaLabel() de CommonPage
      │     └── ...
      │
      └── ProductDetailPage extends CommonPage
            ├── selectColor()
            ├── clickAddToCart()
            └── ...
```

Cuando una Page hija llama a `this.getByFormControl('email')`, JavaScript busca ese método en la clase hija primero. Si no lo encuentra, sube al padre (`CommonPage`) y lo ejecuta desde allí. Esto es la **cadena de prototipos** de JavaScript.

---

## Cómo usar las Pages en un test

### Importar las Pages necesarias

```js
/// <reference types="cypress" />
import LoginPage from '../../support/pages/LoginPage'
import HomePage from '../../support/pages/HomePage'
import ProductDetailPage from '../../support/pages/ProductDetailPage'
```

### Usar los métodos directamente

Como las Pages se exportan como **instancias**, se usan directamente sin `new`:

```js
describe('Flujo de compra', () => {

  beforeEach(() => {
    LoginPage.visit()
    LoginPage.login()
  })

  it('Añadir producto al carrito', () => {
    // Métodos heredados de CommonPage, disponibles en HomePage
    HomePage.navigateToProduct('Nike Air Force 1')

    // Métodos específicos de ProductDetailPage
    ProductDetailPage.selectSize('42')
    ProductDetailPage.clickAddToCart()

    // Método selector heredado — con encadenamiento de aserción
    ProductDetailPage.getByHref('/cart').click()
    cy.url().should('include', '/cart')
  })
})
```

---

## Uso de Fixtures (datos externos)

Los datos de prueba se almacenan en archivos JSON dentro de `cypress/fixtures/` y se cargan con `cy.fixture()`:

```json
// cypress/fixtures/login_form.json
{
  "email": "cypress_bootcamp_2026@javi.com",
  "password": "1234Javi."
}
```

```js
// Uso dentro de una Page
login() {
  cy.fixture('login_form').then((loginData) => {
    this.typeEmail(loginData.email)
    this.typePassword(loginData.password)
    this.clickSubmit()
  })
}
```

Esto evita hardcodear credenciales y datos repetitivos directamente en los tests o en las Pages.

---

## Guía rápida — Crear una nueva Page

1. **Crear el archivo** en `cypress/support/pages/NuevaPage.js`
2. **Importar y extender** `CommonPage`:
   ```js
   import CommonPage from './CommonPage'
   
   class NuevaPage extends CommonPage {
     // métodos aquí
   }
   
   export default new NuevaPage()
   ```
3. **Añadir métodos de selección** si se necesitan selectores específicos no cubiertos por `CommonPage`.
4. **Añadir métodos de acción** para cada interacción del usuario en esa página.
5. **Añadir aserciones** si hay validaciones propias de esa página.
6. **Importar en el test**:
   ```js
   import NuevaPage from '../../support/pages/NuevaPage'
   ```

---

## Resumen de convenciones

| Concepto | Convención |
|---|---|
| Exportación de `CommonPage` | `export default CommonPage` (clase) |
| Exportación de Pages hijas | `export default new XxxPage()` (instancia) |
| Métodos `get...` | Siempre llevan `return` |
| Métodos de acción | No llevan `return` |
| Referencia a métodos del padre | Se usa `this.metodo()` |
| Datos de prueba | Se guardan en `cypress/fixtures/` |
| Selectores preferidos | `aria-label`, `formcontrolname`, `type`, `placeholder`, `routerlink` |
| Nomenclatura de archivos | PascalCase: `LoginPage.js`, `HomePage.js` |
