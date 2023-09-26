import LoginPage from "cypress/support/login.po"

describe('Login E2E Tests ',()=>{

  let loginPage:LoginPage;

  beforeEach(()=>{
    loginPage=new LoginPage()
  })

  it('should login successfully',()=>{
    loginPage.navigate()
    loginPage.typeuserNameAndPassword('nik@gmail.com','NIKHIL@123')
    loginPage.clickOnLoginButton()
    cy.contains('PORTFOLIO').should('exist')
  })

  it('should handle error invalid username or password',()=>{
    loginPage.navigate()
    loginPage.typeuserNameAndPassword('nik@gmail.com','Nikhil@123')
    loginPage.clickOnLoginButton()
    cy.contains('User Name or password wrong').should('exist')
  })

})
