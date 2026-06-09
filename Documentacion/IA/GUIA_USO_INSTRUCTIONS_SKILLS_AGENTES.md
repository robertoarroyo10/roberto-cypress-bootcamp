# Guía de uso: Instructions, Skills y Agentes

Esta guía explica **cómo trabajan juntos** los archivos de personalización de Copilot configurados en este repo (`.github/instructions/`, `.github/skills/`, `.github/agents/`) y muestra **ejemplos prácticos** para cada caso de uso.

---

## 1. Conceptos clave (en 30 segundos)

| | Qué es | Cuándo entra en juego |
|---|---|---|
| **Instruction** | Lista de **reglas** que el modelo debe respetar | **Automático**, cuando editas un archivo que coincide con su `applyTo` |
| **Skill** | **Receta paso a paso** para producir algo nuevo | Cuando tu prompt encaja con su `description` |
| **Agente** | **Ejecutor especializado** con contexto aislado y conjunto propio de herramientas | Lo invocas tú: `@nombre-del-agente` |

> **Analogía**  
> - **Skill = "cómo nace"** un artefacto (la receta).  
> - **Instruction = "cómo vive"** ese artefacto (las reglas para mantenerlo).  
> - **Agente = "quién hace el trabajo"** (sigue las skills y respeta las instructions).

**No compiten entre sí: se complementan.** Una sola petición tuya puede disparar **una skill** + **varias instructions** + un **agente** trabajando en conjunto.

---

## 2. Cómo se combinan: el flujo completo

Imagina que dices:

> "Crea una Page para el módulo de wishlist."

Lo que ocurre por dentro:

