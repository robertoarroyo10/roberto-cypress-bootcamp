/// <reference types="cypress" />
import HomePage from '../../pages/HomePage'
import FiltersPage from '../../pages/FiltersPage'

describe('Batería de pruebas de smoke sobre los filtros', () => {

  beforeEach(() => {
    cy.visit('https://footer-shop.vercel.app/products')
  })

  it('ID:TC001 - Verificar que el panel de filtros se abre y se cierra correctamente', () => {
    FiltersPage.openFilters()
    cy.contains('h2', 'Filtros').should('be.visible')
    cy.contains('h3', 'Filtrar productos').should('be.visible')
    cy.contains('Material').should('be.visible')
    cy.contains('Género').should('be.visible')
    cy.contains('Marca').should('be.visible')
    cy.contains('Color').should('be.visible')
    cy.contains('Temporada').should('be.visible')
    cy.contains('button', 'Limpiar Filtros').should('be.visible')

    FiltersPage.closeFilters()
    cy.contains('h2', 'Filtros').should('not.exist')
  })

  it('ID:TC002 - Filtrar por marca Nike y verificar resultados', () => {
    FiltersPage.openFilters()
    FiltersPage.selectFilter('Nike')
    FiltersPage.clickShowProducts()

    cy.get('h1').should('contain', 'Todos los Productos')
    cy.contains('Mostrando').should('be.visible')
    cy.get('[class*="grid"] > div').should('have.length.greaterThan', 0)
    cy.get('[class*="grid"] > div').each(($card) => {
      cy.wrap($card).find('h3').invoke('text').should('match', /Nike/i)
    })
  })

  it('ID:TC003 - Filtrar por género Mujer y verificar que se aplica', () => {
    FiltersPage.openFilters()
    FiltersPage.selectFilter('Mujer')
    FiltersPage.clickShowProducts()

    cy.contains('Mostrando').should('be.visible')
    cy.get('[class*="grid"] > div').should('have.length.greaterThan', 0)
  })

  it('ID:TC004 - Aplicar múltiples filtros y limpiar', () => {
    FiltersPage.openFilters()
    FiltersPage.selectFilter('Nike')
    FiltersPage.selectFilter('Negro')
    FiltersPage.clickShowProducts()

    cy.contains('Mostrando').invoke('text').then((textFiltrado) => {
      const productosFiltrados = parseInt(textFiltrado.match(/\d+/)[0])

      FiltersPage.openFilters()
      FiltersPage.clearFilters()
      FiltersPage.clickShowProducts()

      cy.contains('Mostrando').invoke('text').then((textTotal) => {
        const productosTotal = parseInt(textTotal.match(/\d+/)[0])
        expect(productosTotal).to.be.greaterThan(productosFiltrados)
      })
    })
  })

  it('ID:TC005 - Ordenar productos por precio menor a mayor', () => {
    FiltersPage.sortBy('price_asc')

    cy.get('[class*="grid"] > div').should('have.length.greaterThan', 1)
    cy.get('[class*="grid"] > div p').filter(':contains("€")').then(($prices) => {
      const prices = [...$prices].map(el => parseFloat(el.textContent.replace('€', '').replace(',', '.')))
      for (let i = 1; i < prices.length; i++) {
        expect(prices[i]).to.be.at.least(prices[i - 1])
      }
    })
  })

  it('ID:TC006 - Ordenar productos por precio mayor a menor', () => {
    FiltersPage.sortBy('price_desc')

    cy.get('[class*="grid"] > div').should('have.length.greaterThan', 1)
    cy.get('[class*="grid"] > div p').filter(':contains("€")').then(($prices) => {
      const prices = [...$prices].map(el => parseFloat(el.textContent.replace('€', '').replace(',', '.')))
      for (let i = 1; i < prices.length; i++) {
        expect(prices[i]).to.be.at.most(prices[i - 1])
      }
    })
  })

  it('ID:TC007 - Filtrar por categoría desde la navegación', () => {
    HomePage.getByHref('/products/category/zapatillas').first().click()
    cy.url().should('include', '/products/category/zapatillas')
    cy.contains('Mostrando').should('be.visible')
    cy.get('[class*="grid"] > div').should('have.length.greaterThan', 0)

    cy.get('[class*="grid"] > div').first().find('p').first().should('contain', 'zapatillas')
  })

})
