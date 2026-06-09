# Configuraciones útiles para cypress.config.js

## Configuración actual
```js
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  allowCypressEnv: false,

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
```

---

## Base URL
Evita repetir la URL en cada `cy.visit()`. Todas las páginas POM usarían rutas relativas.
```js
e2e: {
  baseUrl: 'https://footer-shop.vercel.app',
}
```
Con esto, `cy.visit('/home')` equivale a `cy.visit('https://footer-shop.vercel.app/home')`.

---

## Viewports
Configura el tamaño de ventana por defecto.
```js
viewportWidth: 1280,
viewportHeight: 720,
```

---

## Timeouts
Ajusta los tiempos de espera según la velocidad de la aplicación.
```js
// Timeout por defecto para comandos (cy.get, cy.contains, etc.)
defaultCommandTimeout: 10000,   // default: 4000ms

// Timeout para cy.visit()
pageLoadTimeout: 60000,         // default: 60000ms

// Timeout para cy.request()
responseTimeout: 30000,         // default: 30000ms

// Timeout para cy.exec(), cy.task()
execTimeout: 60000,             // default: 60000ms
```

---

## Reintentos (Retries)
Reintenta tests que fallan antes de marcarlos como fallidos.
```js
retries: {
  runMode: 2,     // reintentos en `cypress run` (CI)
  openMode: 0,    // reintentos en `cypress open` (desarrollo)
},
```

---

## Videos y Screenshots
```js
// Grabar video de cada spec (solo en cypress run)
video: true,                    // default: true

// Capturar screenshot en fallos
screenshotOnRunFailure: true,   // default: true

// Carpetas personalizadas
videosFolder: 'cypress/videos',
screenshotsFolder: 'cypress/screenshots',
```

---

## Spec Pattern
Define qué archivos se ejecutan como tests.
```js
e2e: {
  // Solo ejecutar archivos de la carpeta smoke
  specPattern: 'cypress/e2e/smoke/**/*.cy.js',
}
```

---

## Variables de entorno
Define variables reutilizables en los tests con `Cypress.env('variable')`.
```js
env: {
  loginEmail: 'cypress_bootcamp_2026@javi.com',
  loginPassword: '1234Javi.',
},
```
Uso en tests: `Cypress.env('loginEmail')`

---

## Experimental Features
```js
// Habilitar Cypress Studio para grabar tests interactivamente
experimentalStudio: true,

// Origen múltiple (visitar dominios diferentes dentro del mismo test)
experimentalModifyObstructiveThirdPartyCode: true,
```

---

## User Agent y Headers
```js
// Personalizar el user agent
userAgent: 'cypress-bootcamp-2026',
```

---

## Ejemplo completo recomendado
```js
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://footer-shop.vercel.app',
    specPattern: 'cypress/e2e/smoke/**/*.cy.js',
    defaultCommandTimeout: 10000,
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    retries: {
      runMode: 2,
      openMode: 0,
    },
    env: {
      loginEmail: 'cypress_bootcamp_2026@javi.com',
      loginPassword: '1234Javi.',
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
```
