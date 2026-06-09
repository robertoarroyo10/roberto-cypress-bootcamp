import CommonPage from './CommonPage'

class CheckoutPage extends CommonPage {

  // Helper para acceder al body de un iframe
  getIframeBody(iframeSelector) {
    return cy.get(iframeSelector, { timeout: 30000 })
      .its('0.contentDocument.body')
      .should('not.be.empty')
      .then(cy.wrap)
  }

  // Rellenar el campo de email
  fillEmail(email) {
    cy.get('#email', { timeout: 30000 }).clear().type(email)
  }

  // Rellenar el número de tarjeta (dentro de iframe de Stripe Elements)
  fillCardNumber(cardNumber) {
    cy.get('[name="cardNumber"]')
      .type(cardNumber)
  }

  // Rellenar la fecha de expiración (dentro de iframe de Stripe Elements)
  fillCardExpiry(expiry) {
    cy.get('[name="cardExpiry"]')
      .type(expiry)
  }

  // Rellenar el CVC (dentro de iframe de Stripe Elements)
  fillCardCvc(cvc) {
    cy.get('[name="cardCvc"]')
      .type(cvc)
  }

  // Rellenar el nombre del titular
  fillCardholderName(name) {
    cy.get('#billingName', { timeout: 30000 }).clear().type(name)
  }

  // Rellenar todos los datos de pago desde el fixture
  fillPaymentForm(cardData) {
    this.fillEmail(cardData.email)
    this.fillCardNumber(cardData['card number'])
    this.fillCardExpiry(cardData['card date'])
    this.fillCardCvc(cardData['cvc number'])
    this.fillCardholderName(cardData['Cardholder name'])
  }

  // Hacer click en el botón Pay
  clickPay() {
    cy.get('.SubmitButton', { timeout: 30000 }).click()
  }

  // Rellenar todos los datos y hacer click en Pay
  completePayment(cardData) {
    this.fillPaymentForm(cardData)
    this.clickPay()
  }

  clickBuyNow() {
    cy.contains("button", "Pagar de forma segura").click()
  }
}

export default new CheckoutPage()
