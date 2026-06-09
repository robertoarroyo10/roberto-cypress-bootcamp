# Agentes y Skills de GitHub Copilot — Documentación

## ¿Qué son los Agentes y Skills?

Los **Agentes** y **Skills** son mecanismos de personalización de **GitHub Copilot** en VS Code que permiten extender y especializar el comportamiento del asistente de IA para que se adapte a las convenciones, patrones y necesidades específicas de tu proyecto de automatización de pruebas.

| Concepto | Definición | Archivo |
|----------|-----------|---------|
| **Instructions** | Reglas y preferencias generales que Copilot sigue siempre | `.github/copilot-instructions.md` |
| **Skills** | Conocimiento especializado que Copilot activa según la tarea | `SKILL.md` |
| **Agents** | Roles especializados con herramientas y comportamientos específicos | `*.agent.md` |

### Beneficios para un proyecto de automatización

- **Consistencia**: Todos los tests generados siguen el mismo patrón (POM, Cucumber, nomenclatura).
- **Productividad**: Copilot conoce la estructura del proyecto y genera código listo para usar.
- **Onboarding**: Nuevos miembros del equipo reciben guía automática al escribir tests.
- **Calidad**: Se aplican buenas prácticas de forma automática (selectores accesibles, assertions correctas, etc.).

---

## 1. Instrucciones del proyecto (`copilot-instructions.md`)

El archivo `.github/copilot-instructions.md` contiene las **reglas globales** que Copilot aplica en cada interacción dentro del workspace. Es el primer paso y el más importante.

### Crear el archivo

```
.github/
  copilot-instructions.md
```

### Ejemplo para nuestro proyecto Cypress Bootcamp 2026

```markdown
# Instrucciones del proyecto — Cypress Bootcamp 2026

## Stack tecnológico
- Cypress 15+ para tests E2E
- Cucumber (Gherkin) con @badeball/cypress-cucumber-preprocessor
- JavaScript (ES6+)
- Page Object Model (POM) como patrón de diseño
- cypress-plugin-api para pruebas de API
- Mochawesome como reporter
- wick-a11y para accesibilidad

## Estructura del proyecto
- Pages (POM): `cypress/e2e/pages/`
- Step definitions: `cypress/e2e/step_definitions/`
- Features (Gherkin): `cypress/e2e/features/`
- Tests directos: `cypress/e2e/tests/describe_test/`
- Tests API: `cypress/e2e/tests/apiTests/`
- Fixtures: `cypress/fixtures/`
- Soporte: `cypress/support/`

## Convenciones de código

### Page Object Model
- Toda Page hereda de `CommonPage` (`cypress/e2e/pages/CommonPage.js`).
- Los métodos de selección empiezan con `get` y devuelven `cy.get()` para encadenar.
- Los métodos de acción empiezan con `click`, `type`, `clear` y NO devuelven nada.
- Los métodos de aserción empiezan con `assert`.
- Se exporta una instancia: `export default new MiPage()`.

### Tests con Cucumber
- Los Features usan tags: `@regression`, `@smoke`, `@login`, `@purchaseFlow`, etc.
- Los Step Definitions importan la Page correspondiente y usan sus métodos.
- Se importa `cypress-mochawesome-reporter/cucumberSupport` para reportes.
- Los pasos usan parámetros con `{string}` para valores dinámicos.

### Tests de API
- Se usa `cy.request()` para llamadas HTTP.
- Se valida status, estructura del body y datos específicos con `expect()`.
- Para endpoints autenticados, se extrae el token del login y se usa `Authorization: Bearer`.

### Nomenclatura
- IDs de test: `TC###` (ej: TC001, TC002).
- Archivos .feature: camelCase (`purchaseFlow.feature`).
- Archivos de test: camelCase con sufijo `.cy.js` (`loginPOM.cy.js`).
- Pages: PascalCase (`LoginPage.js`).
- Step definitions: camelCase con sufijo `Steps.js` (`loginSteps.js`).

### Selectores (orden de preferencia)
1. `[formcontrolname="..."]`
2. `[aria-label="..."]`
3. `[data-testid="..."]`
4. `[placeholder="..."]`
5. `[type="..."]`
6. Evitar selectores frágiles como clases CSS o XPath.

