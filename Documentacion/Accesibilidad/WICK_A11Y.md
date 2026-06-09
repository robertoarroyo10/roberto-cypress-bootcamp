# wick-a11y: Guía de instalación, configuración y uso

## ¿Qué es wick-a11y?

wick-a11y es un plugin para Cypress que permite realizar análisis de accesibilidad automatizados en tus aplicaciones web, soportando los estándares WCAG 2.2 (A–AAA). Genera reportes detallados, resalta visualmente los problemas en el runner de Cypress y puede dar feedback por voz.

---

## Instalación

1. Instala el paquete como dependencia de desarrollo:

```bash
npm install wick-a11y --save-dev
```

---

## Configuración

### 1. Agrega las tareas de accesibilidad en `cypress.config.js`

Edita tu archivo `cypress.config.js` e importa y usa las tareas de wick-a11y en la función `setupNodeEvents`:

```js
const addAccessibilityTasks = require('wick-a11y/accessibility-tasks');

module.exports = defineConfig({
  // ...
  e2e: {
    async setupNodeEvents(on, config) {
      // ...
      addAccessibilityTasks(on);
      // ...
      return config;
    },
  },
});
```

### 2. Importa los comandos personalizados

Agrega la siguiente línea en tu archivo `cypress/support/e2e.js`:

```js
import 'wick-a11y';
```

---

## Opciones de configuración adicionales

- **Carpeta de reportes:** Por defecto, los reportes HTML se guardan en `cypress/accessibility`. Puedes cambiarlo con la opción `accessibilityFolder` en `cypress.config.js`:

```js
module.exports = defineConfig({
  // ...
  accessibilityFolder: 'cypress/mi-carpeta-a11y',
  // ...
});
```


-- **Variables de entorno:**
  - `generateReport`: Controla el tipo de reporte (`detailed`, `basic`, `none`).

Puedes definirla en `cypress.env.json`, en la propiedad `env` de `cypress.config.js`, o por línea de comandos.

---

## Uso básico en tus tests

Llama a `cy.checkAccessibility()` en tus tests para analizar la accesibilidad de la página o de un contexto específico:

```js
describe('Accesibilidad', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('analiza la accesibilidad de la página', () => {
    cy.checkAccessibility();
  });
});
```

Puedes personalizar el análisis pasando opciones:

```js
cy.checkAccessibility(null, {
  includedImpacts: ['critical', 'serious', 'moderate', 'minor'],
  generateReport: 'basic',
});
```

---

## Resultados y reportes

- Los resultados se muestran en el log de Cypress y visualmente en el runner.
- Se generan reportes HTML en la carpeta configurada.

---

## Recursos
- [Repositorio wick-a11y](https://github.com/sclavijosuero/wick-a11y)
- [Documentación oficial Cypress](https://docs.cypress.io/app/guides/accessibility-testing)
- [Video tutorial (Español)](https://www.youtube.com/playlist?list=PLJZz46d_HRpjDPUPirWAaP2NXRFX-xxGd)

---

## Notas
- Solo se puede ejecutar un análisis de accesibilidad por test.
- Si no hay violaciones, no se genera reporte.

---

## Opciones de cy.checkAccessibility()

Puedes personalizar el análisis de accesibilidad pasando un objeto de opciones como segundo argumento. Las opciones más relevantes son:

- **generateReport**: Tipo de reporte HTML generado. Valores: `'detailed'` (por defecto), `'basic'`, `'none'`.
- **includedImpacts**: Array de severidades que harán fallar el test. Ejemplo: `['critical', 'serious']`.
- **onlyWarnImpacts**: Array de severidades que solo mostrarán advertencia, pero no fallarán el test. Ejemplo: `['moderate', 'minor']`.
- **impactStyling**: Personaliza los estilos e iconos de los recuadros de severidad en la página.
- **runOnly**: Array de estándares/tags de accesibilidad a analizar. Ejemplo: `['wcag2a', 'wcag2aa', 'best-practice']`.
- **rules**: Habilita o deshabilita reglas específicas de axe-core. Ejemplo: `{ 'color-contrast': { enabled: false } }`.
- **retries**: Número de reintentos si se detectan violaciones. Por defecto: `0`.
- **interval**: Milisegundos entre reintentos. Por defecto: `1000`.
- **context**: Selector CSS, elemento DOM o configuración avanzada para limitar el análisis a una parte de la página.

### Ejemplo avanzado

```js
describe('Accesibilidad personalizada', () => {
  it('analiza solo WCAG 2.2 AAA y muestra advertencias para severidad menor', () => {
    cy.visit('https://ejemplo.com');
    cy.checkAccessibility(null, {
      generateReport: 'detailed',
      includedImpacts: ['critical', 'serious', 'moderate'],
      onlyWarnImpacts: ['minor'],
      runOnly: ['wcag22aaa'],
      rules: { 'color-contrast': { enabled: false } },
    });
  });
});
```

Para más detalles y opciones avanzadas, consulta la [documentación oficial de wick-a11y](https://github.com/sclavijosuero/wick-a11y#api-reference).

