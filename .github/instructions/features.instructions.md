---
applyTo: "cypress/e2e/features/**"
---

# Instrucciones para Features Gherkin

- Escribe todos los pasos en **español**.
- Incluye tags: al menos `@regression` + un tag específico del módulo.
- Tags disponibles: `@regression`, `@smoke`, `@login`, `@purchaseFlow`, `@filters`, `@homePage`.
- Usa `Background` para los pasos comunes a todos los scenarios.
- Cada `Scenario` lleva un ID con formato `TC###` (ej: TC001, TC002).
- Los valores dinámicos van entre comillas: `"valor"`.
- Máximo 8-10 pasos por scenario para mantener legibilidad.
- Nombre del archivo en camelCase: `nombreFeature.feature`.
- Los step definitions correspondientes van en `cypress/e2e/step_definitions/` con sufijo `Steps.js`.
