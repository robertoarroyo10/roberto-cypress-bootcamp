import CommonPage from './CommonPage'

class FiltersPage extends CommonPage {

  // Acciones
  openFilters() {
    cy.contains('button', 'Filtrar').click()
  }

  closeFilters() {
    this.getByAriaLabel('Cerrar menú de filtros').click()
  }

  clearFilters() {
    cy.contains('button', 'Limpiar Filtros').click()
  }

  clearFiltersFromResults() {
    cy.contains('button', 'Limpiar filtros').click()
  }

  selectFilter(filterValue) {
    cy.contains(filterValue).click()
  }

  clickShowProducts() {
    cy.get('button').filter(':contains("productos")').click()
  }

  sortBy(value) {
    this.getByAriaLabel('Ordenar productos').select(value)
  }

}

export default new FiltersPage()
