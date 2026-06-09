@regression @purchaseFlow
Feature: Flujo de Compra


  Background:
    Given I login and keep the sesion
    And I visit the main page

  Scenario: TC001 - Añadir zapatilla y ropa al carrito y verificar el resumen
    # Zapatilla
    When el usuario busca y selecciona el producto "Nike Air Force 1"
    Then el título del producto es "Nike Air Force 1"
    When el usuario selecciona la talla "40"
    And el usuario añade el producto al carrito
    Then aparece el toast "¡Producto añadido a la cesta!"
    And el toast desaparece

    # Ropa
    When el usuario busca y selecciona el producto "Nike Tech Fleece"
    Then el título del producto es "Nike Tech Fleece"
    When el usuario selecciona la talla "M"
    And el usuario añade el producto al carrito
    Then aparece el toast "¡Producto añadido a la cesta!"
    And el toast desaparece

    # Verificar carrito
    When el usuario va al carrito
    Then la URL contiene "/cart"
    And el título de la página es "Mi Cesta de la Compra"
    And el producto "Nike Air Force 1" está en el carrito
    And el producto "Nike Tech Fleece" está en el carrito
    And se muestra "Base Imponible"
    And se muestra "IVA (21%)"
    And se muestra "Total"

    # Limpiar carrito
    Then hay 2 botones de eliminar producto
    When el usuario elimina el primer producto del carrito
    And el usuario elimina el primer producto del carrito
    Then el carrito está vacío

  Scenario: TC002 - Modificar cantidad de un producto en el carrito
    When el usuario busca y selecciona el producto "Nike Air Force 1"
    Then el título del producto es "Nike Air Force 1"
    When el usuario selecciona la talla "42"
    And el usuario añade el producto al carrito
    Then aparece el toast "¡Producto añadido a la cesta!"
    And el toast desaparece

    When el usuario va al carrito
    Then la URL contiene "/cart"
    And el producto "Nike Air Force 1" está en el carrito

    When el usuario aumenta la cantidad del producto
    And el usuario aumenta la cantidad del producto
    And el usuario reduce la cantidad del producto

    # Limpiar
    When el usuario elimina el primer producto del carrito
    Then el carrito está vacío

  @smoke
  Scenario: TC004 - Flujo de compra: agregar productos y redirigir a pago
    # Paso 1: Agregar zapatilla
    When el usuario busca y selecciona el producto "Nike Air Force 1"
    Then el título del producto es "Nike Air Force 1"
    When el usuario selecciona la talla "40"
    And el usuario añade el producto al carrito
    Then aparece el toast "¡Producto añadido a la cesta!"
    And el toast desaparece

    # Paso 2: Agregar ropa
    When el usuario busca y selecciona el producto "Nike Tech Fleece"
    Then el título del producto es "Nike Tech Fleece"
    When el usuario selecciona la talla "L"
    And el usuario añade el producto al carrito
    Then aparece el toast "¡Producto añadido a la cesta!"
    And el toast desaparece

    # Paso 3: Agregar complemento
    When el usuario busca y selecciona el producto "New Era 9Forty"
    Then el título del producto es "New Era 9Forty"
    When el usuario selecciona la talla "Talla Única"
    And el usuario añade el producto al carrito
    Then aparece el toast "¡Producto añadido a la cesta!"
    And el toast desaparece

    # Paso 4: Ir al carrito y verificar productos
    When el usuario va al carrito
    Then la URL contiene "/cart"
    And el título de la página es "Mi Cesta de la Compra"
    And el producto "Nike Air Force 1" está en el carrito
    And el producto "Nike Tech Fleece" está en el carrito
    And el producto "New Era 9Forty" está en el carrito
    And se muestra "Base Imponible"
    And se muestra "IVA (21%)"
    And se muestra "Total"

    # Paso 5: Seleccionar método de envío
    When el usuario selecciona el envío "Estándar (48/72h)"
    Then el botón "Pagar de forma segura" está habilitado

    # Paso 6: Proceder al pago
    When el usuario hace clic en "Pagar de forma segura"
    Then la URL contiene "stripe.com"
