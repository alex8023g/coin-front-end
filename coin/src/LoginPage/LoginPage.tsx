import React, { ChangeEvent, SetStateAction, useState } from 'react';
import styles from './loginpage.module.css';
import { Navigate } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { typeMsg } from '../AccountPage';

export function LoginPage() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isMsgOpen, setIsMsgOpen] = useState(false);
  const [textMsg, setTextMsg] = useState('');
  const [typeMsg, setTypeMsg] = useState<typeMsg>('success');
  const [isLogInvalid, setLogIsInvalid] = useState(false);
  const [isPassInvalid, setPassIsInvalid] = useState(false);

  const token = sessionStorage.getItem('auth');

  function handleLogin(e: ChangeEvent<HTMLInputElement>) {
    setLogin(e.target.value);
    if (!e.target.value) {
      setLogIsInvalid(false);
    } else if (e.target.value.length < 6 || e.target.value.includes(' ')) {
      setLogIsInvalid(true);
    } else {
      setLogIsInvalid(false);
    }
  }

  function handlePassword(e: ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value);
    if (!e.target.value) {
      setPassIsInvalid(false);
    } else if (e.target.value.length < 6 || e.target.value.includes(' ')) {
      setPassIsInvalid(true);
    } else {
      setPassIsInvalid(false);
    }
  }

  function handleSubmit2(e: React.FormEvent) {
    e.preventDefault();
    console.log('submit', process.env.REACT_APP_API_SERVER);
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
      {/* <form className={styles.loginForm} onSubmit={handleSubmit}>
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
      </form> */}
      <Box
        component="form"
        // position="relative"
        // top="20%"
        height="65vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        // onSubmit={(e) => {
        //   e.preventDefault();
        //   console.log('submit');
        // }}
        onSubmit={handleSubmit}
      >
        <Paper
          elevation={7}
          sx={{
            padding: '50px 85px 50px 40px',
            // width: 500,
            height: '280px',
            // flexBasis: 500,
            borderRadius: 9,
            backgroundColor: '#F3F4F6',
          }}
        >
          <h2 className={styles.h2}>Вход в аккаунт</h2>

          <div className={styles.loginCont}>
            <span className={styles.spanLogPass}>Логин</span>
            <TextField
              error={isLogInvalid}
              helperText={
                isLogInvalid && 'Логин д.б. > 6 символов и без пробелов '
              }
              required
              id="outlined-basic2"
              label="Логин"
              variant="outlined"
              onChange={handleLogin}
              sx={{ width: 300 }}
            />
          </div>
          <div className={styles.passCont}>
            <span className={styles.spanLogPass}>Пароль</span>
            <TextField
              required
              id="outlined-basic3"
              label="Пароль2"
              // type="password"
              variant="outlined"
              onChange={handlePassword}
              sx={{ width: 300 }}
              type={showPassword ? 'text' : 'password'}
            />
            {/* <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => {
                    setShowPassword(!showPassword);
                  }}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
              DDD
            </TextField> */}

            <FormControl sx={{ width: 300 }} variant="outlined" required>
              <InputLabel htmlFor="outlined-adornment-password">
                Пароль
              </InputLabel>
              <OutlinedInput
                error={isLogInvalid}
                id="outlined-adornment-password"
                onChange={handlePassword}
                type={showPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => {
                        setShowPassword(!showPassword);
                      }}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Пароль1S"
              />
            </FormControl>
          </div>

          <Button
            type="submit"
            variant="contained"
            sx={{ marginLeft: '77px', padding: '14px 40px' }}
          >
            отправить
          </Button>
        </Paper>
      </Box>
    </>
  );
}
