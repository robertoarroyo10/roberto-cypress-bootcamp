import CommonPage from './CommonPage'

class ProductDetailPage extends CommonPage {

  // Acciones
  selectColor(colorName) {
    cy.contains('button', colorName).click()
  }

  selectSize(size) {
    cy.contains('button', size).click()
  }

  increaseQuantity() {
    cy.contains('button', '+').click()
  }

  decreaseQuantity() {
    cy.contains('button', '-').click()
  }

  clickBuyNow() {
    cy.contains('button', 'Comprar ahora').click()
  }

  clickAddToCart() {
    cy.contains('button', 'Añadir a la cesta').click()
  }

  clickSizeGuide() {
    cy.contains('button', 'Guía de tallas').click()
  }

  clickTab(tabName) {
    cy.contains('button', tabName).click()
  }

  clickViewImage(imageNumber) {
    this.getByAriaLabel(`Ver imagen ${imageNumber}`).click()
  }

  removeAllProductsFromCart() {
    this.getByHref("/cart").click();
    cy.url().should("include", "/cart");
    cy.get('body').should('contain', 'Mi Cesta de la Compra')
    cy.get('body').then(($body) => {
      const deleteButtons = $body.find('[aria-label="Eliminar producto"]')

      if (deleteButtons.length > 0) {
        cy.wrap(deleteButtons[0]).click()
        this.removeAllProductsFromCart()
      }
    })
  }

}

export default new ProductDetailPage()
