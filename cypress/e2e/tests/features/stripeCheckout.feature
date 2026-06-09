@regression @stripeCheckout
Feature: Flujo completo de compra con Stripe Checkout

  Background:
    Given el usuario inicia sesión con credenciales del fixture

  Scenario: TC001 - Compra completa de un producto con pago en Stripe
    # Seleccionar producto
    When el usuario busca y selecciona el producto "Nike Phoenix Oversized"
    Then el título del producto es "Nike Phoenix Oversized"
    When el usuario selecciona la talla "L"

    # Comprar ahora
    And el usuario hace click en comprar ahora
    And el usuario confirma la compra

    # Stripe Checkout
    Then la página de Stripe muestra el producto "Nike Phoenix Oversized (Negro / L)"
    And la página de Stripe muestra el total "€64.99"
    When el usuario rellena los datos de pago con el fixture
    And el usuario hace click en pagar

    # Confirmación
    Then la URL contiene "/confirmation"
    And se muestra "¡Compra Realizada!"

    # Ir a pedidos
    When el usuario hace click en ir a mis pedidos
    Then la URL contiene "/profile/orders"
    And se muestra "Bienvenido, Javi"
    And se muestra "Historial de Pedidos"
    And el último pedido contiene "Nike Phoenix Oversized (Negro / L)"
    And el último pedido contiene "1 x €64.99"
