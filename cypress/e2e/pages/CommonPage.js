class CommonPage {

  // Métodos genéricos de selección

  getByAttribute(attr, value) {
    return cy.get(`[${attr}="${value}"]`)
  }

  getByAriaLabel(label) {
    return cy.get(`[aria-label="${label}"]`)
  }

  getByHref(path) {
    return cy.get(`[href="${path}"]`)
  }

  getByType(type) {
     return cy.get(`[type="${type}"]`)
  }

  getByPlaceholder(placeholder) {
    return cy.get(`[placeholder="${placeholder}"]`)
  }

  getByFormControl(name) {
    return cy.get(`[formcontrolname="${name}"]`)
  }

  getByRouterLink(route) {
    return cy.get(`[routerlink="${route}"]`)
  }

  getByToastMessage(message) {

   //Hace lo mismo que la de abajo return cy.get(`app-toast:contains("${message}")`, {timeout: 7000})
    return cy.contains('app-toast', message, {timeout: 7000})
  }

  // Acciones comunes
  searchProduct(productName) {
   cy.get('input[name="search"]').clear().type(productName + '{enter}')
  }

  clickPage(pageNumber) {
    this.getByAriaLabel(`Ir a la página ${pageNumber}`).click()
  }

  clickProductCard(productName) {
    cy.contains('app-product-card', productName).click()
    cy.get('h1').should('contain', productName)
  }

  navigateToProduct(productName) {
    this.searchProduct(productName)
    this.clickProductCard(productName)
  }

  clickByAttribute(attr, value) {
    this.getByAttribute(attr, value).click()
  }

  typeByAttribute(attr, value, text) {
    this.getByAttribute(attr, value).type(text)
  }


  // Aserciones comunes
  assertToastMessage(message) {
    this.getByToastMessage(message).should('be.visible')
    this.getByToastMessage(message).should('not.exist')
  }

  assetByAttribute(attr, value, assertion) {
    this.getByAttribute(attr, value).should(assertion)
  }

  buttonStateByContent(content, state) {
    cy.contains('button', content).should(state)
  }
}

export default CommonPage
