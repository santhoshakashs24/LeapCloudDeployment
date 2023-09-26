export default class LoginPage{

  navigate(){
    cy.visit('/')
  }

  typeuserNameAndPassword(username:string,password:string){
    cy.get('button').contains('Log in').should('be.disabled')
    cy.get('app-login-form input#username').type(username)
    cy.get('app-login-form input#password').type(password)
    cy.get('button').contains('Log in').should('not.be.disabled')
  }

  clickOnLoginButton(){
    cy.get('button').contains('Log in',{timeout:1500}).click()
  }

}
