# Configuración de CI/CD con GitHub Actions (archivos `.yml`)

Esta guía explica cómo crear y configurar archivos YAML para implementar pipelines de Integración Continua y Entrega Continua (CI/CD) con **GitHub Actions** en este proyecto de Cypress.

---

## 1. ¿Qué es GitHub Actions?

GitHub Actions es la herramienta nativa de GitHub para automatizar flujos de trabajo (workflows): ejecutar tests, hacer builds, desplegar aplicaciones, enviar notificaciones, etc. Cada workflow se define en un archivo **YAML** dentro de la carpeta especial:

```
.github/workflows/
```

Cada archivo `.yml` dentro de esa carpeta es un workflow independiente.

---

## 2. Estructura básica de un archivo workflow

Un workflow tiene tres bloques principales:

```yaml
name: Nombre del workflow      # Cómo se mostrará en la pestaña "Actions"

on:                            # Eventos que disparan el workflow
  push:
    branches: [ main ]
  pull_request:
  workflow_dispatch:           # Permite ejecutarlo manualmente desde la UI

jobs:                          # Uno o más jobs que se ejecutan en paralelo
  nombre-del-job:
    runs-on: ubuntu-latest     # Sistema operativo del runner
    steps:                     # Lista ordenada de pasos
      - name: Paso 1
        uses: actions/checkout@v6
      - name: Paso 2
        run: echo "Hola mundo"
```

### Eventos (`on`) más comunes
| Evento | Cuándo se dispara |
|---|---|
| `push` | Al hacer push a una rama |
| `pull_request` | Al abrir/actualizar un PR |
| `schedule` | En horarios definidos (cron) |
| `workflow_dispatch` | Ejecución manual desde GitHub |
| `workflow_call` | Reutilización desde otro workflow |

### Ejemplo con `schedule` (cron)
```yaml
on:
  schedule:
    - cron: '0 8 * * 1-5'   # 08:00 UTC de lunes a viernes
```

---

## 3. Pasos típicos para un pipeline de Cypress

### 3.1 Checkout del repositorio
```yaml
- name: Check out repository
  uses: actions/checkout@v6
```

### 3.2 Instalar Node.js
```yaml
- name: Set up Node.js
  uses: actions/setup-node@v6
  with:
    node-version: '20'
    cache: 'npm'
```

### 3.3 Instalar dependencias
```yaml
- name: Install dependencies
  run: npm ci
```
> `npm ci` es más rápido y reproducible que `npm install` en CI.

### 3.4 Ejecutar tests de Cypress
```yaml
- name: Run Cypress tests
  run: npm run cy:run
```

O usando la acción oficial de Cypress (instala, cachea y ejecuta en un solo paso):
```yaml
- name: Cypress run
  uses: cypress-io/github-action@v6
  with:
    browser: chrome
    record: false
```

---

## 4. Ejemplo completo (basado en este repo)

Archivo: [.github/workflows/accesibility.yml](.github/workflows/accesibility.yml)

```yaml
name: Cypress Accesibility Tests

on:
  workflow_dispatch:

jobs:
  cypress-accesibility:
    runs-on: ubuntu-latest
    steps:
      - name: Check out repository
        uses: actions/checkout@v6

      - name: Set up Node.js
        uses: actions/setup-node@v6

      - name: Install dependencies
        run: npm install

      - name: Run Cypress accesibility tests
        run: npm run cy:accesibility

      - name: Upload report artifact
        uses: actions/upload-artifact@v6
        if: always()
        with:
          name: mochawesome-report
          path: cypress/reports/html/index.html
          retention-days: 30
          if-no-files-found: warn
    env:
      CI: true
```

### Puntos clave
- `if: always()` asegura subir el reporte aunque los tests fallen.
- `env: CI: true` indica a las herramientas que están corriendo en un entorno CI.
- `retention-days` controla cuánto tiempo se guarda el artefacto.

---

## 5. Secrets y variables sensibles

Nunca pongas tokens o webhooks en texto plano. Guárdalos en:

**Repositorio en GitHub → Settings → Secrets and variables → Actions → New repository secret**

Y úsalos en el YAML con la sintaxis:

```yaml
env:
  SLACK_WEBHOOK_URL: ${{ secrets.PIPELINESLACKCONECTION }}
```

---

## 6. Matriz de ejecución (múltiples versiones/navegadores)

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        browser: [chrome, firefox, edge]
    steps:
      - uses: actions/checkout@v6
      - uses: cypress-io/github-action@v6
        with:
          browser: ${{ matrix.browser }}
```

---

## 7. Buenas prácticas

- Usa **versiones fijas** de las actions (`@v6`) en lugar de `@main`.
- Cachea `node_modules` con `actions/setup-node` (`cache: 'npm'`).
- Divide workflows por propósito (tests E2E, accesibilidad, deploy, etc.).
- Usa `workflow_dispatch` para poder lanzar manualmente desde la UI.
- Sube siempre los reportes/artefactos con `if: always()`.
- Maneja notificaciones de fallo con `if: failure()`.

---

## 8. Cómo verificar que funciona

1. Haz commit del archivo en `.github/workflows/`.
2. Ve a la pestaña **Actions** de tu repositorio en GitHub.
3. Selecciona el workflow y pulsa **Run workflow** (si tiene `workflow_dispatch`).
4. Revisa los logs de cada step y descarga los artefactos generados.

---

## Referencias
- Documentación oficial: https://docs.github.com/actions
- Marketplace de Actions: https://github.com/marketplace?type=actions
- Cypress GitHub Action: https://github.com/cypress-io/github-action
