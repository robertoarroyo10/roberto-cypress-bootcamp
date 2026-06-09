# Reportes con Mochawesome en Cypress

Esta guía explica cómo **instalar, configurar y usar** Mochawesome para generar reportes HTML/JSON de los tests de Cypress.

Existen **dos formas** de hacerlo:

1. **`cypress-mochawesome-reporter`** (recomendada para este proyecto): wrapper específico para Cypress que automatiza el merge y la generación del HTML.
2. **`mochawesome` clásico + `mochawesome-merge` + `marge`**: enfoque manual basado en scripts npm.

---

## 1. ¿Qué es Mochawesome?

Mochawesome es un *reporter* para Mocha (motor de tests que usa Cypress por debajo) que genera reportes en HTML y JSON con:

- Resumen de tests pasados, fallados y omitidos.
- Capturas de pantalla y duraciones por test.
- Filtros, búsqueda y vista jerárquica.
- Posibilidad de combinar varios JSON en un único reporte.

---

# Opción A (recomendada): `cypress-mochawesome-reporter`

Es la opción más cómoda: un solo paquete, sin scripts de merge manuales, HTML generado automáticamente al terminar `cypress run`.

## A.1 Instalación

```bash
npm install --save-dev cypress-mochawesome-reporter cypress-on-fix
```

| Paquete | Propósito |
|---|---|
| `cypress-mochawesome-reporter` | Reporter + merge + HTML automáticos. |
| `cypress-on-fix` | Necesario cuando convive con `cypress-cucumber-preprocessor` para no pisar los mismos hooks (`after:spec`, `after:run`, `file:preprocessor`). |

## A.2 Configuración en `cypress.config.js`

Aplicado a este proyecto (que ya usa Cucumber + esbuild + wick-a11y):

```js
const { defineConfig } = require("cypress");
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const { addCucumberPreprocessorPlugin } = require("@badeball/cypress-cucumber-preprocessor");
const { createEsbuildPlugin } = require("@badeball/cypress-cucumber-preprocessor/esbuild");
const cypressOnFix = require("cypress-on-fix");
const addAccessibilityTasks = require("wick-a11y/accessibility-tasks");

module.exports = defineConfig({
  chromeWebSecurity: false,
  experimentalModifyObstructiveThirdPartyCode: true,
  accessibilityFolder: "cypress/accessibility",

  reporter: "cypress-mochawesome-reporter",
  reporterOptions: {
    charts: true,
    reportPageTitle: "Cypress Bootcamp 2026 - Test Report",
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
    reportDir: "cypress/reports/html",
  },

  e2e: {
    specPattern: [
      "cypress/e2e/**/*.cy.js",
      "cypress/e2e/**/*.feature",
    ],
    env: {
      snapshotOnly: true,
      requestMode: true,
    },
    defaultCommandTimeout: 15000,

    async setupNodeEvents(on, config) {
      // Evita conflictos de hooks entre Cucumber y el reporter
      on = cypressOnFix(on);

      // Plugin del reporter (genera y combina el HTML automáticamente)
      require("cypress-mochawesome-reporter/plugin")(on);

      // Cucumber
      await addCucumberPreprocessorPlugin(on, config);

      // esbuild preprocessor
      on("file:preprocessor",
        createBundler({ plugins: [createEsbuildPlugin(config)] })
      );

      // wick-a11y
      addAccessibilityTasks(on);

      return config;
    },
  },
});
```

### Opciones útiles del reporter
| Opción | Para qué sirve |
|---|---|
| `charts` | Muestra gráficos de resumen en el HTML. |
| `reportPageTitle` | Título de la pestaña del navegador y del reporte. |
| `embeddedScreenshots` | Incrusta las capturas dentro del HTML (no requiere carpetas externas). |
| `inlineAssets` | Mete CSS/JS dentro del HTML → un único archivo portable. |
| `saveAllAttempts` | Si está en `true`, guarda también los reintentos. |
| `reportDir` | Carpeta donde se generará el HTML final. |

## A.3 Soporte en `support/e2e.js`

Hay que importar el helper del reporter en el archivo de soporte:

```js
// cypress/support/e2e.js
import "cypress-mochawesome-reporter/register";
```

## A.4 Ejecución

```bash
npx cypress run
```

Al terminar la corrida, el HTML aparece en:

```
cypress/reports/html/index.html
```

No necesitas scripts adicionales: el plugin hace el merge y genera el HTML automáticamente vía los hooks `after:spec` / `after:run`.

## A.5 Integración con GitHub Actions

```yaml
- name: Run Cypress tests
  run: npx cypress run

- name: Upload Mochawesome report
  if: always()
  uses: actions/upload-artifact@v6
  with:
    name: mochawesome-report
    path: cypress/reports/html
    retention-days: 30
```

---

# Opción B (manual): `mochawesome` + `mochawesome-merge` + `marge`

Útil si necesitas control granular del flujo (por ejemplo, postprocesar el JSON antes de renderizar el HTML, o renderizar solo en CI).

## B.1 Instalación

