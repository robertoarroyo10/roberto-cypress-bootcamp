/// <reference types="cypress" />
import HomePage from '../../pages/HomePage'
import FiltersPage from '../../pages/FiltersPage'

describe('Batería de pruebas de smoke sobre la página principal', () => {

  beforeEach(() => {
    HomePage.visit()
  })

  it('ID:TC001 - Verificar elementos visibles del header, cuerpo principal y footer', () => {
    // Header
    cy.get('header').within(() => {
      cy.get('h2').should('contain', 'Footer')
      // Esto es igual que la de abajo
      // cy.get('input[name="search"]').should('be.visible').and('have.attr', 'placeholder', 'Buscar productos...')
      HomePage.getByAttribute('name', 'search').should('be.visible').and('have.attr', 'placeholder', 'Buscar productos...')
      HomePage.getByHref('/login').should('be.visible')
      HomePage.getByHref('/products').should('be.visible').and('contain', 'Todos')
      HomePage.getByHref('/products/category/zapatillas').should('be.visible').and('contain', 'Zapatillas')
      HomePage.getByHref('/products/category/ropa').should('be.visible').and('contain', 'Ropa')
      HomePage.getByHref('/products/category/complementos').should('be.visible').and('contain', 'Complementos')
    })

    // Cuerpo principal - Hero
    cy.get('h1').should('be.visible').and('contain', 'Define Tu Estilo. Conquista la Calle.')
    cy.contains('Descubre la Colección').should('be.visible')

    // Cuerpo principal - Categorías
    cy.contains('h2', 'Categorías Destacadas').should('be.visible')
    cy.contains('h3', 'Zapatillas').should('be.visible')
    cy.contains('h3', 'Ropa').should('be.visible')
    cy.contains('h3', 'Complementos').should('be.visible')

    // Cuerpo principal - Novedades
    cy.contains('h2', 'Novedades').should('be.visible')

    // Footer
    cy.get('footer').within(() => {
      cy.contains('h3', 'Tienda').should('be.visible')
      cy.contains('h3', 'Empresa').should('be.visible')
      cy.contains('h3', 'Ayuda').should('be.visible')
      HomePage.getByHref('/about').should('be.visible').and('contain', 'Sobre Nosotros')
      HomePage.getByHref('/contact').should('be.visible').and('contain', 'Contacto')
      HomePage.getByHref('/shipping').should('be.visible').and('contain', 'Envíos y Devoluciones')
      HomePage.getByHref('/faq').should('be.visible').and('contain', 'Preguntas Frecuentes')
      HomePage.getByHref('/legal-notice').should('be.visible').and('contain', 'Aviso Legal')
      HomePage.getByHref('/privacy').should('be.visible').and('contain', 'Privacidad')
      cy.contains('© 2026 Footer. Todos los derechos reservados.').should('be.visible')
    })
  })

  it('ID:TC002 - Buscar "Nike", comprobar resultados, ir a página 3 y hacer click sobre el último elemento', () => {
    HomePage.searchProduct('Nike')

    cy.url().should('include', 'name=Nike')
    cy.get('h1').should('contain', 'Resultados para "Nike"')
    cy.contains('Mostrando 40 productos').should('be.visible')

    // Comprobar que se muestran 16 productos en la primera página
    cy.get('app-product-card').should('have.length', 16)

    // Ir a la página 3
    HomePage.clickPage(3)

    // Hacer click sobre el último producto de la página 3
    HomePage.clickProductCard('Nike Club')

    // Verificar que se navega a la página de detalle del producto
    cy.url().should('include', '/products/product/')
    HomePage.buttonStateByContent('Comprar ahora', 'be.disabled')
    HomePage.buttonStateByContent('Añadir a la cesta', 'be.disabled')
  })

  it.only('ID:TC003 - Buscar producto sin resultados y limpiar filtros', () => {
    HomePage.searchProduct('ProductoQueNoExisteXYZ123')

    cy.url().should('include', 'name=ProductoQueNoExisteXYZ123')
    cy.get('h1').should('contain', 'Resultados para "ProductoQueNoExisteXYZ123"')
    cy.contains('Mostrando 0 productos').should('be.visible')
    cy.contains('h3', 'No se encontraron productos').should('be.visible')
    cy.contains('Intenta ajustar los filtros o busca otro término.').should('be.visible')

    // Limpiar filtros
    FiltersPage.clearFiltersFromResults()

    // Verificar que se muestran productos de nuevo
    cy.contains('Mostrando 0 productos').should('not.exist')
    cy.get('h1').should('not.contain', 'ProductoQueNoExisteXYZ123')
  })

})