### Idioma
- Features, descripciones de tests y comentarios en **español**.
- Nombres de variables, métodos y clases en **inglés**.
```

---

## 2. Skills (`SKILL.md`)

Los Skills son **bloques de conocimiento especializado** que Copilot activa **automáticamente** cuando detecta que tu tarea coincide con la `description` del skill. Cada skill vive en su propia carpeta dentro de `.github/skills/`.

### Ubicación de los archivos

```
.github/
  skills/
    create-e2e-test/
      SKILL.md
    create-api-test/
      SKILL.md
    create-page-object/
      SKILL.md
    create-feature-file/
      SKILL.md
    create-github-workflow/
      SKILL.md
```

> También se pueden crear a nivel global de VS Code: `~/.config/Code/User/skills/nombre/SKILL.md`

### Estructura de un archivo `SKILL.md`

Cada skill tiene un **frontmatter YAML** (metadatos) y un **cuerpo Markdown** (instrucciones):

```yaml
---
name: nombre-del-skill
description: "Descripción detallada de qué hace el skill y cuándo debe activarse.
  Copilot usa esta descripción para decidir automáticamente si el skill aplica."
---
```

> **Clave**: La `description` es lo más importante. Copilot la lee semánticamente para decidir cuándo activar el skill sin que el usuario lo pida explícitamente.

### Skill: Crear un test E2E con POM

📁 `.github/skills/create-e2e-test/SKILL.md`

```markdown
---
name: create-e2e-test
description: "Crea un test E2E usando el patrón Page Object Model del proyecto
  Cypress Bootcamp 2026. Usar cuando el usuario pida crear un test E2E, un test
  funcional, o un test con POM para una funcionalidad de la aplicación."
---

# Crear Test E2E con POM

## Contexto
Este proyecto usa Cypress con Page Object Model. Antes de crear un test:

1. Lee la Page correspondiente en `cypress/e2e/pages/` para conocer los métodos disponibles.
2. Si no existe la Page, créala siguiendo el patrón de `CommonPage.js`.
3. Usa los métodos de la Page en el test, nunca selectores directos.

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
- Usa `beforeEach()` para setup común.
- Las aserciones usan `.should()` de Cypress, no `expect()` (excepto en API tests).
- Los datos de prueba van en `cypress/fixtures/` como JSON.
- El nombre del `describe` refleja la funcionalidad bajo prueba.
```

### Skill: Crear un test de API

📁 `.github/skills/create-api-test/SKILL.md`

```markdown
---
name: create-api-test
description: "Crea un test de API REST usando cy.request() con validaciones completas.
  Usar cuando el usuario pida crear tests de API, probar endpoints REST, o validar
  respuestas HTTP."
---

# Crear Test de API

## Estructura del test de API

```javascript
describe('API - Nombre del recurso', () => {

    it('GET /endpoint - Descripción', () => {
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

    it('POST /endpoint - Descripción', () => {
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

## Reglas
- Usa `cy.request()` (nunca fetch ni axios).
- Valida siempre: status code, estructura del body, tipos de datos.
- Para endpoints autenticados, obtén el token con un request previo al login.
- Guarda tokens con `cy.wrap().as()` o variables `let`.
- Agrupa los tests por recurso/endpoint en el `describe`.
- Archivo en `cypress/e2e/tests/apiTests/` con nombre descriptivo.
```

### Skill: Crear una Page (POM)

📁 `.github/skills/create-page-object/SKILL.md`

```markdown
---
name: create-page-object
description: "Crea una nueva Page Object siguiendo el patrón de herencia de CommonPage.
  Usar cuando el usuario pida crear una Page, un Page Object, o encapsular selectores
  y acciones de una página de la aplicación."
---

# Crear Page Object

## Antes de empezar
Lee `cypress/e2e/pages/CommonPage.js` para conocer los métodos heredados disponibles.

## Plantilla

```javascript
import CommonPage from './CommonPage';

class NombrePage extends CommonPage {

    // ─── SELECTORES ─────────────────────────────
    // Devuelven cy.get() para encadenar

