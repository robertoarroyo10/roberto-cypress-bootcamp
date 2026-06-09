/// <reference types="cypress" />
import LoginPage from '../../pages/LoginPage'

describe('Batería de pruebas de smoke sobre el login', () => {

  beforeEach(() => {
    LoginPage.visit()
    cy.get('[href="https://footer-back.onrender.com/api/auth/google"]').should('be.visible').and('contain', ' Continuar con Google ')
  })

  it('ID:TC001 - Verificar boton iniciar sesion está desactivado hasta que usuario y password están rellenos', () => {
    LoginPage.getByRouterLink('/forgot-password').should('have.attr','href',"/forgot-password").and('contain', '¿Olvidaste tu contraseña?')
    LoginPage.getByFormControl('email').should('have.value', '')
      .should("have.attr","placeholder","tu.email@ejemplo.com")
      .and('have.value', '')
    LoginPage.getByFormControl('password')
      .should("have.attr","placeholder","Introduce tu contraseña")
      .and('have.value', '')
    LoginPage.getByType('submit').last().should('be.disabled')

    LoginPage.typeEmail('cypress_bootcamp_2026@javi.com')
    LoginPage.getByFormControl('email').should('have.value', 'cypress_bootcamp_2026@javi.com')
    LoginPage.getByType('submit').last().should('be.disabled')

    LoginPage.clearEmail()
    LoginPage.getByFormControl('email').should('have.value', '')
    LoginPage.typePassword('1234Javi.')
    LoginPage.getByFormControl('password').should('have.value', '1234Javi.')
    LoginPage.getByType('submit').last().should('be.disabled')
  })

  it('ID:TC002 - login válido', () => {
    LoginPage.typeEmail('cypress_bootcamp_2026@javi.com')
    LoginPage.typePassword('1234Javi.')
    LoginPage.getByAriaLabel('Ver perfil de usuario').should('not.exist')
    LoginPage.getByAriaLabel('Cerrar sesión').should('not.exist')
    LoginPage.getByType('submit').last().should('be.enabled').click()
    LoginPage.getByAriaLabel('Ver perfil de usuario').should('be.visible')
    LoginPage.getByAriaLabel('Cerrar sesión').should('be.visible')
    cy.get('app-toast').should('contain', 'Inicio de sesión exitoso')
    cy.get('app-toast').should('not.be.visible', {timeout:20000})
  })

  it('ID:TC003 - usuario válido contraseña inválida', () => {
    LoginPage.typeEmail('cypress_bootcamp_2026@javi.com')
    LoginPage.typePassword('invalid password.')
    LoginPage.getByType('submit').last().should('be.enabled').and('contain', ' Iniciar sesión ').click()
    LoginPage.getByType('submit').last().should('be.disabled').and('contain', 'Accediendo...')
    cy.get('app-toast').should('contain', 'Credenciales inválidas')
    cy.get('app-toast').should('not.be.visible', {timeout:20000})
  })

  it('ID:TC004 - usuario inválido contraseña válida', () => {
    LoginPage.typeEmail('usuario_invalido@javi.com')
    LoginPage.typePassword('1234Javi.')
    LoginPage.getByType('submit').last().should('be.enabled').and('contain', ' Iniciar sesión ').click()
    LoginPage.getByType('submit').last().should('be.disabled').and('contain', 'Accediendo...')
    cy.get('app-toast').should('contain', 'Credenciales inválidas')
    cy.get('app-toast').should('not.be.visible', {timeout:20000})
  })

  it('ID:TC005 - Verificar visibilidad del campo contraseña', () => {
    LoginPage.getByAriaLabel('Toggle password visibility').should('be.visible')
    LoginPage.typePassword('1234Javi.')
    LoginPage.getByFormControl('password').should('have.attr', 'type', 'password')
    LoginPage.getByAriaLabel('Toggle password visibility').should('contain', 'visibility').click()
    LoginPage.getByFormControl('password').should('have.attr', 'type', 'text')
    LoginPage.getByAriaLabel('Toggle password visibility').should('contain', 'visibility_off').click()
    LoginPage.getByAriaLabel('Toggle password visibility').should('contain', 'visibility')
    LoginPage.getByFormControl('password').should('have.attr', 'type', 'password')
  })

  it('ID:TC006 - Verificar redireccion a la pagina de he olvidado mi contraseña', () => {
    cy.get('body').should('not.contain', 'Recuperar Contraseña')
    LoginPage.getByPlaceholder('Introduce tu dirección de email').should('not.exist')
    cy.contains('[type="submit"]', 'Enviar Enlace').should('not.exist')
    LoginPage.clickForgotPassword()
    cy.get('body').should('contain', 'Recuperar Contraseña')
    LoginPage.getByPlaceholder('Introduce tu dirección de email').should('be.visible')
    cy.contains('[type="submit"]', 'Enviar Enlace').should('be.visible')
  })

})
