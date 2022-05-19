context('The Happy Path', () => {
  beforeEach(() => {
    cy.visit('localhost:3000');
  })

  it('The Happy Path is Successful', () => {
    const name = 'joe';
    const email = 'joe@email.com';
    const password = 'password1';
    const quizName = 'New Quiz';
    const newQuizName = 'New Quiz2';

    // Go to register page
    cy.get('a[href="/register"')
      .click()

    // Type email
    cy.get('input[name=email]')
      .focus()
      .type(email)

    // Type name
    cy.get('input[name=name]')
      .focus()
      .type(name)

    // Type password
    cy.get('input[name=password]')
      .focus()
      .type(password)

    // Click submit
    cy.get('button[type=submit]')
      .click()

    // Type new quiz name
    cy.get('input[name=create-quiz]')
      .focus()
      .type(quizName)

    // Click create new quiz
    cy.get('button[type=submit]')
      .click()

    // Click edit quiz
    cy.get('button[id=edit-quiz]')
      .click()

    // Type new quiz name
    cy.get('input[id=edit-quiz-name]')
      .focus()
      .type(newQuizName)
    
    // Edit quiz details submit
    cy.get('button[type=submit]')
      .click()

    // Click logo to return to dasboard
    cy.get('h1[id=logo]')
      .click()

    // click start quiz button
    cy.get('button[id=start-quiz]')
      .click()

    // click end quiz button
    cy.get('button[id=end-quiz]')
      .click()

    // click yes to results
    cy.get('button[id=yes-result]')
      .click()
    
    // logout
    cy.get('h2[id=logout]')
      .click()

    // log back in
    // Type email
    cy.get('input[name=email]')
      .focus()
      .type(email)

    // Type password
    cy.get('input[name=password]')
      .focus()
      .type(password)

    // Click Submit
    cy.get('button[type=submit]')
      .click()
  })
});