    getElemento() {
        return this.getByAttribute('atributo', 'valor');
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
- Reutiliza métodos de `CommonPage` (getByAttribute, getByFormControl, etc.).
- Exporta una **instancia** (`new`), no la clase.
- Organiza los métodos en secciones: Selectores, Acciones, Aserciones, Flujos.
- Usa selectores accesibles (formcontrolname, aria-label, data-testid).
```

### Skill: Crear Feature File (Cucumber)

📁 `.github/skills/create-feature-file/SKILL.md`

```markdown
---
name: create-feature-file
description: "Crea un archivo .feature en Gherkin y sus step definitions correspondientes
  para Cypress Cucumber. Usar cuando el usuario pida crear un feature, un escenario
  BDD, steps de Cucumber, o tests con Gherkin."
---

# Crear Feature + Step Definitions

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
- Los pasos en español.
- Usa `{string}` para parámetros dinámicos (siempre entre comillas en el .feature).
- Importa siempre `cypress-mochawesome-reporter/cucumberSupport`.
- Cada Step Definition usa métodos de la Page, nunca selectores directos.
- Los tags deben incluir al menos `@regression` y un tag específico.
```

### Skill: Crear GitHub Actions Workflow

📁 `.github/skills/create-github-workflow/SKILL.md`

```markdown
---
name: create-github-workflow
description: "Crea un workflow de GitHub Actions para ejecutar tests de Cypress con
  reportes Mochawesome y notificaciones Slack. Usar cuando el usuario pida crear un
  pipeline, un workflow CI/CD, o automatizar la ejecución de tests."
---

# Crear Workflow de GitHub Actions

## Plantilla base

```yaml
name: Cypress [Tipo] Tests

on:
  workflow_dispatch:

jobs:
  cypress-tests:
    runs-on: ubuntu-latest
    steps:
    - name: Check out repository
      uses: actions/checkout@v6

    - name: Set up Node.js
      uses: actions/setup-node@v6

    - name: Install dependencies
      run: npm install

    - name: Run Cypress tests
      run: npm run cy:[script]

    - name: Upload report artifact
      uses: actions/upload-artifact@v6
      if: always()
      with:
        name: mochawesome-report
        path: cypress/reports/html/index.html
        retention-days: 30
        if-no-files-found: warn

    - name: Send notification to Slack
      if: always()
      env:
          SLACK_WEBHOOK_URL: ${{ secrets.PIPELINESLACKCONECTION }}
      run: |
          payload="payload={\"text\":\":white_check_mark: Pipeline '${{ github.workflow }}' completed on branch '${{ github.ref }}' by ${{ github.actor }}\"}"
          curl -X POST --data-urlencode "$payload" $SLACK_WEBHOOK_URL

    env:
        CI: true
```

## Opciones de trigger
- `workflow_dispatch:` — Manual
- `push:` / `pull_request:` — Automático en cambios
- `schedule: - cron: '0 17 * * *'` — Programado (diario a las 17:00 UTC)

## Reglas
- Siempre incluir `Upload report artifact` con `if: always()`.
- Slack notification: usar `if: failure()` para alertas o `if: always()` para todas las ejecuciones.
- El secret de Slack se configura en GitHub > Settings > Secrets.
- Usar `CI: true` como variable de entorno global.
```

---

## 3. Agentes (`.agent.md`)

Los Agentes son **roles especializados** con un conjunto definido de herramientas y comportamientos. Se invocan explícitamente desde el chat de Copilot con `@nombre-del-agente`.

### Ubicación de los archivos

```
.github/
  agents/
    qa-cypress.agent.md
    api-tester.agent.md
    cucumber-writer.agent.md
```

### Estructura de un archivo `.agent.md`

```yaml
---
mode: "agent"
description: "Descripción del rol del agente"
tools:
  - "herramienta1"
  - "herramienta2"
---

Instrucciones detalladas del comportamiento del agente...
```

### Agente: QA Cypress

📁 `.github/agents/qa-cypress.agent.md`

```markdown
---
mode: "agent"
description: "Agente especializado en crear y mantener tests E2E con Cypress, Cucumber y POM"
tools:
  - "file_search"
  - "read_file"
  - "create_file"
  - "replace_string_in_file"
  - "run_in_terminal"
  - "grep_search"
  - "semantic_search"
---

# Agente QA Cypress

Eres un ingeniero QA especializado en automatización de pruebas E2E con Cypress.

## Tu conocimiento
- Cypress 15+ con JavaScript ES6+
- Page Object Model (POM) con herencia de CommonPage
- Cucumber/Gherkin con @badeball/cypress-cucumber-preprocessor
- Mochawesome para reportes
- GitHub Actions para CI/CD

## Antes de actuar
1. **Lee la estructura**: Explora `cypress/e2e/pages/` y `cypress/e2e/features/` para conocer lo que ya existe.
2. **Lee CommonPage.js**: Conoce los métodos base disponibles para heredar.
3. **Revisa fixtures**: Busca datos de prueba existentes en `cypress/fixtures/`.

## Cuando te pidan crear un test
1. Verifica si ya existe la Page necesaria.
2. Si no existe, crea la Page siguiendo el patrón de herencia.
3. Crea el test (`.cy.js` o `.feature` + steps según lo solicitado).
4. Sugiere el script de npm para ejecutarlo.
5. Ofrece crear el workflow de GitHub Actions.

## Cuando te pidan depurar un test
1. Lee el archivo del test que falla.
2. Lee la Page asociada.
3. Ejecuta el test con `npx cypress run --spec "ruta/al/test"`.
4. Analiza el error y propón una solución.

## Reglas estrictas
- Nunca uses selectores CSS directos en los tests; siempre pasa por la Page.
- Nunca uses `cy.wait(ms)` con tiempos fijos; usa `cy.intercept()` o aserciones implícitas.
- Nunca uses `cy.pause()` o `cy.debug()` en código commiteado.
- Siempre valida que el selector sea accesible y resistente a cambios de UI.
```

### Agente: API Tester

📁 `.github/agents/api-tester.agent.md`

```markdown
---
mode: "agent"
description: "Agente especializado en pruebas de API REST con Cypress"
tools:
  - "read_file"
  - "create_file"
  - "run_in_terminal"
  - "grep_search"
---

# Agente API Tester

Eres un ingeniero QA especializado en pruebas de API REST usando Cypress.

## Tu conocimiento
- `cy.request()` para llamadas HTTP (GET, POST, PUT, PATCH, DELETE)
- Validaciones con Chai: `expect()`, `to.have.property()`, `to.be.an()`, `to.eq()`
- Autenticación con Bearer tokens
- cypress-plugin-api para visualización de requests

## Cuando te pidan crear tests de API
1. Identifica los endpoints a probar.
2. Crea el archivo en `cypress/e2e/tests/apiTests/`.
3. Organiza por recurso: un `describe` por entidad/recurso.
4. Para cada endpoint, valida:
   - Status code correcto
   - Estructura del response body
   - Tipos de datos de los campos
   - Valores específicos cuando aplique
   - Headers de respuesta si son relevantes

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

## Reglas estrictas
- Nunca uses `fetch()` o `axios`; siempre `cy.request()`.
- Siempre valida el status code como primera aserción.
- Usa `failOnStatusCode: false` solo cuando pruebes errores esperados (4xx, 5xx).
- Documenta el endpoint en el nombre del `it()`: `'GET /products - Retorna lista de productos'`.
```

### Agente: Cucumber Writer

📁 `.github/agents/cucumber-writer.agent.md`

```markdown
---
mode: "agent"
description: "Agente especializado en escribir Features Gherkin y Step Definitions para Cypress Cucumber"
tools:
  - "read_file"
  - "create_file"
  - "file_search"
  - "grep_search"
---

# Agente Cucumber Writer

Eres un experto en BDD (Behavior-Driven Development) con Gherkin y Cypress Cucumber.

## Tu conocimiento
- Sintaxis Gherkin: Feature, Background, Scenario, Scenario Outline, Examples
- @badeball/cypress-cucumber-preprocessor para Cypress
- Integración con POM (Page Object Model)
- Tags para filtrado: @regression, @smoke, @login, etc.

## Cuando te pidan crear un Feature
1. Lee las Pages existentes para conocer los métodos disponibles.
2. Crea el `.feature` en `cypress/e2e/features/`.
3. Crea los step definitions en `cypress/e2e/step_definitions/`.
4. Verifica que los steps reutilicen steps existentes cuando sea posible.

## Pasos reutilizables existentes
Antes de crear nuevos steps, busca en `cypress/e2e/step_definitions/` si ya existen:
- Steps de navegación (Given)
- Steps de login (When)
- Steps de verificación de toast messages (Then)

## Reglas estrictas
- Escribe los pasos en **español**.
- Usa `{string}` para cualquier valor parametrizable.
- Cada Scenario tiene un ID: `TC###`.
- Siempre incluye al menos `@regression` como tag.
- Importa `cypress-mochawesome-reporter/cucumberSupport` en cada archivo de steps.
- Los steps nunca contienen lógica de selectores; delegan a la Page.
```

---

## 4. Instrucciones por carpeta (`.instructions.md`)

Para instrucciones específicas por carpeta o tipo de archivo, se pueden crear archivos `.instructions.md` con un campo `applyTo` en el frontmatter.

### Ejemplo: Instrucciones para archivos de API

📁 `.github/instructions/api-tests.instructions.md`

```markdown
---
applyTo: "cypress/e2e/tests/apiTests/**"
---

# Instrucciones para Tests de API

- Usa `cy.request()` exclusivamente.
- Valida status code, body structure y tipos de datos.
- Nombra los `it()` con el formato: `'MÉTODO /endpoint - Descripción'`.
- Para autenticación, extrae el token en `before()` o `beforeEach()`.
- Agrupa tests por recurso en un solo `describe`.
```

### Ejemplo: Instrucciones para Pages

📁 `.github/instructions/pages.instructions.md`

```markdown
---
applyTo: "cypress/e2e/pages/**"
---

# Instrucciones para Page Objects

- Toda Page hereda de `CommonPage`.
- Exporta una instancia: `export default new NombrePage()`.
- Métodos de selección devuelven `cy.get()`.
- Métodos de acción no devuelven nada.
- Usa selectores accesibles: formcontrolname > aria-label > data-testid.
- Organiza por secciones: Selectores, Acciones, Aserciones, Flujos.
```

### Ejemplo: Instrucciones para Features

📁 `.github/instructions/features.instructions.md`

```markdown
---
applyTo: "cypress/e2e/features/**"
---

# Instrucciones para Features Gherkin

- Escribe en español.
- Incluye tags: al menos `@regression` + tag específico.
- Usa `Background` para pasos comunes.
- Cada `Scenario` lleva ID: `TC###`.
- Los valores dinámicos van entre comillas: `"valor"`.
- Máximo 8-10 pasos por scenario para mantener legibilidad.
```

---

## 5. Implementación paso a paso

### Paso 1 — Crear las instrucciones globales

```bash
# Desde la raíz del proyecto
mkdir -p .github
touch .github/copilot-instructions.md
```

Copia el contenido de la sección 1 de este documento.

### Paso 2 — Crear los Skills

```bash
mkdir -p .github/skills/create-e2e-test
mkdir -p .github/skills/create-api-test
mkdir -p .github/skills/create-page-object
mkdir -p .github/skills/create-feature-file
mkdir -p .github/skills/create-github-workflow
touch .github/skills/create-e2e-test/SKILL.md
touch .github/skills/create-api-test/SKILL.md
touch .github/skills/create-page-object/SKILL.md
touch .github/skills/create-feature-file/SKILL.md
touch .github/skills/create-github-workflow/SKILL.md
```

Copia el contenido de cada skill de la sección 2.

### Paso 3 — Crear los Agentes

```bash
mkdir -p .github/agents
touch .github/agents/qa-cypress.agent.md
touch .github/agents/api-tester.agent.md
touch .github/agents/cucumber-writer.agent.md
```

Copia el contenido de cada agente de la sección 3.

### Paso 4 — Crear las instrucciones por carpeta

```bash
mkdir -p .github/instructions
touch .github/instructions/api-tests.instructions.md
touch .github/instructions/pages.instructions.md
touch .github/instructions/features.instructions.md
```

Copia el contenido de cada archivo de la sección 4.

### Paso 5 — Verificar la configuración

Abre VS Code y verifica:
1. Abre el chat de Copilot (`Ctrl+Shift+I`).
2. Escribe `@` y verifica que aparecen los agentes creados.
3. Pide a Copilot que cree un test y verifica que los skills se activan automáticamente.
4. Verifica que el código generado sigue las convenciones del proyecto.

---

## 6. Cómo usar los Skills y Agentes

### Usar un Skill

Los Skills se activan **automáticamente** cuando Copilot detecta que tu petición coincide con la `description` del skill. Solo tienes que pedir lo que necesitas:

```
Crea un test E2E para verificar que el carrito se actualiza al agregar un producto
→ Copilot activa el skill create-e2e-test automáticamente
```

```
Crea tests de API para el endpoint GET /products con paginación
→ Copilot activa el skill create-api-test automáticamente
```

```
Crea un feature para el flujo de registro de usuario
→ Copilot activa el skill create-feature-file automáticamente
```

### Usar un Agente

Los Agentes se invocan con `@` en el chat de Copilot:

```
@qa-cypress Necesito crear tests E2E para la página de checkout incluyendo Page, Feature y Steps
```

```
@api-tester Crea una suite completa de tests para la API de productos con GET, POST y DELETE
```

```
@cucumber-writer Escribe los scenarios para el flujo de recuperación de contraseña
```

### Combinaciones útiles

```
@qa-cypress Crea la Page para la página de registro
→ El agente qa-cypress usa el skill create-page-object internamente
```

---

## 7. Estructura final del proyecto

```
.github/
  copilot-instructions.md                   ← Reglas globales del proyecto
  skills/
    create-e2e-test/SKILL.md                 ← Skill: crear test E2E
    create-api-test/SKILL.md                 ← Skill: crear test API
    create-page-object/SKILL.md              ← Skill: crear Page Object
    create-feature-file/SKILL.md             ← Skill: crear Feature + Steps
    create-github-workflow/SKILL.md          ← Skill: crear workflow CI/CD
  agents/
    qa-cypress.agent.md             ← Agente QA E2E
    api-tester.agent.md             ← Agente API
    cucumber-writer.agent.md        ← Agente Cucumber/BDD
  instructions/
    api-tests.instructions.md       ← Reglas para tests API
    pages.instructions.md           ← Reglas para Pages
    features.instructions.md        ← Reglas para Features
  workflows/
    smoke.yml                       ← Pipeline smoke tests
    regression.yml                  ← Pipeline regression
    api.yml                         ← Pipeline API tests
    accesibility.yml                ← Pipeline accesibilidad
cypress/
  e2e/
    pages/                          ← Page Objects (POM)
    step_definitions/               ← Step Definitions (Cucumber)
    features/                       ← Feature Files (Gherkin)
    tests/
      describe_test/                ← Tests directos (.cy.js)
      apiTests/                     ← Tests de API
  fixtures/                         ← Datos de prueba
  support/                          ← Configuración y comandos
```

---

## 8. Buenas prácticas

| Práctica | Descripción |
|----------|-------------|
| **Mantén las instrucciones actualizadas** | Si cambia un patrón del proyecto, actualiza `copilot-instructions.md` |
| **No dupliques reglas** | Las reglas globales van en `copilot-instructions.md`, las específicas en `.instructions.md` |
| **Skills atómicos** | Cada skill hace una cosa bien. No crees un skill que haga todo |
| **Agentes enfocados** | Cada agente tiene un dominio claro. No crees un agente genérico |
| **Prueba los skills** | Después de crear un skill, úsalo y ajusta la `description` e instrucciones según los resultados |
| **Versiona los archivos** | Todos los `SKILL.md`, `.agent.md` e `.instructions.md` van en el repo |
| **Comparte con el equipo** | Al estar en `.github/`, todos los miembros del equipo se benefician |

---

## 9. Solución de problemas

| Problema | Solución |
|----------|----------|
| El agente no aparece en `@` | Verifica que el archivo esté en `.github/agents/` con extensión `.agent.md` |
| El skill no se activa automáticamente | Verifica que esté en `.github/skills/nombre/SKILL.md` y que la `description` sea descriptiva |
| Copilot ignora las instrucciones | Verifica que `copilot-instructions.md` esté en `.github/` (no en la raíz) |
| Las instrucciones por carpeta no aplican | Verifica el patrón `applyTo` y que use glob syntax correcta |
| El frontmatter da error | Asegúrate de usar `---` como delimitadores y sintaxis YAML válida |
| El agente no usa las herramientas | Verifica que las herramientas estén listadas en el array `tools` del frontmatter |
| Los skills generan código incorrecto | Mejora las instrucciones del skill con más ejemplos y reglas explícitas |

---

## 10. Referencias

- [Documentación oficial de GitHub Copilot - Custom Instructions](https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot)
- [GitHub Copilot - Prompt Files](https://docs.github.com/en/copilot/customizing-copilot/adding-custom-prompt-files)
- [VS Code Docs - Chat Participants](https://code.visualstudio.com/docs/copilot/copilot-extensibility-overview)
- [Cypress Documentation](https://docs.cypress.io)
- [Cucumber Preprocessor](https://github.com/badeball/cypress-cucumber-preprocessor)
