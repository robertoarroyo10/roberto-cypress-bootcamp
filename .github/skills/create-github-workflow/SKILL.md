---
name: create-github-workflow
description: "Crea un workflow de GitHub Actions para ejecutar tests de Cypress con reportes Mochawesome y notificaciones Slack. Usar cuando el usuario pida crear un pipeline, un workflow CI/CD, o automatizar la ejecución de tests."
---

# Crear Workflow de GitHub Actions

## Contexto
Este proyecto usa GitHub Actions para CI/CD. Los workflows existentes están en `.github/workflows/`. Revisa los existentes antes de crear uno nuevo para mantener coherencia.

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
- `workflow_dispatch:` — Ejecución manual desde GitHub UI
- `push:` / `pull_request:` — Automático en cambios de código
- `schedule: - cron: '0 17 * * *'` — Programado (diario a las 17:00 UTC)

## Scripts de npm disponibles
- `cy:regression` — Features con tag @regression
- `cy:smoke` — Features con tag @smoke
- `cy:homePage` — Features con tag @homePage
- `cy:purchaseFlow` — Features con tag @purchaseFlow
- `cy:filters` — Features con tag @filters
- `cy:login` — Features con tag @login
- `cy:api` — Tests de API
- `cy:accesibilidad` — Tests de accesibilidad

## Notificaciones Slack
- `if: failure()` — Solo notifica cuando falla
- `if: success()` — Solo notifica cuando pasa
- `if: always()` — Notifica siempre
- El secret de Slack se configura en GitHub > Settings > Secrets and variables > Actions

## Reglas
- Siempre incluir el step `Upload report artifact` con `if: always()`.
- Siempre incluir `CI: true` como variable de entorno global.
- Usar acciones con tag `@v6` para checkout, setup-node y upload-artifact.
- El nombre del workflow debe ser descriptivo: `Cypress [Tipo] Tests`.
- El archivo va en `.github/workflows/` con nombre descriptivo en kebab-case.
