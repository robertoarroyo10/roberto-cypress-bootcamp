@regression @login
Feature: La funcionalidad del login

  Background:
    Given el usuario está en la página de login
    And el botón de Google es visible con texto "Continuar con Google"

  Scenario: TC001 - Verificar botón iniciar sesión está desactivado hasta que usuario y password están rellenos
    Then el enlace "¿Olvidaste tu contraseña?" apunta a "/forgot-password"
    And el campo email tiene placeholder "tu.email@ejemplo.com" y está vacío
    And el campo password tiene placeholder "Introduce tu contraseña" y está vacío
    And el botón de submit está deshabilitado
    When el usuario escribe el email "cypress_bootcamp_2026@javi.com"
    Then el campo email tiene el valor "cypress_bootcamp_2026@javi.com"
    And el botón de submit está deshabilitado
    When el usuario limpia el campo email
    And el usuario escribe la contraseña "1234Javi."
    Then el campo password tiene el valor "1234Javi."
    And el botón de submit está deshabilitado

  @smoke
  Scenario: TC002 - Login válido
    When el usuario escribe el email "cypress_bootcamp_2026@javi.com"
    And el usuario escribe la contraseña "1234Javi."
    Then el icono de perfil no existe
    And el icono de cerrar sesión no existe
    When el usuario hace clic en el botón de login
    Then el icono de perfil es visible
    And el icono de cerrar sesión es visible
    And aparece el toast "Inicio de sesión exitoso"
    And el toast desaparece

  @smoke
  Scenario: TC003 - Usuario válido contraseña inválida
    When el usuario escribe el email "cypress_bootcamp_2026@javi.com"
    And el usuario escribe la contraseña "invalid password."
    And el usuario hace clic en el botón de login
    Then el botón de submit muestra "Accediendo..." y está deshabilitado
    And aparece el toast "Credenciales inválidas"
    And el toast desaparece

  Scenario: TC004 - Usuario inválido contraseña válida
    When el usuario escribe el email "usuario_invalido@javi.com"
    And el usuario escribe la contraseña "1234Javi."
    And el usuario hace clic en el botón de login
    Then el botón de submit muestra "Accediendo..." y está deshabilitado
    And aparece el toast "Credenciales inválidas"
    And el toast desaparece

  Scenario: TC005 - Verificar visibilidad del campo contraseña
    Then el botón de toggle password es visible
    When el usuario escribe la contraseña "1234Javi."
    Then el campo password es de tipo "password"
    When el usuario hace clic en el toggle de visibilidad
    Then el campo password es de tipo "text"
    And el toggle muestra "visibility_off"
    When el usuario hace clic en el toggle de visibilidad
    Then el toggle muestra "visibility"
    And el campo password es de tipo "password"

  Scenario: TC006 - Verificar redirección a la página de olvidé mi contraseña
    Then la página no contiene el texto "Recuperar Contraseña"
    And el campo con placeholder "Introduce tu dirección de email" no existe
    And el botón submit "Enviar Enlace" no existe
    When el usuario hace clic en el enlace "¿Olvidaste tu contraseña?"
    Then la página contiene el texto "Recuperar Contraseña"
    And el campo con placeholder "Introduce tu dirección de email" es visible
    And el botón submit "Enviar Enlace" es visible