```bash
npm install --save-dev mochawesome mochawesome-merge mochawesome-report-generator
```

| Paquete | Propósito |
|---|---|
| `mochawesome` | Reporter que genera un JSON (y opcionalmente HTML) por archivo de test. |
| `mochawesome-merge` | Combina los múltiples JSON en uno solo. |
| `mochawesome-report-generator` (`marge`) | Genera el HTML final a partir del JSON combinado. |

## B.2 Configuración en `cypress.config.js`

```js
reporter: "mochawesome",
reporterOptions: {
  reportDir: "cypress/reports/mocha",
  overwrite: false,   // no sobrescribir entre specs
  html: false,        // que el HTML lo genere 'marge' al final
  json: true,         // sí queremos JSON por spec
  charts: true,
  embeddedScreenshots: true,
  inlineAssets: true,
},
```

> `overwrite: false` y `html: false` son necesarios para luego combinar varios reportes en uno solo.

## B.3 Scripts en `package.json`

```json
{
  "scripts": {
    "cy:clean:reports": "rm -rf cypress/reports",
    "cy:run": "cypress run",
    "cy:merge": "mochawesome-merge cypress/reports/mocha/*.json > cypress/reports/output.json",
    "cy:report": "marge cypress/reports/output.json --reportDir cypress/reports/html --inline",
    "cy:full": "npm run cy:clean:reports && npm run cy:run ; npm run cy:merge && npm run cy:report"
  }
}
```

### Flujo
1. `cy:clean:reports` borra reportes anteriores.
2. `cy:run` ejecuta Cypress y crea un JSON por cada `.cy.js`/`.feature`.
3. `cy:merge` une todos los JSON en `output.json`.
4. `cy:report` genera el HTML final en `cypress/reports/html/index.html`.

> En Windows usa `rimraf` en lugar de `rm -rf`:  
> `npm install --save-dev rimraf` y `"cy:clean:reports": "rimraf cypress/reports"`.

## B.4 Estructura de salida

```
cypress/
  reports/
    mocha/
      mochawesome.json
      mochawesome_001.json
      ...
    output.json          ← JSON combinado
    html/
      index.html         ← Reporte final navegable
```

## B.5 Integración con GitHub Actions

```yaml
- name: Run Cypress tests + report
  run: npm run cy:full

- name: Upload Mochawesome report
  if: always()
  uses: actions/upload-artifact@v6
  with:
    name: mochawesome-report
    path: cypress/reports/html
    retention-days: 30
```

---

## Comparación rápida

| Aspecto | Opción A (`cypress-mochawesome-reporter`) | Opción B (`mochawesome` puro) |
|---|---|---|
| Paquetes a instalar | 1 (+ `cypress-on-fix` si hay Cucumber) | 3 |
| Merge de JSON | Automático (hooks de Cypress) | Manual (`mochawesome-merge`) |
| HTML al terminar | Sí, sin pasos extra | Requiere ejecutar `marge` |
| Scripts npm necesarios | Solo `cypress run` | `cy:merge`, `cy:report`, `cy:full` |
| Convivencia con Cucumber | Necesita `cypress-on-fix` | No interfiere con hooks |
| Flexibilidad | Menor (todo automático) | Mayor (puedes intervenir entre pasos) |
| Recomendado para este repo | Sí | Solo si necesitas control manual |

---

## Capturas de pantalla en los reportes

Mochawesome incluye automáticamente las screenshots que Cypress toma en los fallos. Para forzar una captura en un test:

```js
cy.screenshot("nombre-de-la-captura");
```

Asegúrate de tener `embeddedScreenshots: true` e `inlineAssets: true` en `reporterOptions` para que se incrusten dentro del HTML.

---

## Problemas comunes

| Problema | Causa / Solución |
|---|---|
| Solo se genera el reporte del último test (opción B) | Falta `overwrite: false` en `reporterOptions`. |
| `mochawesome-merge` no encuentra archivos | Revisa el glob `cypress/reports/mocha/*.json`. |
| El HTML no muestra screenshots | Activa `embeddedScreenshots: true` e `inlineAssets: true`. |
| `cy:merge` no se ejecuta tras fallos | Usa `;` en vez de `&&` después de `cy:run`. |
| Con Cucumber, el reporte sale vacío o incompleto (opción A) | Falta `on = cypressOnFix(on);` antes de registrar los plugins. |
| Error `cypress-mochawesome-reporter/register` no encontrado | Falta `import "cypress-mochawesome-reporter/register";` en `cypress/support/e2e.js`. |

---

## Referencias
- cypress-mochawesome-reporter: https://github.com/LironEr/cypress-mochawesome-reporter
- cypress-on-fix: https://github.com/bahmutov/cypress-on-fix
- Mochawesome: https://github.com/adamgruber/mochawesome
- mochawesome-merge: https://github.com/Antiavanti/mochawesome-merge
- mochawesome-report-generator: https://github.com/adamgruber/mochawesome-report-generator
- Cypress reporters: https://docs.cypress.io/guides/tooling/reporters
