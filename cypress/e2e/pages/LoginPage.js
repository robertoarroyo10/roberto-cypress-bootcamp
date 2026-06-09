import CommonPage from './CommonPage'

class LoginPage extends CommonPage {

  // Acciones
  visit() {
    cy.visit('https://footer-shop.vercel.app/login')
  }

  typeEmail(email) {
    this.getByFormControl('email').type(email)
  }

  typePassword(password) {
    this.getByFormControl('password').type(password)
  }

  clearEmail() {
    this.getByFormControl('email').clear()
  }
  
  clickSubmit() {
    this.getByType('submit').last().click()
  }

  clickForgotPassword() {
    this.getByRouterLink('/forgot-password').click()
  }

  clickTogglePasswordVisibility() {
    this.getByAriaLabel('Toggle password visibility').click()
  }

  login() {
    cy.fixture('login_form').then((loginData) => {
      this.typeEmail(loginData.email)
      this.typePassword(loginData.password)
      this.clickSubmit()
      cy.url().should('not.include', '/login').and('include', '/home')
      this.assertToastMessage('Inicio de sesión exitoso')
    })
  }

  openSession() {
    cy.session('loginSession', () => {
      this.visit(); // Visita la URL de inicio de sesión
      this.login(); // Logueado utilizando los datos del fixture
    });
  }

  visitMain() {
    cy.visit('https://footer-shop.vercel.app/')
  }

}

export default new LoginPage()
