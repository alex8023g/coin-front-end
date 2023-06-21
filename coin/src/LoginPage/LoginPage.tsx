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
import FormHelperText from '@mui/material/FormHelperText';
import { Message } from '../Message';
import { loginApi } from '../api/loginApi';

export function LoginPage() {
  const [login, setLogin] = useState('developer');
  const [password, setPassword] = useState('skillbox');
  const [showPassword, setShowPassword] = useState(false);
  const [isMsgOpen, setIsMsgOpen] = useState(false);
  const [textMsg, setTextMsg] = useState('');
  const [typeMsg, setTypeMsg] = useState<typeMsg>('success');
  const [isLogInvalid, setLogIsInvalid] = useState(false);
  const [isPassInvalid, setPassIsInvalid] = useState(false);

  const token = sessionStorage.getItem('auth');
  if (token) {
    sessionStorage.removeItem('auth');
  }

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

    loginApi(login, password).then(({ payload, error }) => {
      console.log(payload, error);
      if (error) {
        console.log(error);
        setIsMsgOpen(true);
        setTypeMsg('error');
        setTextMsg(error);
        return;
      }
      const { token } = payload;
      console.log(token);
      sessionStorage.setItem('auth', token);
      window.location.replace('/');
    });
  }

  return (
    <>
      {token && <Navigate to="/" />}

      <Box
        component="form"
        height="65vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        onSubmit={handleSubmit}
      >
        <Paper
          elevation={7}
          sx={{
            padding: '50px 85px 50px 40px',

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
                isLogInvalid ? 'Пароль д.б. > 6 символов и без пробелов' : ' '
              }
              required
              id="login"
              label="Логин"
              variant="outlined"
              value={login}
              onChange={handleLogin}
              sx={{ width: 300 }}
            />
          </div>
          <div className={styles.passCont}>
            <span className={styles.spanLogPass}>Пароль</span>

            <FormControl sx={{ width: 300 }} variant="outlined" required>
              <InputLabel
                error={isPassInvalid}
                htmlFor="outlined-adornment-password"
              >
                Пароль
              </InputLabel>
              <OutlinedInput
                error={isPassInvalid}
                id="outlined-adornment-password"
                value={password}
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
                label="Пароль"
              />
              <FormHelperText error>
                {isPassInvalid
                  ? 'Пароль д.б. > 6 символов и без пробелов'
                  : ' '}
              </FormHelperText>
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
      <Message
        isMsgOpen={isMsgOpen}
        setIsMsgOpen={setIsMsgOpen}
        textMsg={textMsg}
        typeMsg={typeMsg}
      />
    </>
  );
}
