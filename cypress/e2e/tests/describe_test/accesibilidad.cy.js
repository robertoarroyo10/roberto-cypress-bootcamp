/// <reference types="cypress" />

describe('Accesibilidad - Footer Shop', () => {
  beforeEach(() => {
    Cypress.on('uncaught:exception', () => false);
  });

  it('La página de productos cumple accesibilidad (por defecto)', () => {
    cy.visit('https://footer-shop.vercel.app/products');
    cy.checkAccessibility();
  });

  it('La página de productos - solo WCAG 2.1 AA y solo errores críticos', () => {
    cy.visit('https://footer-shop.vercel.app/products');
    cy.checkAccessibility(null, {
      // Solo fallará el test si hay errores de impacto "critical"
      includedImpacts: ['critical'],
      // Solo ejecuta reglas de WCAG 2.1 AA
      runOnly: ['wcag21aa'],
      // Genera un reporte HTML básico (más ligero)
      generateReport: 'basic',
      // Reintenta el análisis una vez si encuentra errores
      retries: 1,
      // Espera 1500ms entre reintentos
      interval: 1500,
    });
  });

  it('La home de Banco Santander cumple accesibilidad (por defecto)', () => {
    cy.visit('https://www.bancosantander.es/particulares');
    cy.contains('ACEPTAR').click({force: true});
    cy.checkAccessibility();
  });

  it('Banco Santander - advertencia para errores menores, ignora color-contrast', () => {
    cy.visit('https://www.bancosantander.es/particulares');
    cy.contains('ACEPTAR').click({force: true});
    cy.checkAccessibility(null, {
      // Fallará solo con errores críticos o serios
      // includedImpacts: ['critical', 'serious'],
      // Los errores "moderate" y "minor" solo mostrarán advertencia, no fallan el test
      onlyWarnImpacts: ['critical', 'serious', 'moderate', 'minor'],
      // Desactiva la regla de contraste de color
      rules: { 'color-contrast': { enabled: false } },
      // Genera un reporte HTML detallado
      generateReport: 'detailed',
      // Reintenta el análisis dos veces si encuentra errores
      retries: 2,
      // Espera 2000ms entre reintentos
      interval: 2000,
    });
  });



  it('La home de Junta de Andalucía cumple accesibilidad (por defecto)', () => {
    cy.visit('https://www.juntadeandalucia.es/');
    cy.checkAccessibility();
  });

  it('Junta de Andalucía - solo best-practice, reporte básico, ignora valid-lang', () => {
    cy.visit('https://www.juntadeandalucia.es/');
    cy.checkAccessibility(null, {
      // Solo ejecuta reglas de buenas prácticas
      runOnly: ['best-practice'],
      // Desactiva la regla de idioma válido
      rules: { 'valid-lang': { enabled: false } },
      // Genera un reporte HTML básico
      generateReport: 'basic',
      // Considera todas las severidades como fallos
      includedImpacts: ['critical', 'serious', 'moderate', 'minor'],
      // Reintenta el análisis una vez si encuentra errores
      retries: 1,
      // Espera 1000ms entre reintentos
      interval: 1000,
    });
  });

});
