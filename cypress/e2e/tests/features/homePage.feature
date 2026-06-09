@regression @homePage
Feature: Página Principal

  Background:
    Given I login and keep the sesion
    And I visit the main page

  @smoke
  Scenario: TC001 - Verificar elementos visibles del header, cuerpo principal y footer
    # Header
    Given el header contiene el título "Footer"
    And el buscador de productos es visible con placeholder "Buscar productos..."
    And el enlace "Todos" a "/products" es visible en el header
    And el enlace "Zapatillas" a "/products/category/zapatillas" es visible en el header
    And el enlace "Ropa" a "/products/category/ropa" es visible en el header
    And el enlace "Complementos" a "/products/category/complementos" es visible en el header
    # Cuerpo principal - Hero
    And el título principal muestra "Define Tu Estilo. Conquista la Calle."
    And el botón "Descubre la Colección" es visible
    # Categorías
    And el subtítulo "Categorías Destacadas" es visible
    And la categoría "Zapatillas" es visible
    And la categoría "Ropa" es visible
    And la categoría "Complementos" es visible
    # Novedades
    And el subtítulo "Novedades" es visible
    # Footer
    And el footer contiene la sección "Tienda"
    And el footer contiene la sección "Empresa"
    And el footer contiene la sección "Ayuda"
    And el footer contiene el enlace "Sobre Nosotros" a "/about"
    And el footer contiene el enlace "Contacto" a "/contact"
    And el footer contiene el enlace "Envíos y Devoluciones" a "/shipping"
    And el footer contiene el enlace "Preguntas Frecuentes" a "/faq"
    And el footer contiene el enlace "Aviso Legal" a "/legal-notice"
    And el footer contiene el enlace "Privacidad" a "/privacy"
    And el footer muestra "© 2026 Footer. Todos los derechos reservados."

  @smoke
  Scenario: TC002 - Buscar "Nike", comprobar resultados, ir a página 3 y hacer click sobre el último elemento
    When el usuario busca "Nike"
    Then la URL contiene "name=Nike"
    And el título muestra 'Resultados para "Nike"'
    And se muestran 40 productos en total
    And se muestran 16 productos en la página
    When el usuario navega a la página 3
    And el usuario hace clic en el último producto
    Then la URL contiene "/products/product/"

  Scenario: TC003 - Buscar producto sin resultados y limpiar filtros
    When el usuario busca "ProductoQueNoExisteXYZ123"
    Then la URL contiene "name=ProductoQueNoExisteXYZ123"
    And el título muestra 'Resultados para "ProductoQueNoExisteXYZ123"'
    And se muestran 0 productos en total
    And aparece el mensaje "No se encontraron productos"
    And aparece el mensaje "Intenta ajustar los filtros o busca otro término."
    When el usuario limpia los filtros desde resultados
    Then no se muestran 0 productos
    And el título no contiene "ProductoQueNoExisteXYZ123"