```
┌──────────────────────────────────────────────────────────────────────┐
│ 1. El AGENTE actual (principal o subagent) recibe el prompt          │
│                                                                      │
│ 2. Detecta que encaja con la SKILL `create-page-object`              │
│    → carga la receta (plantilla, ubicación, secciones)               │
│                                                                      │
│ 3. Va a crear un archivo en `cypress/e2e/pages/**`                   │
│    → se cargan automáticamente las INSTRUCTIONS de `pages.*`         │
│      (herencia de CommonPage, prefijos get/click/assert, etc.)       │
│                                                                      │
│ 4. Genera el archivo aplicando RECETA (skill) + REGLAS (instruction) │
└──────────────────────────────────────────────────────────────────────┘
```

Lo mismo aplica a features y a tests de API.

---

## 3. Decisión rápida: ¿qué se activa según lo que pido?

| Tu intención | Skill activada | Instruction cargada | ¿Agente necesario? |
|---|---|---|---|
| "Crea una Page para X" | `create-page-object` | `pages.instructions.md` | No (puede ser `qa-cypress`) |
| "Modifica `LoginPage.js` para añadir un método" | — | `pages.instructions.md` | No |
| "Crea un feature para X" | `create-feature-file` | `features.instructions.md` | No (puede ser `cucumber-writer`) |
| "Crea un test E2E para X" | `create-e2e-test` | `pages.*` + `features.*` (si toca esos archivos) | No (puede ser `qa-cypress`) |
| "Crea un test de API para X" | `create-api-test` | `api-tests.instructions.md` | No (puede ser `api-tester`) |
| "Crea un pipeline de CI/CD" | `create-github-workflow` | — | No |
| Tarea grande/multipath/refactor | (varias) | (varias) | Sí (`qa-cypress`, `api-tester`...) |

**Regla mental sencilla:**
- *"Crea X"* → la **skill** manda y la **instruction** se suma sola.
- *"Modifica/refactoriza/añade a X"* → suele bastar con la **instruction**.
- *Tarea grande, varios archivos, exploración* → invoca un **agente** especializado.

---

## 4. Ejemplos prácticos por caso de uso

### 4.1 Crear una Page Object

**Lo que pides:**
> "Crea una Page para el carrito con métodos para añadir, eliminar productos y validar el total."

**Lo que ocurre:**
- Skill `create-page-object` → aporta la **plantilla** (secciones de Selectores / Acciones / Aserciones, `export default new CartPage()`).
- Instruction `pages.instructions.md` → garantiza que **hereda de `CommonPage`**, usa `get*`/`click*`/`assert*` y prefiere selectores accesibles.
- Archivo generado: `cypress/e2e/pages/CartPage.js`.

**Cuándo invocar un agente:** si la Page es compleja o involucra varios módulos, usa:
> "@qa-cypress Crea la `CartPage` y, además, verifica que no haya duplicación con `CheckoutPage`."

---

### 4.2 Editar una Page Object existente

**Lo que pides:**
> "Añade en `LoginPage.js` un método para validar el mensaje de error de credenciales incorrectas."

**Lo que ocurre:**
- **No** se activa ninguna skill (no estás creando algo nuevo).
- La instruction `pages.*` se carga sola → el método nuevo respetará la nomenclatura (`assertErrorMessage`) y usará los selectores recomendados.

---

### 4.3 Crear un Feature + Step Definitions

**Lo que pides:**
> "Crea un feature de login con dos escenarios (login correcto y credenciales inválidas). Genera también los step definitions."

**Lo que ocurre:**
- Skill `create-feature-file` → aporta la **estructura Gherkin** (`Background`, `Scenario`, IDs `TC###`) y la plantilla de `Steps.js`.
- Instruction `features.instructions.md` → fuerza español, tags `@regression @login`, máximo 8-10 pasos, etc.
- Archivos generados:
  - `cypress/e2e/features/login.feature`
  - `cypress/e2e/step_definitions/loginSteps.js`

**Cuándo invocar un agente:** si quieres optimizar reutilización con steps existentes:
> "@cucumber-writer Crea el feature de filtros usando `Scenario Outline` y reutiliza los steps de `commonSteps.js` que ya existan."

---

### 4.4 Crear un Test E2E con POM

**Lo que pides:**
> "Crea un test E2E que valide el flujo completo de compra: login → buscar producto → añadir al carrito → checkout."

**Lo que ocurre:**
- Skill `create-e2e-test` → aporta la estructura `describe`/`it`, los `import` de las Pages y el patrón de IDs `TC###`.
- Si en el proceso se crea/edita alguna Page o feature, las instructions correspondientes también se cargan.
- Archivo generado: `cypress/e2e/tests/describe_test/purchaseFlow.cy.js`.

**Cuándo invocar un agente:** si necesitas el flujo de extremo a extremo (Page + Feature + Steps + Test):
> "@qa-cypress Crea el flujo de checkout con Stripe completo: Page, feature, steps y test."

---

### 4.5 Crear un Test de API

**Lo que pides:**
> "Crea un test de API que haga login, extraiga el token y liste los productos del usuario autenticado."

**Lo que ocurre:**
- Skill `create-api-test` → aporta la receta (uso de `cy.request()`, `before()` para login, extracción del token, validaciones).
- Instruction `api-tests.instructions.md` → garantiza el formato de nombrado `'MÉTODO /endpoint - Descripción'`, validación de status + body + tipos, etc.
- Archivo generado: `cypress/e2e/tests/apiTests/userProducts.cy.js`.

**Cuándo invocar un agente:**
> "@api-tester Genera la batería CRUD completa de `/products` con casos negativos 401/403/404."

---

### 4.6 Crear un Workflow de GitHub Actions

**Lo que pides:**
> "Crea un workflow que ejecute los tests de regresión en cada push a main, suba el reporte Mochawesome y notifique a Slack si falla."

**Lo que ocurre:**
- Skill `create-github-workflow` → aporta la plantilla con `checkout`, `setup-node`, `npm run cy:regression`, `upload-artifact` con `if: always()` y `curl` a Slack con `if: failure()`.
- No hay instruction asociada (no es un archivo bajo `cypress/`).
- Archivo generado: `.github/workflows/regression.yml`.

---

### 4.7 Tarea grande/multi-archivo (refactor, auditoría)

Aquí el **agente** marca la diferencia: tiene contexto aislado y usa varias skills/instructions en cadena.

> "@qa-cypress Analiza todas las Pages y detecta selectores duplicados. Propón mover los comunes a `CommonPage` y reescribe las Pages afectadas."

El agente leerá toda la carpeta `pages/`, aplicará las instructions automáticamente al editar, y respetará el formato de la skill `create-page-object` al rehacer las Pages.

---

### 4.8 Exploración sin generar código

Para preguntas o análisis puros (sin crear/editar), usa el agente genérico `Explore`:

> "@Explore ¿Qué tests cubren actualmente el flujo de checkout? Thoroughness: medium."

---

## 5. Inventario rápido de lo configurado en este repo

### Instructions (`.github/instructions/`)
| Archivo | Aplica a | Reglas que aporta |
|---|---|---|
| `pages.instructions.md` | `cypress/e2e/pages/**` | Herencia de `CommonPage`, prefijos `get/click/assert`, selectores accesibles |
| `features.instructions.md` | `cypress/e2e/features/**` | Español, tags, IDs `TC###`, máx. 10 pasos |
| `api-tests.instructions.md` | `cypress/e2e/tests/apiTests/**` | `cy.request()`, validación de status+body+tipos, nombrado `it()` |

### Skills (`.github/skills/`)
| Skill | Para qué sirve |
|---|---|
| `create-page-object` | Genera una nueva Page heredando de `CommonPage` |
| `create-feature-file` | Genera un `.feature` + sus `Steps.js` |
| `create-e2e-test` | Genera un test E2E con POM |
| `create-api-test` | Genera un test de API con `cy.request()` |
| `create-github-workflow` | Genera un workflow de CI/CD con reporte y notificación Slack |

### Agentes (`.github/agents/`)
| Agente | Especialidad |
|---|---|
| `qa-cypress` | Tests E2E con Cypress + Cucumber + POM (stack completo) |
| `api-tester` | Pruebas de API REST con `cy.request()` |
| `cucumber-writer` | Features Gherkin y Step Definitions |

---

## 6. Combinaciones recomendadas

### Cubrir un módulo de extremo a extremo
> "@qa-cypress Necesito cubrir el módulo de wishlist: crea la Page, el feature, los step definitions y el test E2E con tags `@regression @wishlist`."

**Qué se activa:** agente `qa-cypress` → usa skills `create-page-object` + `create-feature-file` + `create-e2e-test` → las instructions de `pages.*` y `features.*` se aplican solas al crear cada archivo.

### Cobertura de API + pipeline CI/CD
> "@api-tester Crea tests para `/orders` y luego pide a `@qa-cypress` que añada un workflow que los ejecute en cada PR y notifique a Slack si fallan."

**Qué se activa:** dos agentes en cadena, skill `create-api-test` (con su instruction) y skill `create-github-workflow`.

### Refactor controlado
> "@qa-cypress Detecta Pages que no hereden de `CommonPage` y reescríbelas para que lo hagan, sin cambiar la API pública."

**Qué se activa:** agente + instruction `pages.*` (no se necesita skill porque no se "crea" nada nuevo, solo se reescribe).

---

## 7. Tips finales

- **No tienes que mencionar la instruction**: se carga sola si tu archivo destino encaja con el `applyTo`.
- **Para forzar una skill específica** menciónala por nombre en el prompt:
  > "Aplica la skill `create-e2e-test` para el flujo de logout."
- **Para forzar un agente** usa `@nombre-del-agente` al inicio del prompt.
- Si Copilot no aplica lo esperado, revisa:
  - Que el archivo a tocar caiga dentro del `applyTo` de la instruction.
  - Que el prompt contenga palabras clave de la `description` de la skill/agente.
- En el footer del chat se ve qué instructions/skills se han cargado en cada turno.
