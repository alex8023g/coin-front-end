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
});

describe('Создание нового счета и перевод на него средств', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4000/login');
    cy.get('#login').type('developer');
    cy.get('#outlined-adornment-password').type('skillbox');
    cy.contains('отправить').click();
  });

  it('создание счета', () => {
    cy.get('.accCard')
      .then((elements) => elements.length)
      .then((accAmount) => {
        cy.log(String(accAmount));
        cy.contains('создать новый счет').click();
        cy.get('.accCard').should('have.length', accAmount + 1);
      });
  });

  it('перевод средств на новый счет', () => {
    cy.get('.accBalance')
      .last()
      .then((el) => el.text())
      .then((accBalance) => {
        cy.log(accBalance);
        cy.get('.accNumber')
          .last()
          .then((el) => el.text())
          .then((toAccNumber) => {
            cy.log(toAccNumber);
            cy.get('.accCard').first().find('button').click();
            cy.get('input').eq(0).type(toAccNumber);
            cy.get('input').eq(1).type('100');
            cy.get('button').contains('отправить').click();
            cy.get('button').contains('вернуться назад').click();
          });
        cy.get('.accBalance')
          .last()
          .should(
            'have.text',
            String(Number(accBalance.slice(0, -2)) + 100) + ' ₽'
          );
      });
  });

  it('перевод средств с нового счета', () => {
    cy.get('.accBalance')
      .first()
      .then((el) => el.text())
      .then((accBalance) => {
        cy.log(accBalance);
        cy.get('.accNumber')
          .first()
          .then((el) => el.text())
          .then((toAccNumber) => {
            cy.log(toAccNumber);
            cy.get('.accCard').last().find('button').click();
            cy.get('input').eq(0).type(toAccNumber);
            cy.get('input').eq(1).type('50');
            cy.get('button').contains('отправить').click();
            cy.get('button').contains('вернуться назад').click();
          });
        cy.get('.accBalance')
          .first()
          .should(
            'have.text',
            String(Number(accBalance.slice(0, -2)) + 50) + ' ₽'
          );
      });
  });
});
