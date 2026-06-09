/// <reference types="cypress" />
import LoginPage from '../../pages/LoginPage'
import ProductDetailPage from '../../pages/ProductDetailPage'
import HomePage from '../../pages/HomePage'

describe('Flujo completo de compra añadiendo productos de diferentes tipos', () => {

  beforeEach(() => {
    // Login antes de cada test
    LoginPage.visit()
    LoginPage.login('cypress_bootcamp_2026@javi.com', '1234Javi.')
    cy.get('app-toast').should('contain', 'Inicio de sesión exitoso')
    cy.get('app-toast', { timeout: 20000 }).should('not.be.visible')
  })

  it('ID:TC001 - Añadir zapatilla, ropa y complemento al carrito y verificar el resumen', () => {
    // 1. Añadir zapatilla (Nike Air Force 1)
    HomePage.navigateToProduct('Nike Air Force 1')
    cy.get('h1').should('contain', 'Nike Air Force 1')
    ProductDetailPage.selectSize('40')
    cy.contains('button', 'Añadir a la cesta').should('be.enabled')
    ProductDetailPage.clickAddToCart()
    cy.get('app-toast').should('contain', '¡Producto añadido a la cesta!')
    cy.get('app-toast', { timeout: 20000 }).should('not.be.visible')

    // 2. Añadir ropa (Nike Tech Fleece)
    HomePage.navigateToProduct('Nike Tech Fleece')
    cy.get('h1').should('contain', 'Nike Tech Fleece')
    ProductDetailPage.selectSize('M')
    cy.contains('button', 'Añadir a la cesta').should('be.enabled')
    ProductDetailPage.clickAddToCart()
    cy.get('app-toast').should('contain', '¡Producto añadido a la cesta!')
    cy.get('app-toast', { timeout: 20000 }).should('not.be.visible')

    // 3. Añadir complemento (New Era 9Forty)
    HomePage.navigateToProduct('New Era 9Forty')
    cy.get('h1').should('contain', 'New Era 9Forty')
    ProductDetailPage.selectSize('Talla Única')
    cy.contains('button', 'Añadir a la cesta').should('be.enabled')
    ProductDetailPage.clickAddToCart()
    cy.get('app-toast').should('contain', '¡Producto añadido a la cesta!')
    cy.get('app-toast', { timeout: 20000 }).should('not.be.visible')

    // 4. Ir al carrito y verificar los 3 productos
    ProductDetailPage.getByHref('/cart').click()
    cy.url().should('include', '/cart')
    cy.get('h1').should('contain', 'Mi Cesta de la Compra')

    cy.contains('Nike Air Force 1').should('be.visible')
    cy.contains('Nike Tech Fleece').should('be.visible')
    cy.contains('New Era 9Forty').should('be.visible')

    // 5. Verificar resumen del pedido
    cy.contains('h2', 'Resumen del Pedido').should('be.visible')
    cy.contains('Base Imponible').should('be.visible')
    cy.contains('IVA (21%)').should('be.visible')
    cy.contains('Total').should('be.visible')

    // 6. Limpiar carrito - eliminar los 3 productos
    cy.get('[aria-label="Eliminar producto"]').should('have.length', 3)
    cy.get('[aria-label="Eliminar producto"]').first().click()
    cy.get('[aria-label="Eliminar producto"]').first().click()
    cy.get('[aria-label="Eliminar producto"]').first().click()
    cy.contains('h2', 'Tu cesta está vacía').should('be.visible')
  })

  it('ID:TC002 - Modificar cantidad de un producto en el carrito', () => {
    // Añadir un producto
    HomePage.navigateToProduct('Nike Air Force 1')
    cy.get('h1').should('contain', 'Nike Air Force 1')
    ProductDetailPage.selectSize('42')
    ProductDetailPage.clickAddToCart()
    cy.get('app-toast').should('contain', '¡Producto añadido a la cesta!')
    cy.get('app-toast', { timeout: 20000 }).should('not.be.visible')

    // Ir al carrito
    ProductDetailPage.getByHref('/cart').click()
    cy.url().should('include', '/cart')

    // Verificar cantidad inicial
    cy.contains('Nike Air Force 1').should('be.visible')
    cy.get('[aria-label="Aumentar cantidad"]').click()
    cy.get('[aria-label="Aumentar cantidad"]').click()

    // Reducir cantidad
    cy.get('[aria-label="Reducir cantidad"]').click()

    // Limpiar carrito
    cy.get('[aria-label="Eliminar producto"]').first().click()
    cy.contains('h2', 'Tu cesta está vacía').should('be.visible')
  })

})
