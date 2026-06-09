# Personalización de GitHub Copilot — Guía Resumen

Copilot se personaliza con **3 mecanismos** que trabajan juntos. Cada uno tiene un rol diferente:

```
┌─────────────────────────────────────────────────────────────┐
│  INSTRUCTIONS          SKILLS              AGENTS           │
│  (.instructions.md)    (SKILL.md)          (.agent.md)      │
│                                                             │
│  Se activan SOLAS      Auto + manual       Tú los invocas   │
│  por ruta de archivo   por contexto        con @nombre      │
│                                                             │
│  "Reglas pasivas"      "Conocimiento       "Roles completos"│
│                         especializado"                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 1. Instructions — Reglas automáticas por carpeta

**Qué son**: Reglas que Copilot aplica automáticamente cuando editas archivos que coinciden con el patrón `applyTo`.

**Cuándo se activan**: Solas, sin que hagas nada. Basta con abrir o editar un archivo que coincida.

**Archivo**: `.github/instructions/nombre.instructions.md`

### Ejemplo real del proyecto

```yaml
# .github/instructions/pages.instructions.md
---
applyTo: "cypress/e2e/pages/**"
---
- Toda Page hereda de CommonPage.
- Exporta una instancia: export default new NombrePage().
- Métodos de selección devuelven cy.get().
- Métodos de acción no devuelven nada.
- Selectores: formcontrolname > aria-label > data-testid.
```

**Resultado**: Cuando editas `cypress/e2e/pages/LoginPage.js`, Copilot ya sabe que debe heredar de `CommonPage`, exportar una instancia, y usar selectores accesibles — sin que se lo pidas.

### Otros ejemplos implementados

| Archivo | Se aplica a | Qué hace |
|---------|------------|----------|
| `api-tests.instructions.md` | `cypress/e2e/tests/apiTests/**` | Fuerza uso de `cy.request()`, formato de `it()` con `MÉTODO /endpoint` |
| `features.instructions.md` | `cypress/e2e/features/**` | Pasos en español, tags obligatorios, IDs `TC###` |
| `pages.instructions.md` | `cypress/e2e/pages/**` | Herencia de CommonPage, convención de métodos |

> **También existe** `copilot-instructions.md` en `.github/` — son instrucciones **globales** que aplican siempre, en todo el proyecto.

---

## 2. Skills — Conocimiento especializado

**Qué son**: Bloques de conocimiento que Copilot activa **automáticamente** cuando detecta que tu tarea coincide con la `description` del skill. También se pueden invocar manualmente.

**Cuándo se activan**: Automáticamente por contexto semántico (Copilot lee la `description` y decide si aplica) o manualmente cuando lo referencias.

**Archivo**: `.github/skills/nombre-del-skill/SKILL.md` (cada skill vive en su propia carpeta)

### Estructura de un skill

```yaml
# .github/skills/create-page-object/SKILL.md
---
name: create-page-object
description: "Crea una nueva Page Object siguiendo el patrón de herencia
  de CommonPage. Usar cuando el usuario pida crear una Page, un Page Object,
  o encapsular selectores y acciones de una página de la aplicación."
---

Instrucciones detalladas en Markdown...
```

> **Clave**: La `description` es lo que Copilot usa para decidir cuándo activar el skill. Debe describir claramente **qué hace** y **cuándo usarlo**.

### Ejemplo: usar un skill

En el chat de Copilot escribes:

```
#create-page-object Crea la Page para la pantalla de registro de usuario
```

Copilot lee las instrucciones del skill y:
1. Lee `CommonPage.js` para conocer los métodos heredados
2. Crea `RegisterPage.js` heredando de `CommonPage`
3. Agrega métodos `get`, `type`, `click`, `assert` según la pantalla
4. Exporta `new RegisterPage()`

### Skills implementados en el proyecto

| Skill | Carpeta | Se activa cuando pides... |
|-------|---------|-------------------------|
| `create-e2e-test` | `skills/create-e2e-test/` | Crear un test E2E, test funcional, test con POM |
| `create-api-test` | `skills/create-api-test/` | Crear tests de API, probar endpoints REST |
| `create-page-object` | `skills/create-page-object/` | Crear una Page, Page Object, encapsular selectores |
| `create-feature-file` | `skills/create-feature-file/` | Crear un feature, escenario BDD, steps Cucumber |
| `create-github-workflow` | `skills/create-github-workflow/` | Crear un pipeline, workflow CI/CD |

---

## 3. Agents — Roles especializados

**Qué son**: Perfiles completos con personalidad, conocimiento y múltiples capacidades. Un agente puede hacer varias tareas dentro de su dominio.

**Cuándo se activan**: Cuando tú escribes `@nombre-del-agente` en el chat de Copilot.

**Archivo**: `.github/agents/nombre.agent.md`

### Diferencia clave con Skills

| | Skill | Agente |
|-|-------|--------|
| **Activación** | Automática por descripción + manual | Solo manual con `@nombre` |
| **Alcance** | Una tarea concreta | Un rol completo |
| **Ejemplo** | "Crea una Page Object" | "Eres un QA: crea, depura, mantén tests" |
| **Interacción** | Puntual (genera y listo) | Conversacional (puedes seguir pidiendo) |

### Estructura de un agente

```yaml
---
mode: "agent"
description: "Descripción del rol"
tools:
  - "read_file"
  - "create_file"
  - "run_in_terminal"    # Puede ejecutar tests
  - "grep_search"        # Puede buscar en el código
---

# Nombre del Agente

Eres un [rol] especializado en [dominio].

## Antes de actuar
1. Lee los archivos existentes...
2. Analiza la estructura...

## Cuando te pidan [tarea]
1. Paso 1...
2. Paso 2...

## Reglas estrictas
- Nunca hagas X...
- Siempre haz Y...
```

### Ejemplo: usar un agente

```
@qa-cypress Necesito tests para verificar que el usuario puede filtrar productos por categoría
```

El agente `qa-cypress`:
1. Explora las Pages existentes → encuentra `FiltersPage.js`
2. Lee los métodos disponibles en `FiltersPage` y `CommonPage`
3. Crea el test usando esos métodos
4. Sugiere ejecutarlo con `npm run cy:filters`

Puedes seguir la conversación:

```
@qa-cypress Ahora agrega un scenario para filtrar por precio mínimo y máximo
```

### Agentes implementados en el proyecto

| Agente | Invocación | Especialidad |
|--------|-----------|-------------|
| `qa-cypress` | `@qa-cypress` | Tests E2E completos: POM + Cucumber + depuración |
| `api-tester` | `@api-tester` | Tests de API REST con `cy.request()` |
| `cucumber-writer` | `@cucumber-writer` | Features Gherkin + Step Definitions en español |

---

## Cómo trabajan juntos

```
Tú editas LoginPage.js
        │
        ▼
  ┌─ INSTRUCTIONS ─┐     Se activan solas
  │ pages.instructions.md aplica reglas:
  │ "hereda de CommonPage, exporta instancia"
  └────────────────┘

Tú escribes: "crea un feature para el login con validaciones"
        │
        ▼
  ┌─── SKILL ──────┐     Se activa por contexto
  │ Copilot detecta que coincide con create-feature-file
  │ Lee el SKILL.md y genera login.feature + loginSteps.js
  └────────────────┘

Tú escribes: @qa-cypress el test de login falla, ayúdame
        │
        ▼
  ┌─── AGENT ──────┐     Tú lo invocas
  │ Lee el test, la Page, ejecuta el test
  │ Diagnostica el error, propone fix
  │ Puedes seguir conversando con él
  └────────────────┘
```

---

## Estructura de archivos

```
.github/
├── copilot-instructions.md              ← Reglas globales (siempre activas)
├── instructions/
│   ├── api-tests.instructions.md        ← Auto para apiTests/
│   ├── pages.instructions.md            ← Auto para pages/
│   └── features.instructions.md         ← Auto para features/
├── skills/
│   ├── create-e2e-test/SKILL.md         ← Test E2E con POM
│   ├── create-api-test/SKILL.md         ← Test de API REST
│   ├── create-page-object/SKILL.md      ← Page Object con CommonPage
│   ├── create-feature-file/SKILL.md     ← Feature + Step Definitions
│   └── create-github-workflow/SKILL.md  ← Workflow GitHub Actions
└── agents/
    ├── qa-cypress.agent.md              ← @qa-cypress
    ├── api-tester.agent.md              ← @api-tester
    └── cucumber-writer.agent.md         ← @cucumber-writer
```

---

## Referencia rápida

| Quiero... | Uso |
|-----------|-----|
| Que Copilot siga reglas al editar Pages | Ya está → `pages.instructions.md` se activa sola |
| Crear un test E2E rápido | Pide "crea un test E2E para..." → skill `create-e2e-test` se activa |
| Crear un feature con steps | Pide "crea un feature para..." → skill `create-feature-file` se activa |
| Crear una Page Object | Pide "crea una Page para..." → skill `create-page-object` se activa |
| Crear tests de API | Pide "crea tests de API para..." → skill `create-api-test` se activa |
| Crear un workflow CI/CD | Pide "crea un pipeline para..." → skill `create-github-workflow` se activa |
| Ayuda completa de QA E2E | `@qa-cypress lo que necesites` |
| Ayuda con tests de API | `@api-tester lo que necesites` |
| Ayuda con Cucumber/BDD | `@cucumber-writer lo que necesites` |
