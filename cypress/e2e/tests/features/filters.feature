@regression @filters
Feature: Filtros de Productos

  Background:
    Given el usuario está en la página de productos

  @smoke
  Scenario: TC001 - Verificar que el panel de filtros se abre y se cierra correctamente
    When el usuario abre el panel de filtros
    Then el panel de filtros muestra el título "Filtros"
    And el panel muestra el subtítulo "Filtrar productos"
    And la opción de filtro "Material" es visible
    And la opción de filtro "Género" es visible
    And la opción de filtro "Marca" es visible
    And la opción de filtro "Color" es visible
    And la opción de filtro "Temporada" es visible
    And el botón "Limpiar Filtros" es visible en filtros
    When el usuario cierra el panel de filtros
    Then el panel de filtros no es visible

  Scenario: TC002 - Filtrar por marca Nike y verificar resultados
    When el usuario abre el panel de filtros
    And el usuario selecciona el filtro "Nike"
    And el usuario hace clic en mostrar productos
    Then el título de la página contiene "Todos los Productos"
    And el contador de productos es visible
    And hay productos en la cuadrícula
    And todos los productos contienen "Nike" en el nombre

  Scenario: TC003 - Filtrar por género Mujer y verificar que se aplica
    When el usuario abre el panel de filtros
    And el usuario selecciona el filtro "Mujer"
    And el usuario hace clic en mostrar productos
    Then el contador de productos es visible
    And hay productos en la cuadrícula

  Scenario: TC004 - Aplicar múltiples filtros y limpiar
    When el usuario abre el panel de filtros
    And el usuario selecciona el filtro "Nike"
    And el usuario selecciona el filtro "Negro"
    And el usuario hace clic en mostrar productos
    Then hay productos filtrados
    When el usuario abre el panel de filtros
    And el usuario limpia los filtros
    And el usuario hace clic en mostrar productos
    Then hay más productos que antes del limpiado

  Scenario: TC005 - Ordenar productos por precio menor a mayor
    When el usuario ordena por "price_asc"
    Then hay productos en la cuadrícula
    And los precios están ordenados de menor a mayor

  Scenario: TC006 - Ordenar productos por precio mayor a menor
    When el usuario ordena por "price_desc"
    Then hay productos en la cuadrícula
    And los precios están ordenados de mayor a menor

  Scenario: TC007 - Filtrar por categoría desde la navegación
    When el usuario hace clic en la categoría "zapatillas"
    Then la URL contiene "/products/category/zapatillas"
    And el contador de productos es visible
    And hay productos en la cuadrícula
    And el primer producto es de categoría "zapatillas"
