/// <reference types="cypress" />
import LoginPage from '../../pages/LoginPage'
import HomePage from '../../pages/HomePage'
import ProductDetailPage from '../../pages/ProductDetailPage'
import CheckoutPage from '../../pages/CheckoutPage'

describe('Stripe Checkout - Flujo completo de compra', () => {

  beforeEach(() => {
    // Ignorar errores internos de Stripe (expressCheckout no monta en Cypress)
    Cypress.on('uncaught:exception', (err) => {
      if (err.message.includes('expressCheckout Element didn\'t mount normally')) {
        return false
      }
    })
  })

  it('Debe completar el flujo de compra desde login hasta pago en Stripe', () => {
    // 1. Login
    LoginPage.visit()
    LoginPage.login()

    // 2. Buscar y seleccionar producto
    HomePage.navigateToProduct('Nike Phoenix Oversized')
    cy.get('h1').should('contain', 'Nike Phoenix Oversized')

    // 3. Seleccionar color y talla
    ProductDetailPage.selectSize('L')

    // 4. Comprar ahora → redirige a Stripe
    ProductDetailPage.clickBuyNow()

    CheckoutPage.clickBuyNow()

    // 5. Verificar que estamos en Stripe Checkout
    cy.origin('https://checkout.stripe.com', () => {
      // Ignorar errores internos de Stripe en este dominio
      Cypress.on('uncaught:exception', (err) => {
        if (err.message.includes('expressCheckout Element didn\'t mount normally')) {
          return false
        }
      })

      // Verificar resumen del producto
      cy.get('[data-testid="product-summary-name"]', { timeout: 30000 })
        .should('contain', 'Nike Phoenix Oversized (Negro / L)')

      cy.get('[data-testid="product-summary-total-amount"]')
        .should('contain', '€64.99')

      // Rellenar datos de pago
      cy.get('#email', { timeout: 30000 }).clear().type('cypress_bootcamp_2026@javi.com')

      cy.get('[name="cardNumber"]').type('4242424242424242')
      cy.get('[name="cardExpiry"]').type('05 / 30')
      cy.get('[name="cardCvc"]').type('123')
      cy.get('#billingName').clear().type('Javi Flores')

      // Click en Pay
      cy.get('.SubmitButton', { timeout: 30000 }).click()
    })

    // 6. Verificar página de confirmación
    cy.url({ timeout: 30000 }).should('include', '/confirmation')
    cy.contains('¡Compra Realizada!').should('be.visible')

    // 7. Ir a mis pedidos
    cy.contains('a', 'Ir a mis pedidos').click()
    cy.url().should('include', '/profile/orders')

    // 8. Verificar página de pedidos
    cy.contains('Bienvenido, Javi').should('be.visible')
    cy.contains('Historial de Pedidos').should('be.visible')

    // 9. Verificar que el último pedido contiene el producto comprado
      cy.contains('Nike Phoenix Oversized (Negro / L)').should('be.visible')
      cy.contains('1 x €64.99').should('be.visible')
  })
})
