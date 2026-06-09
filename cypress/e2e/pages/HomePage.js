import CommonPage from './CommonPage'

class HomePage extends CommonPage {

  // Acciones
  visit() {
    cy.visit('https://footer-shop.vercel.app/home')
    this.getByPlaceholder('Buscar productos...').should('be.visible')
  }

  clickDiscoverCollection() {
    this.getByHref('/products').first().click()
  }

  clickCategory(category) {
    this.getByHref(`/products/category/${category}`).first().click()
  }

  clickLogin() {
    this.getByHref('/login').click()
  }

}

export default new HomePage()
