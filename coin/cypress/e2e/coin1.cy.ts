/// <reference types="cypress" />

describe('Проверка авторизации', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4000/login');
  });
  it('Нет такого пользователя', () => {
    cy.get('#login').type('wrongLogin');
    cy.get('#outlined-adornment-password').type('skillbox');
    cy.contains('отправить').click();
    cy.get('div').should('contain.text', 'No such user');
  });
  it('Неверный пароль', () => {
    cy.get('#login').type('developer');
    cy.get('#outlined-adornment-password').type('wrongPassword');
    cy.contains('отправить').click();
    cy.get('div').should('contain.text', 'Invalid password');
  });
  it('Успешная авторизация', () => {
    cy.get('#login').type('developer');
    cy.get('#outlined-adornment-password').type('skillbox');
    cy.contains('отправить').click();
    cy.get('h1').should('contain.text', 'Ваши счета');
  });

  it('создание счета', () => {
    // cy.get('#login').type('wrongLogin');
    // cy.get('#outlined-adornment-password').type('skillbox');
    cy.contains('создать новый счет').click();
    // cy.get('div').should('contain.text', 'No such user');
  });
});

// describe('Создание нового счета и перевод на него средств', () => {
//   beforeEach(() => {
//     cy.visit('http://localhost:4000/login');
//     cy.get('#login').type('developer');
//     cy.get('#outlined-adornment-password').type('skillbox');
//     cy.contains('отправить').click();
//   });

//   // it('Неверный пароль', () => {
//   //   cy.get('#login').type('developer');
//   //   cy.get('#outlined-adornment-password').type('wrongPassword');
//   //   cy.contains('отправить').click();
//   //   cy.get('div').should('contain.text', 'Invalid password');
//   // });
//   // it('Успешная авторизация', () => {
//   //   cy.get('#login').type('developer');
//   //   cy.get('#outlined-adornment-password').type('skillbox');
//   //   cy.contains('отправить').click();
//   //   cy.get('h1').should('contain.text', 'Ваши счета');
//   // });
// });
