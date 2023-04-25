import React, { ChangeEvent, SetStateAction, useState } from 'react';
import styles from './loginpage.module.css';
import { Navigate } from 'react-router-dom';

export function LoginPage() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  // const [tokenSt, setTokenSt] = useState('');
  const token = sessionStorage.getItem('auth');

  function handleLogin(e: ChangeEvent<HTMLInputElement>) {
    setLogin(e.target.value);
  }

  function handlePassword(e: ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log('submit', process.env.REACT_APP_API_SERVER);
    // if (!process.env.REACT_APP_API_SERVER) return;
    fetch(process.env.REACT_APP_API_SERVER + '/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({ login, password }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        if (res.error) return;
        const {
          payload: { token },
        } = res;
        console.log(token);
        // setIsUser(true);
        // if (token) {
        sessionStorage.setItem('auth', token);
        window.location.replace('/');
        // router.push('/');
        // }
      });
  }

  return (
    <>
      {token && <Navigate to="/" />}
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <h2 className={styles.h2}>Вход в аккаунт</h2>
        <div>
          Логин{' '}
          <input id="login" type="text" onChange={handleLogin} value={login} />
        </div>
        <div>
          Пароль{' '}
          <input id="password" type="password" onChange={handlePassword} />
        </div>
        <button type="submit">Войти</button>
      </form>
    </>
  );
}
