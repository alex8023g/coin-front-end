import React, { useEffect, useState } from 'react';
import styles from './accountpage.module.css';
import { Link, useParams } from 'react-router-dom';
import { Button, Paper, TextField } from '@mui/material';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { IAccount } from '../HomePage';

export function AccountPage() {
  const [accData, setAccData] = useState<IAccount>({
    account: '',
    balance: 0,
    main: true,
    transactions: [],
  });
  const { account } = useParams();
  // console.log(window.location.href.split('/').at(-1));

  const token = sessionStorage.getItem('auth');

  useEffect(() => {
    fetch(process.env.REACT_APP_API_SERVER + '/account/' + account, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: `Basic ${token}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res.payload);
        setAccData(res.payload);
      });
  }, [token]);

  return (
    <>
      <div className={styles.firstLineContainer}>
        <div>
          <h1 className={styles.title}>Просмотр счета</h1>
          <p>№ {accData.account}</p>
        </div>
        <div>
          <Link to={'/'}>
            <Button
              variant="contained"
              // onClick={createAccount}
              sx={{ p: '14px 24px 14px 18px', borderRadius: 2 }}
            >
              <KeyboardBackspaceIcon sx={{ mr: 1 }} />
              вернуться назад
            </Button>
          </Link>
          <p>
            <span className={styles.spanBalance}>Баланс</span>
            <span style={{ float: 'right' }}>{accData.balance} ₽</span>
          </p>
        </div>
      </div>
      <div className={styles.secondLineContainer}>
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
                id="outlined-basic2"
                label="Номер счета получателя"
                variant="outlined"
                sx={{ marginBottom: '25px', width: 300 }}
              />
              <TextField
                id="outlined-basic2"
                label="Сумма перевода"
                variant="outlined"
                sx={{ width: 300 }}
              />
            </div>
            <Button variant="contained" sx={{ padding: '14px 35px' }}>
              <MailOutlineIcon sx={{ marginRight: '7px' }} />
              отправить
            </Button>
          </div>
        </Paper>
        <Paper
          elevation={7}
          sx={{
            padding: '25px 50px',
            // width: '1500px',
            // flexBasis: 1500,
            borderRadius: 9,
          }}
        >
          <h2>Динамика баланса</h2>
        </Paper>
      </div>
    </>
  );
}
