import React, { ChangeEvent, SetStateAction, useState } from 'react';
import styles from './loginpage.module.css';
import { Navigate } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

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
        if (res.error) {
          console.log(res.error);
          return;
        }
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
      <Paper
        elevation={7}
        sx={{
          padding: '25px 50px',
          // flexBasis: 500,
          borderRadius: 9,
          backgroundColor: '#F3F4F6',
        }}
      >
        <h2>Новый перевод</h2>
        <div className={styles.newRemittanceCont}>
          <div className={styles.textFieldCont}>
            <TextField
              required
              id="outlined-basic2"
              label="Логин"
              variant="outlined"
              sx={{ marginBottom: '25px', width: 300 }}
            />
            <TextField
              required
              id="outlined-basic2"
              label="Пароль"
              type="password"
              variant="outlined"
              sx={{ width: 300 }}
            />
          </div>
          <Button variant="contained" sx={{ padding: '14px 40px' }}>
            отправить
          </Button>
        </div>
      </Paper>
    </>
  );
}
